import Base from './Base'
import { str2Date } from '../../filter/time'
import Filter from './Filter'
import { lowerSlash, startWith } from '../../filter/str'
import { MessageBox, Notification as NotificationBox } from 'element-ui'
import Schema from '../../../../node_modules/async-validator'

export default class BaseEntity extends Base {

  constructor (args) {
    super(args)
    this.uuid = null
    this.sort = null
    this.createTime = null
    this.modifyTime = null
    this.deleted = false

    //表单验证专用
    this.validatorSchema = null
  }

  //This is just a intermedia method.
  render (obj, one2one = false) {

    super.render(obj)
    this.createTime = str2Date(this.createTime)
    this.modifyTime = str2Date(this.modifyTime)

  }

  //获取过滤器，必须每次动态生成，否则会造成filter逻辑混乱。
  getFilters () {
    return [
      new Filter('SORT', 'ID', 'orderId')
    ]
  };

  //获取表单的验证规则
  getSchema () {

    return null

  }


//该实体目前是否能够编辑
  canEdit () {
    console.error('canEdit: you should override this base method.')
  }

//该实体目前是否能够删除
  canDel () {
    console.error('canDel: you should override this base method.')
  }

  getForm () {
    console.error('getForm: you should override this base method.')
  }

  /*validate () {
    console.error('validate: you should override this base method.')
  }*/

  validate (validatorSchema = this.validatorSchema) {
    let valid = true
    let that = this
    let schema = validatorSchema
    if (!schema) {
      return true
    }

    let validateArr = Object.keys(schema)      //遍历规则的key值
    let validateObj = {}
    validateArr.forEach(function (i) {
      validateObj[i] = that[i]
      schema[i].error = null
    })
    let descriptor = {}
    validateArr.forEach(function (i) {
      descriptor[i] = schema[i].rules
    })

    new Schema(descriptor).validate(validateObj, (errors, fields) => {

      if (errors) {
        errors.forEach(function (i) {
          schema[i.field].error = i.message
        })
        valid = false
      }
    })

    return valid
  }

  //common http detail methods.
  httpDetail (successCallback, errorCallback) {

    let that = this
    if (!this.uuid) {

      this.errorMessage = '没有详情！'

      this.defaultErrorHandler(this.errorMessage, errorCallback)

      return
    }

    let url = this.getUrlDetail(this.uuid)

    if (!url) {
      return
    }

    this.detailLoading = true

    this.httpGet(url, {}, function (response) {
      that.detailLoading = false
      that.editMode = true

      that.render(response.data.data)

      successCallback && successCallback(response)

    }, function (response) {

      that.detailLoading = false

      if (typeof errorCallback === 'function') {
        errorCallback()
      } else {
        //没有传入错误处理的方法就采用默认处理方法：toast弹出该错误信息。
        that.defaultErrorHandler(response)
      }
    })

  }

  httpSave (successCallback, errorCallback) {

    let that = this

    let url = this.getUrlCreate()
    if (this.uuid) {
      url = this.getUrlEdit()
    }

    if (!this.validate()) {

      that.defaultErrorHandler(this.errorMessage, errorCallback)
      return
    }

    this.httpPost(url, this.getForm(), function (response) {

      that.render(response.data.data)

      successCallback && successCallback(response)

    }, errorCallback)

  }

  httpDel (successCallback, errorCallback) {

    let that = this
    if (!this.uuid) {

      this.errorMessage = '没有uuid，无法删除！'
      that.defaultErrorHandler(this.errorMessage, errorCallback)

      return
    }

    let url = this.getUrlDel(this.uuid)

    if (!url) {
      return
    }

    this.httpPost(url, {}, function (response) {

      successCallback && successCallback(response)

    }, errorCallback)

  }

  httpSort (uuid1, sort1, uuid2, sort2, successCallback, failureCallback) {

    let that = this

    if (!uuid1 || !uuid2 || !(sort1 === 0 || sort1) || !(sort2 === 0 || sort2)) {

      this.errorMessage = '参数不齐！'
      that.defaultErrorHandler(this.errorMessage, failureCallback)

      return
    }

    let url = this.getUrlSort()

    if (!url) {

      that.defaultErrorHandler(this.errorMessage, failureCallback)
      return
    }

    let params = {
      uuid1: uuid1,
      sort1: sort1,
      uuid2: uuid2,
      sort2: sort2
    }

    this.httpPost(url, params, successCallback, failureCallback)
  }

  //确认删除操作.
  confirmDel (successCallback, failureCallback) {

    let that = this

    MessageBox.confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(function () {

        that.httpDel(function () {
          NotificationBox.success({
            message: '成功删除!'
          })

          if (typeof successCallback === 'function') {
            successCallback()
          }

        }, failureCallback)

      },
      function () {
        if (typeof failureCallback === 'function') {
          failureCallback()
        }
      }
    )
  }

  getUrlCreate () {
    let prefix = this.getUrlPrefix()

    return prefix + '/create'
  }

  getUrlDel (uuid = null) {
    let prefix = this.getUrlPrefix()

    if (uuid === null) {
      return prefix + '/del/{uuid}'
    } else {
      return prefix + '/del/' + uuid
    }

  }

  getUrlEdit () {
    let prefix = this.getUrlPrefix()

    return prefix + '/edit'
  }

  getUrlDetail (uuid = null) {
    let prefix = this.getUrlPrefix()

    if (uuid === null) {
      return prefix + '/detail/{uuid}'
    } else {
      return prefix + '/detail/' + uuid
    }

  }

  getUrlPage () {
    let prefix = this.getUrlPrefix()

    return prefix + '/page'
  }

  getUrlSort () {
    let prefix = this.getUrlPrefix()

    return prefix + '/sort'
  }

}

