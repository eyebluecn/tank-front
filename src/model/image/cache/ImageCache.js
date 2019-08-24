import BaseEntity from '../../base/BaseEntity'
import Filter from '../../base/Filter'
import {FilterType} from "../../base/FilterType";
import User from "../../user/User";
import Matter from "../../matter/Matter";

export default class ImageCache extends BaseEntity {

  static URL_DELETE_BATCH = '/api/image/cache/delete/batch'

  constructor(args) {
    super(args)

    this.name = null;
    this.userUuid = null;
    this.matterUuid = null;
    this.matterName = null;
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
  getUrlPrefix() {
    return "/api/image/cache"
  }
  render(obj) {
    super.render(obj)

  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.INPUT, 'User Uuid', 'userUuid', null, null, false),
      new Filter(FilterType.INPUT, 'File Uuid', 'matterUuid', null, null, false)
    ]
  }

  getForm() {
    return {
      uuid: this.uuid ? this.uuid : null
    }
  }

  getResizeUrl() {
    return '/api/alien/preview/' + this.matterUuid + '/' + this.matterName + "?ir=" + this.mode
  }

  getOriginUrl() {
    return '/api/alien/download/' + this.matterUuid + '/' + this.matterName
  }


  httpDeleteBatch(uuids, successCallback, errorCallback) {
    this.httpPost(ImageCache.URL_DELETE_BATCH, {'uuids': uuids}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


}
