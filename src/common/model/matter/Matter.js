import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {getMimeType, MimeUtil} from '../../util/MimeUtil'
import {endWith, startWith} from '../../filter/str'

export default class Matter extends BaseEntity {
  constructor(args) {
    super(args)
    this.puuid = null
    this.userUuid = null
    this.dir = false
    this.name = null
    this.md5 = null
    this.size = 0
    this.privacy = true
    this.path = null

    //本地操作变量
    this.newFolderStatus = false
    this.showOperation = false
    this.renameStatus = false
  }

  getFilters() {
    return [
      new Filter(Filter.prototype.Type.INPUT, '父级菜单uuid', 'puuid'),
      new Filter(Filter.prototype.Type.INPUT, '用户ID', 'userUuid'),
      new Filter(Filter.prototype.Type.INPUT, '关键字', 'name'),
      new Filter(Filter.prototype.Type.SORT, '是否是文件夹', 'dir'),
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
  static URL_MATTER_MOVE = '/matter/move'
  static URL_MATTER_DOWNLOAD = '/matter/download'

  render(obj) {
    super.render(obj)
  }

  getIcon() {

    if (this.dir) {
      return "/static/img/file/folder.png"
    }

    let mimeType = getMimeType(this.name)
    if (startWith(mimeType, 'application/pdf')) {
      return "/static/img/file/pdf.png"
    } else if (startWith(mimeType, 'application/msword') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return "/static/img/file/doc.png"
    } else if (startWith(mimeType, 'application/vnd.ms-powerpoint') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      return "/static/img/file/ppt.png"
    } else if (startWith(mimeType, 'application/vnd.ms-excel') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      return "/static/img/file/xls.png"
    } else if (startWith(mimeType, 'audio')) {
      return "/static/img/file/audio.png"
    } else if (startWith(mimeType, 'video')) {
      return "/static/img/file/video.png"
    } else if (startWith(mimeType, 'text')) {
      return "/static/img/file/text.png"
    } else if (startWith(mimeType, 'image')) {
      return "/static/img/file/image.png"
    } else if (endWith(this.name, 'zip') || endWith(this.name, 'rar') || endWith(this.name, 'rar') || endWith(this.name, '7z')) {
      return "/static/img/file/archive.png"
    } else {
      return "/static/img/file/file.png"
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

  httpDownload(successCallback, errorCallback) {
    this.httpPost(Matter.URL_MATTER_DOWNLOAD, {'uuid': this.uuid}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

}
