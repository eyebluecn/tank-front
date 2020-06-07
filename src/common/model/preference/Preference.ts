import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';


export default class Preference extends BaseEntity {

  //获取当前登录者的信息
  static URL_API_PREFERENCE_FETCH = '/api/preference/fetch'
  static URL_API_SYSTEM_CLEANUP = '/api/preference/system/cleanup'

  //网站名称
  name: string = ""

  //logo
  logoUrl: string | null = null
  faviconUrl: string | null = null

  //版权信息
  copyright: string | null = null
  record: string | null = null

  //大小限制
  downloadDirMaxSize: number = -1
  //文件数量
  downloadDirMaxNum: number = -1
  //用户默认总大小限制
  defaultTotalSizeLimit: number = -1
  //是否允许自主注册
  allowRegister: boolean = false
  //Office预览链接
  officeUrl: string | null = null
  //后台版本
  version: string | null = null


  //*****************前端辅助变量***********************/
  //网站是否完成了安装
  installed: boolean = true

  constructor(reactComponent?: React.Component) {

    super(reactComponent);

  }


  assign(obj: any) {
    super.assign(obj);

  }

  getForm(): any {
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
    };
  }


  //修改title和favicon
  updateTitleAndFavicon() {

    if (this.faviconUrl) {
      //修改favicon
      let link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = this.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    document.title = this.name

  }

  httpFetch(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    this.httpPost(Preference.URL_API_PREFERENCE_FETCH, {}, function (response: any) {

      that.assign(response.data.data);

      that.updateTitleAndFavicon()

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback)
  }

  httpSystemCleanup(password: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    this.httpPost(Preference.URL_API_SYSTEM_CLEANUP, {password}, function (response: any) {

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback)
  }


}




