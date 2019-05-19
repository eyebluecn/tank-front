import Base from './Base'
import Filter from './Filter'
import {MessageBox, Message} from 'element-ui'
import Schema from 'async-validator'
import {FilterType} from "./FilterType";

export default class BaseEntity extends Base {

  constructor(args) {
    super(args)
    this.uuid = null
    this.sort = null
    this.createTime = null
    this.updateTime = null

    //表单验证专用
    this.validatorSchema = null
  }

  //This is just a intermedia method.
  render(obj) {
    super.render(obj)
    this.renderEntity('createTime', Date)
    this.renderEntity('updateTime', Date)

  }

  //获取过滤器，必须每次动态生成，否则会造成filter逻辑混乱。
  getFilters() {
    return [
      new Filter(FilterType.SORT, 'Sort', 'orderSort'),
      new Filter(FilterType.SORT, 'Sort UpdateTime', 'orderUpdateTime'),
      new Filter(FilterType.SORT, 'Sort CreateTime', 'orderCreateTime')
    ]
  };

  //获取表单的验证规则
  getSchema() {

    return null

  }


//该实体目前是否能够编辑
  canEdit() {
    console.error('canEdit: you should override this base method.')
  }

//该实体目前是否能够删除
  canDel() {
    console.error('canDel: you should override this base method.')
  }

  getForm() {
    console.error('getForm: you should override this base method.')
  }

  /*validate () {
    console.error('validate: you should override this base method.')
  }*/

  validate(validatorSchema = this.validatorSchema) {
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
  httpDetail(successCallback, errorCallback) {

    let that = this
    if (!this.uuid) {

      this.errorMessage = 'No uuid error'

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

      that.safeCallback(successCallback)(response)

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

  httpSave(successCallback, errorCallback) {

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

      that.safeCallback(successCallback)(response)

    }, errorCallback)

  }

  httpDelete(successCallback, errorCallback) {

    let that = this
    if (!this.uuid) {

      this.errorMessage = 'no uuid. cannot delete'
      that.defaultErrorHandler(this.errorMessage, errorCallback)

      return
    }

    let url = this.getUrlDelete(this.uuid)

    if (!url) {
      return
    }

    this.httpPost(url, {}, function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)

  }

  httpSort(uuid1, sort1, uuid2, sort2, successCallback, failureCallback) {

    let that = this

    if (!uuid1 || !uuid2 || !(sort1 === 0 || sort1) || !(sort2 === 0 || sort2)) {

      this.errorMessage = 'params error'
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


  getUrlCreate() {
    let prefix = this.getUrlPrefix()

    return prefix + '/create'
  }

  getUrlDelete(uuid = null) {
    let prefix = this.getUrlPrefix()

    if (uuid === null) {
      return prefix + '/delete?uuid={uuid}'
    } else {
      return prefix + '/delete?uuid=' + uuid
    }
  }

  getUrlEdit() {
    let prefix = this.getUrlPrefix()

    return prefix + '/edit'
  }

  getUrlDetail(uuid = null) {
    let prefix = this.getUrlPrefix()

    if (uuid === null) {
      return prefix + '/detail?uuid={uuid}'
    } else {
      return prefix + '/detail?uuid=' + uuid
    }

  }

  getUrlPage() {
    let prefix = this.getUrlPrefix()

    return prefix + '/page'
  }

  getUrlSort() {
    let prefix = this.getUrlPrefix()

    return prefix + '/sort'
  }

}

