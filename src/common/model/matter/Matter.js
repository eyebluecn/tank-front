import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {getMimeType, MimeUtil} from '../../util/MimeUtil'
import {containStr, endWith, getExtension, startWith} from '../../filter/str'
import User from '../user/User'
import UserInputSelection from '../../../backyard/user/widget/UserInputSelection'
import Vue from "vue"

export default class Matter extends BaseEntity {
  constructor(args) {
    super(args)
    this.puuid = null
    this.userUuid = null
    this.dir = false
    this.alien = false
    this.name = null
    this.md5 = null
    this.size = 0
    this.privacy = true
    this.path = null


    /*
    这部分是辅助UI的字段信息
     */
    //作为勾选变量
    this.check = false

    //允许用户选择的文件类型
    this.filter = "*"
    //本地字段
    //允许上传的最大大小。
    this.maxSize = 1024 * 1024 * 1024
    //给用户的提示文字
    this.uploadHint = null
    //浏览器中选择好的原生file，未作任何处理。
    this.file = null
    //当前上传进度的数值 0-1之间
    this.progress = 0
    //实时上传速度 byte/s
    this.speed = 0

  }

  getFilters() {
    return [
      new Filter(Filter.prototype.Type.INPUT, '父级菜单uuid', 'puuid', null, null, false),
      new Filter(Filter.prototype.Type.HTTP_INPUT_SELECTION, '用户', 'userUuid', null, User, false, UserInputSelection),
      new Filter(Filter.prototype.Type.INPUT, '关键字', 'name'),
      new Filter(Filter.prototype.Type.CHECK, '文件夹', 'dir'),
      new Filter(Filter.prototype.Type.SORT, '文件夹', 'orderDir'),
      new Filter(Filter.prototype.Type.SORT, '创建时间', 'orderCreateTime'),
      new Filter(Filter.prototype.Type.SORT, '大小', 'orderSize'),
      new Filter(Filter.prototype.Type.SORT, '名称', 'orderName'),
      new Filter(Filter.prototype.Type.INPUT, '后缀名', 'extensions')
    ]
  }

  static URL_MATTER_CREATE_DIRECTORY = '/matter/create/directory'
  static URL_MATTER_DELETE = '/matter/delete'
  static URL_MATTER_DELETE_BATCH = '/matter/delete/batch'
  static URL_MATTER_RENAME = '/matter/rename'
  static URL_CHANGE_PRIVACY = '/matter/change/privacy'
  static URL_MATTER_MOVE = '/matter/move'
  static URL_MATTER_DOWNLOAD = '/matter/download'
  static URL_MATTER_UPLOAD = '/matter/upload'

  render(obj) {
    super.render(obj)
  }

  getIcon() {

    if (this.dir) {
      return "/static/img/file/folder.svg"
    }

    let mimeType = getMimeType(this.name)
    if (startWith(mimeType, 'application/pdf')) {
      return "/static/img/file/pdf.svg"
    } else if (startWith(mimeType, 'application/msword') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return "/static/img/file/doc.svg"
    } else if (startWith(mimeType, 'application/vnd.ms-powerpoint') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      return "/static/img/file/ppt.svg"
    } else if (startWith(mimeType, 'application/vnd.ms-excel') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      return "/static/img/file/xls.svg"
    } else if (startWith(mimeType, 'audio')) {
      return "/static/img/file/audio.svg"
    } else if (startWith(mimeType, 'video')) {
      return "/static/img/file/video.svg"
    } else if (startWith(mimeType, 'text')) {
      return "/static/img/file/text.svg"
    } else if (startWith(mimeType, 'image')) {
      return "/static/img/file/image.svg"
    } else if (endWith(this.name, 'zip') || endWith(this.name, 'rar') || endWith(this.name, 'rar') || endWith(this.name, '7z')) {
      return "/static/img/file/archive.svg"
    } else {
      return "/static/img/file/file.svg"
    }

  }


