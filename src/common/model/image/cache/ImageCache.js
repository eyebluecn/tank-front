import BaseEntity from '../../base/BaseEntity'
import Filter from '../../base/Filter'
import {FilterType} from "../../base/FilterType";
import User from "../../user/User";
import Matter from "../../matter/Matter";

export default class ImageCache extends BaseEntity {

  static URL_DELETE = '/api/image/cache/delete'
  static URL_DELETE_BATCH = '/api/image/cache/delete/batch'

  constructor(args) {
    super(args)

    this.userUuid = null;
    this.matterUuid = null;
    this.mode = null;
    this.md5 = null;
    this.size = 0;
    this.path = 0;

    /*
      这部分是辅助UI的字段信息
     */
    //作为勾选变量
    this.check = false

    this.user = new User()
    this.matter = new Matter()
  }

  render(obj) {
    super.render(obj)

  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.INPUT, '用户Uuid', 'userUuid', null, null, false),
      new Filter(FilterType.INPUT, '文件Uuid', 'matterUuid', null, null, false)
    ]
  }

  getForm() {
    return {
      uuid: this.uuid ? this.uuid : null
    }
  }

  getMatterName() {

    return this.path.substr(this.path.lastIndexOf("/") + 1)
  }

  getName() {
    return this.getMatterName() + "?ir=" + this.mode
  }

  getResizeUrl() {
    return '/api/alien/preview/' + this.matterUuid + '/' + this.getName()
  }

  getOriginUrl() {
    return '/api/alien/download/' + this.matterUuid + '/' + this.getMatterName()
  }


  httpDelete(successCallback, errorCallback) {
    this.httpPost(ImageCache.URL_DELETE, {'uuid': this.uuid}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpDeleteBatch(uuids, successCallback, errorCallback) {
    this.httpPost(ImageCache.URL_DELETE_BATCH, {'uuids': uuids}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


}
