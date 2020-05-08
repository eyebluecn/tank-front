import BaseEntity from '../base/BaseEntity'

export default class Preference extends BaseEntity {

  static URL_API_PREFERENCE_FETCH = '/api/preference/fetch'
  static URL_API_SYSTEM_CLEANUP = '/api/preference/system/cleanup'

  constructor(args) {
    super(args)
    //网站名称
    this.name = null

    //logo
    this.logoUrl = null
    this.faviconUrl = null

    //版权信息
    this.copyright = null
    this.record = null

    //大小限制
    this.downloadDirMaxSize = -1
    //文件数量
    this.downloadDirMaxNum = -1
    //用户默认总大小限制
    this.defaultTotalSizeLimit = -1
    //是否允许自主注册
    this.allowRegister = false
    //Office预览链接
    this.officeUrl = null
    //后台版本
    this.version = null

    this.validatorSchema = {
      name: {
        rules: [{required: true, message: '网站名称必填'}],
        error: null
      }
    }
  }

  getUrlPrefix() {
    return "/api/preference"
  }

  render(obj) {
    super.render(obj)
  }


  getForm() {
    return {
      name: this.name,
      logoUrl: this.logoUrl,
      faviconUrl: this.faviconUrl,
      copyright: this.copyright,
      record: this.record,
      downloadDirMaxNum: this.downloadDirMaxNum,
      downloadDirMaxSize: this.downloadDirMaxSize,
      defaultTotalSizeLimit: this.defaultTotalSizeLimit,
      allowRegister: this.allowRegister,
      officeUrl: this.officeUrl
    }
  }

  validate() {
    return super.validate()
  }


  //修改title和favicon
  updateTitleAndFavicon() {

    if (this.faviconUrl) {
      //修改favicon
      let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = this.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    document.title = this.name

  }


  httpFetch(successCallback, errorCallback) {
    let that = this
    this.httpPost(Preference.URL_API_PREFERENCE_FETCH, {}, function (response) {
      that.render(response.data.data)

      that.updateTitleAndFavicon()

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpSystemCleanup(password, successCallback, errorCallback) {
    let that = this
    this.httpPost(Preference.URL_API_SYSTEM_CLEANUP, {password}, function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


}