  httpCreateDirectory(successCallback, errorCallback) {
    let that = this
    let form = {'userUuid': that.userUuid, 'name': that.name, 'puuid': that.puuid}

    this.httpPost(Matter.URL_MATTER_CREATE_DIRECTORY, form, function (response) {
      that.render(response.data.data)
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpDelete(successCallback, errorCallback) {
    this.httpPost(Matter.URL_MATTER_DELETE, {'uuid': this.uuid}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpDeleteBatch(uuids, successCallback, errorCallback) {
    this.httpPost(Matter.URL_MATTER_DELETE_BATCH, {'uuids': uuids}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpRename(successCallback, errorCallback) {
    let that = this
    this.httpPost(Matter.URL_MATTER_RENAME, {'uuid': this.uuid, 'name': this.name}, function (response) {
      that.render(response.data.data)
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpChangePrivacy(privacy, successCallback, errorCallback) {
    let that = this
    this.httpPost(Matter.URL_CHANGE_PRIVACY, {'uuid': this.uuid, 'privacy': privacy}, function (response) {

      that.privacy = privacy

      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpMove(srcUuids, destUuid, successCallback, errorCallback) {
    let form = {'srcUuids': srcUuids}
    if (destUuid) {
      form.destUuid = destUuid
    } else {
      form.destUuid = 'root'
    }
    this.httpPost(Matter.URL_MATTER_MOVE, form, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


  /*
  以下是和上传相关的内容。
   */

  //从file中装填metaData
  validate() {

    if (!this.file) {
      this.errorMessage = '请选择上传文件'
      return false
    }

    this.name = this.file.name
    if (!this.name) {
      this.errorMessage = '请选择上传文件'
      return false
    }


    if (this.file.size > this.maxSize) {
      this.errorMessage = '文件超出指定大小'
      return false
    }

    this.size = this.file.size

    this.errorMessage = null
    return true

  }

  //验证过滤器有没有误填写，这个方法主要给开发者使用。
  validateFilter() {

    let filter = this.filter
    if (filter === null || filter === '') {
      this.errorMessage = '过滤器设置错误，请检查-1'
      console.error('过滤器设置错误，请检查.-1')
      return false
    }
    if (filter !== '*') {
      let regex1 = /^(image|audio|video|text)(\|(image|audio|video|text))*$/g
      let regex2 = /^(\.[\w]+)(\|\.[\w]+)*$/
      // 测试几种特殊类型 image|audio|video|text

      if (!regex1.test(filter)) {
        //测试后缀名
        if (!regex2.test(filter)) {
          this.errorMessage = '过滤器设置错误，请检查-2'
          console.error('过滤器设置错误，请检查.-2')
          return false
        }
      }
    }

    //validate privacy
    let privacy = this.privacy
    if (privacy !== true) {
      if (privacy !== false) {
        this.errorMessage = 'privacy属性为Boolean类型'
        console.error('privacy属性为Boolean类型.')
        return false
      }
    }

    return true
  }

  //验证用户上传的文件是否符合过滤器
  validateFileType() {
    if (!this.filter) {
      this.errorMessage = '该过滤条件有问题'
      return false
    }
    if (this.filter === '*') {
      this.errorMessage = null
      return true
    }

    let type = getMimeType(this.name)
    let extension = getExtension(this.name)
    let simpleType = type.substring(0, type.indexOf('/'))

    //专门解决android微信浏览器中名字乱命名的bug.
    if (startWith(this.name, 'image%3A')) {
      extension = 'jpg'
      simpleType = 'image'
    } else if (startWith(this.name, 'video%3A')) {
      extension = 'mp4'
      simpleType = 'video'
    } else if (startWith(this.name, 'audio%3A')) {
      extension = 'mp3'
      simpleType = 'audio'
    }

    if (containStr(this.filter, extension)) {
      this.errorMessage = null
      return true
    }

    if (simpleType) {
      if (containStr(this.filter, simpleType)) {
        this.errorMessage = null
        return true
      }
    }
    this.errorMessage = '您上传的文件格式不符合要求'
    return false
  }


  //文件上传
  httpUpload(successCallback, failureCallback) {

    let that = this

    //验证是否装填好
    if (!this.validate()) {
      return
    }

    //验证用户填写的过滤条件是否正确
    if (!this.validateFilter()) {
      return
    }

    //验证是否满足过滤器
    if (!this.validateFileType()) {
      return
    }

    //（兼容性：chrome，ff，IE9及以上）
    let formData = new FormData()

    formData.append('userUuid', that.userUuid)
    formData.append('puuid', that.puuid)
    formData.append('file', that.file)
    formData.append('alien', that.alien)
    formData.append('privacy', that.privacy)


    //闭包
    let lastTimeStamp = new Date().getTime()
    let lastSize = 0
    that.httpPost(Matter.URL_MATTER_UPLOAD, formData, function (response) {

      that.uuid = response.data.data.uuid

      if (typeof successCallback === "function") {
        successCallback()
      }

    }, function (response) {


      that.errorMessage = '上传出错，请稍后重试'
      that.clear()

      that.defaultErrorHandler(response, failureCallback)

    }, {
      progress: function (event) {

        //上传进度。
        that.progress = event.loaded / event.total

        let currentTime = (new Date()).getTime();
        let deltaTime = currentTime - lastTimeStamp;


        //每2s计算一次速度
        if (deltaTime > 1000) {
          lastTimeStamp = currentTime;

          let currentSize = event.loaded;
          let deltaSize = currentSize - lastSize;
          lastSize = currentSize;


          that.speed = (deltaSize / (deltaTime / 1000)).toFixed(0);
        }

      }
    })

  }

  //清除文件
  clear() {

    //filter,privacy不变
    let matter = new Matter()
    matter.filter = this.filter
    matter.privacy = this.privacy
    matter.errorMessage = this.errorMessage
    matter.uploadHint = this.uploadHint
    matter.maxSize = this.maxSize
    this.render(matter)

    //TODO:如果还正在上传东西，那么停止请求。


  }

  getDownloadUrl() {
    return Vue.http.options.root + '/alien/download/' + this.uuid + '/' + this.name
  }

}
