import BaseEntity from '../base/BaseEntity'
import {containStr, endWith, getExtension, startWith} from '../../filter/str'
import Vue from 'vue'
import {getMimeType} from "../../util/MimeUtil";

//当前tank处于怎样的步骤中
let Procedure = {
  'FREE': 'FREE',
  'FETCHING_UPLOAD_TOKEN': 'FETCHING_UPLOAD_TOKEN',
  'UPLOADING': 'UPLOADING',
  'FETCHING_DOWNLOAD_TOKEN': 'FETCHING_DOWNLOAD_TOKEN',
  'DOWNLOADING': 'DOWNLOADING'
}

export default class Tank extends BaseEntity {
  constructor(filter = '*', privacy = true, maxSize = 0, uploadHint = null) {
    super()

    /*
    此部分是数据库中的字段
     */
    this.userUuid = null
    this.name = null
    this.matterUuid = null
    this.size = 0
    this.privacy = privacy
    this.url = null
    this.remark = null
    this.confirmed = false

    /*
    此部分是上传的地址和token，临时信息。
     */
    this.uploadTokenUuid = null
    this.uploadUrl = null


    /*
    这部分是辅助UI的字段信息
     */
    //文件的类型，这个一般是由文件名推测出来的。
    this.type = null
    //允许用户选择的文件类型
    this.filter = filter
    //本地字段
    //允许上传的最大大小。
    this.maxSize = maxSize
    //给用户的提示文字
    this.uploadHint = uploadHint
    //浏览器中选择好的原生file，未作任何处理。
    this.file = null
    this.disabled = false
    //当前文件处于哪一个步骤中
    this.procedure = Procedure.FREE
    //当前上传进度的数值 0-1之间
    this.progress = 0
    //实时上传速度 byte/s
    this.speed = 0

  }

  static URL_FETCH_UPLOAD_TOKEN = '/tank/fetch/upload/token'
  static URL_DOWNLOAD = '/tank/download/'
  static URL_CONFIRM = '/tank/confirm'

  render(obj) {
    super.render(obj)

    this.type = getMimeType(this.name)
  }

  getForm() {

    return {
      filename: this.name,
      privacy: this.privacy,
      size: this.size
    }

  }

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


    if(this.file.size > this.maxSize){
      this.errorMessage = '文件超出指定大小'
      return false
    }

    this.size = this.file.size
    this.type = getMimeType(this.name)

