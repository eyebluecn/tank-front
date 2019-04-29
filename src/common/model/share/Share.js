import BaseEntity from '../base/BaseEntity'
import {ShareType} from "./ShareType";
import {simpleDateTime} from "../../filter/time";
import {ShareExpireOption, ShareExpireOptionMap} from "./ShareExpireOption";
import FileUtil from "../../util/FileUtil";
import Matter from "../matter/Matter";


export default class Share extends BaseEntity {

  static URL_CREATE = '/api/share/create'
  static URL_BROWSE = '/api/share/browse'
  static URL_DELETE_BATCH = '/api/share/delete/batch'

  constructor(args) {
    super(args)

    this.name = null
    this.shareType = ShareType.MIX
    this.userUuid = 0;
    this.username = null;
    this.downloadTimes = 0;
    this.code = 0;
    this.expireInfinity = false;
    this.expireTime = null;

    //当前正在查看的文件夹
    this.dirMatter = new Matter()
    //当前share对应的matters
    this.matters = []


    //本地临时字段
    this.expireOption = ShareExpireOption.MONTH


  }


  render(obj) {
    super.render(obj)

    this.renderEntity("expireTime", Date)
    this.renderEntity("dirMatter", Matter)
    this.renderList("matters", Matter)


  }

  getFilters() {
    return [
      ...super.getFilters()
    ]
  }

  getForm() {
    return {
      name: this.name,
      uuid: this.uuid ? this.uuid : null
    }
  }

  getIcon() {
    if (this.shareType === ShareType.MIX) {
      return "/static/img/file/archive.svg"
    } else {
      return FileUtil.getIcon(this.name, this.shareType === ShareType.DIRECTORY)
    }

  }

  //获取过期时间
  getExpireTime() {
    let delta = ShareExpireOptionMap[this.expireOption].deltaMillisecond
    let now = new Date()
    return new Date(now.getTime() + delta)
  }

  //创建一个分享.matterUuids要求为数组，expireTime要求为时间对象
  httpCreate(matterUuids, successCallback, errorCallback) {
    let that = this

    let form = {
      matterUuids: matterUuids.toString(),
      expireInfinity: this.expireOption === ShareExpireOption.INFINITY,
      expireTime: simpleDateTime(this.getExpireTime())
    }

    this.httpPost(Share.URL_CREATE, form, function (response) {

      that.render(response.data.data)

      that.safeCallback(successCallback)()

    }, errorCallback)
  }

  httpDeleteBatch(uuids, successCallback, errorCallback) {
    this.httpPost(Share.URL_DELETE_BATCH, {'uuids': uuids}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


  httpBrowse(puuid, rootUuid, successCallback, errorCallback) {
    let that = this

    let form = {
      puuid,
      rootUuid,
      shareUuid: this.uuid,
      code: this.code
    }

    this.httpPost(Share.URL_BROWSE, form, function (response) {

      that.render(response.data.data)

      typeof successCallback === 'function' && successCallback(response)

    }, errorCallback)
  }


}
