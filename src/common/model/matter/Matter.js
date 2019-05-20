import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {Message} from 'element-ui'
import {getMimeType} from '../../util/MimeUtil'
import {containStr, endWith, getExtension, startWith} from '../../filter/str'
import User from '../user/User'
import Vue from "vue"
import {FilterType} from "../base/FilterType";
import {handleImageUrl} from "../../util/ImageUtil";
import {currentHost} from "../../util/Utils";
import DownloadToken from "../download/token/DownloadToken";
import FileUtil from "../../util/FileUtil";

export default class Matter extends BaseEntity {

  static URL_MATTER_CREATE_DIRECTORY = '/api/matter/create/directory'
  static URL_MATTER_DELETE = '/api/matter/delete'
  static URL_MATTER_DELETE_BATCH = '/api/matter/delete/batch'
  static URL_MATTER_RENAME = '/api/matter/rename'
  static URL_CHANGE_PRIVACY = '/api/matter/change/privacy'
  static URL_MATTER_MOVE = '/api/matter/move'
  static URL_MATTER_DOWNLOAD = '/api/matter/download'
  static URL_MATTER_UPLOAD = '/api/matter/upload'
  static URL_MATTER_ZIP = '/api/matter/zip'

  static MATTER_ROOT = "root"

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
    this.times = 0;

    this.parent = null;

    /*
    这部分是辅助UI的字段信息
     */
    //作为勾选变量
    this.check = false

    //允许用户选择的文件类型
    this.filter = "*"
    //本地字段
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
      ...super.getFilters(),
      new Filter(FilterType.INPUT, '父级菜单uuid', 'puuid', null, null, false),
      new Filter(FilterType.INPUT, '用户', 'userUuid', null, User, false),
      new Filter(FilterType.INPUT, '关键字', 'name'),
      new Filter(FilterType.CHECK, '文件夹', 'dir'),
      new Filter(FilterType.CHECK, '应用数据', 'alien'),
      new Filter(FilterType.SORT, '文件夹', 'orderDir'),
      new Filter(FilterType.SORT, '下载次数', 'orderTimes'),
      new Filter(FilterType.SORT, '大小', 'orderSize'),
      new Filter(FilterType.SORT, '名称', 'orderName'),
      new Filter(FilterType.INPUT, '后缀名', 'extensions'),
      new Filter(FilterType.INPUT, '分享uuid', 'shareUuid'),
      new Filter(FilterType.INPUT, '提取码', 'shareCode'),
      new Filter(FilterType.INPUT, '分享根目录', 'shareRootUuid')
    ]
  }

  getUrlPrefix() {
    return "/api/matter"
  }

  render(obj) {
    super.render(obj)
    super.renderEntity("parent", Matter)
  }


  isImage() {
    return FileUtil.isImage(this.name)
  }


  isPdf() {
    return FileUtil.isPdf(this.name)
  }

  isText() {
    return FileUtil.isText(this.name)
  }

  isDoc() {
    return FileUtil.isDoc(this.name)
  }

  isPpt() {
    return FileUtil.isPpt(this.name)
  }

  isXls() {
    return FileUtil.isXls(this.name)
  }

  isAudio() {
    return FileUtil.isAudio(this.name)
  }

  isVideo() {
    return FileUtil.isVideo(this.name)
  }

  isPsd() {
    return FileUtil.isPsd(this.name)
  }

  getIcon() {
    if (FileUtil.isImage(this.name)) {
      return handleImageUrl(this.getPreviewUrl(), false, 100, 100)
    } else {
      return FileUtil.getIcon(this.name, this.dir)
    }
  }

  //下载文件
  download(downloadUrl = null) {
    if (!downloadUrl) {
      downloadUrl = this.getDownloadUrl()
    }
    window.open(downloadUrl)
  }

  //下载zip包
  downloadZip(uuidsString) {
    window.open(currentHost() + Matter.URL_MATTER_ZIP + "?uuids=" + uuidsString)
  }

  //预览文件 在分享的预览中才主动传入previewUrl.
  preview(previewUrl = null) {
    let that = this;

    let shareMode = true
    if (previewUrl) {
      shareMode = true
    } else {
      shareMode = false
      previewUrl = that.getPreviewUrl()
    }

    if (that.isImage()) {

      Vue.$photoSwipePlugin.showPhoto(previewUrl)

    } else if (that.isPdf()) {

      Vue.$previewer.previewPdf(that.name, previewUrl, that.size)

    } else if (that.isDoc() || that.isPpt() || that.isXls()) {

      //如果是分享中的预览，直接就可以公有访问。
      if (shareMode) {
        Vue.$previewer.previewOffice(that.name, previewUrl, that.size)
      } else {

        //如果是共有文件 office文件的预览请求一次性链接。
        if (this.privacy) {

          let downloadToken = new DownloadToken()
          downloadToken.httpFetchDownloadToken(that.uuid, function () {
            Vue.$previewer.previewOffice(that.name, that.getPreviewUrl(downloadToken.uuid), that.size)
          })
        } else {
          Vue.$previewer.previewOffice(that.name, previewUrl, that.size)
        }
      }


    } else if (that.isText()) {

      Vue.$previewer.previewText(that.name, previewUrl, that.size)

    } else if (that.isAudio()) {

      Vue.$previewer.previewAudio(that.name, previewUrl, that.size)

    } else if (that.isVideo()) {

      Vue.$previewer.previewVideo(that.name, previewUrl, that.size)

    } else {
      window.open(this.getPreviewUrl())
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


  httpRename(name, successCallback, errorCallback) {
    let that = this
    this.httpPost(Matter.URL_MATTER_RENAME, {'uuid': this.uuid, 'name': name}, function (response) {
      that.render(response.data.data)
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


  httpChangePrivacy(privacy, successCallback, errorCallback) {
    let that = this
    this.httpPost(Matter.URL_CHANGE_PRIVACY, {'uuid': this.uuid, 'privacy': privacy}, function (response) {
      that.privacy = privacy
      if (typeof successCallback === "function") {
        successCallback(response)
      } else {
        Message.success(response.data.msg)
      }
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
    this.render(matter)

  }

  getDownloadUrl(downloadTokenUuid = null) {
    return currentHost() + '/api/alien/download/' + this.uuid + '/' + this.name + (downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : '')
  }

  getPreviewUrl(downloadTokenUuid = null) {
    return currentHost() + '/api/alien/preview/' + this.uuid + '/' + this.name + (downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : '')
  }

  getShareDownloadUrl(shareUuid, shareCode, shareRootUuid) {
    return currentHost() + '/api/alien/download/' + this.uuid + '/' + this.name + '?shareUuid=' + shareUuid + "&shareCode=" + shareCode + "&shareRootUuid=" + shareRootUuid
  }

  getSharePreviewUrl(shareUuid, shareCode, shareRootUuid) {
    return currentHost() + '/api/alien/preview/' + this.uuid + '/' + this.name + '?shareUuid=' + shareUuid + "&shareCode=" + shareCode + "&shareRootUuid=" + shareRootUuid
  }


}