    this.type = this.file.type
    if (!this.type) {
      this.type = getMimeType(this.name)
    }
    this.errorMessage = null
    return true

  }

  //具有了这最基本的3种属性，才能叫做“存在”
  exist() {
    return this.name && this.size && this.confirmed
  }

  //公有图片链接。
  publicImgUrl() {
    if (!this.exist()) {
      return null
    }
    if (!this.privacy && this.confirmed) {
      if (startWith(this.type, 'image')) {
        return this.url
      } else {
        return null
      }
    } else {
      return null
    }
  }

  //文件图标。在富文本编辑器中，我们使用图片，其他地方使用图标来表示。
  fileIcon(inEditor = false) {

    let host = window.location.protocol + "//" + window.location.host;
    //给不同的文件准备不同的图标
    if (startWith(this.type, 'application/pdf')) {
      if (inEditor) {
        return host + '/static/img/file/pdf.png'
      } else {
        return 'fa fa-file-pdf-o color-pdf'
      }
    }
    if (startWith(this.type, 'application/msword') || startWith(this.type, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      if (inEditor) {
        return host + '/static/img/file/doc.png'
      } else {
        return 'fa fa-file-word-o color-doc'
      }
    }
    if (startWith(this.type, 'application/vnd.ms-powerpoint') || startWith(this.type, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      if (inEditor) {
        return host + '/static/img/file/ppt.png'
      } else {
        return 'fa fa-file-powerpoint-o color-ppt'
      }
    }
    if (startWith(this.type, 'application/vnd.ms-excel') || startWith(this.type, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      if (inEditor) {
        return host + '/static/img/file/xls.png'
      } else {
        return 'fa fa-file-excel-o color-xls'
      }
    }
    if (startWith(this.type, 'audio')) {
      if (inEditor) {
        return host + '/static/img/file/audio.png'
      } else {
        return 'fa fa-file-audio-o color-audio'
      }
    }
    if (startWith(this.type, 'video')) {
      if (inEditor) {
        return host + '/static/img/file/video.png'
      } else {
        return 'fa fa-file-movie-o color-video'
      }
    }
    if (startWith(this.type, 'text')) {
      if (inEditor) {
        return host + '/static/img/file/text.png'
      } else {
        return 'fa fa-file-text-o color-text'
      }
    }
    if (startWith(this.type, 'image')) {
      if (inEditor) {
        return host + '/static/img/file/image.png'
      } else {
        return 'fa fa-file-image-o color-image'
      }
    }
    if (endWith(this.name, 'zip') || endWith(this.name, 'rar') || endWith(this.name, '7z') || endWith(this.name, 'gz')) {
      if (inEditor) {
        return host + '/static/img/file/archive.png'
      } else {
        return 'fa fa-file-archive-o color-archive'
      }
    }

    if (inEditor) {
      return host + '/static/img/file/file.png'
    } else {
      return 'fa fa-file-o text-success'
    }

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

    let extension = getExtension(this.name)
    let simpleType = this.type.substring(0, this.type.indexOf('/'))

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

  //开始下载
  download() {

    if (this.privacy) {
      window.open(Vue.http.options.root + Tank.URL_DOWNLOAD + this.uuid)
    } else {
      window.open(this.url)
    }

  }

  //在上传的途中，清空一切，从头开始。
  clear() {

    //filter,privacy不变
    let newTank = new Tank()
    newTank.filter = this.filter
    newTank.privacy = this.privacy
    newTank.errorMessage = this.errorMessage
    newTank.uploadHint = this.uploadHint
    newTank.maxSize = this.maxSize

    this.render(newTank)

  }

  //去服务器上汇报自己上传工作已经完成。
  httpConfirm(successMessage, errorMessage) {
    let that = this

    if (!this.uuid) {
      this.errorMessage = '不能正常确认文件'
      return
    }

    this.httpPost(Tank.URL_CONFIRM, {uuid: this.uuid, matterUuid: this.matterUuid}, function (response) {

      that.render(response.data.data);


      if (typeof successMessage === "function") {
        successMessage(response)
      }

    }, errorMessage)
  }

  //获取上传的token
  httpFetchUploadToken(successMessage, errorMessage) {
    let that = this

    if (!this.validate()) {
      return
    }


    this.httpPost(Tank.URL_FETCH_UPLOAD_TOKEN, this.getForm(), function (response) {

      that.render(response.data.data);

      (typeof successMessage === 'function') && successMessage()

    }, errorMessage)
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

    this.procedure = Procedure.FETCHING_UPLOAD_TOKEN
    this.httpFetchUploadToken(function (response) {

      //（兼容性：chrome，ff，IE9及以上）
      let formData = new FormData()

      formData.append('uploadTokenUuid', that.uploadTokenUuid)
      formData.append('file', that.file)

      that.procedure = Procedure.UPLOADING
      that.httpPost(that.uploadUrl, formData, function (response) {

        //上传到tank服务器成功了，更新matterUuid.
        that.matterUuid = response.data.data.uuid

        //去服务器确认文件
        that.httpConfirm(function (response) {

          console.log("确认成功啦！")
          that.procedure = Procedure.FREE

          //已经被自己服务器确认过了
          that.confirmed = true

          if (typeof successCallback === 'function') {
            successCallback(response)
          }

        }, function () {


          that.procedure = Procedure.FREE
          that.errorMessage = '准备去确认，出错啦'
          that.clear()

          that.defaultErrorHandler(response, failureCallback)

        })

      }, function (response) {

        console.log("上传到tank服务器失败", response.data)
        console.log(response)

        that.procedure = Procedure.FREE
        that.errorMessage = '上传出错，请稍后重试'
        that.clear()

        that.defaultErrorHandler(response, failureCallback)

      }, {
        progress: function (event) {

          //上传进度。
          that.progress = event.loaded / event.total

        }
      })
    })

  }

}
Tank.prototype.Procedure = Procedure
