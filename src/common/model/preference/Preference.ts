import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import PreviewConfig from './model/PreviewConfig';
import JsonUtil from '../../util/JsonUtil';
import ScanConfig from './model/ScanConfig';

export default class Preference extends BaseEntity {
  //获取当前登录者的信息
  static URL_API_PREFERENCE_FETCH = '/api/preference/fetch';
  static URL_API_SYSTEM_CLEANUP = '/api/preference/system/cleanup';
  static URL_API_PREFERENCE_EDIT_PREVIEW_CONFIG =
    '/api/preference/edit/preview/config';
  static URL_API_PREFERENCE_EDIT_SCAN = '/api/preference/edit/scan/config';
  static URL_API_PREFERENCE_SCAN_ONCE = '/api/preference/scan/once';

  //网站名称
  name: string = '';

  //logo
  logoUrl: string | null = null;
  faviconUrl: string | null = null;

  //版权信息
  copyright: string = '';
  record: string = '';

  //大小限制
  downloadDirMaxSize: number = -1;
  //文件数量
  downloadDirMaxNum: number = -1;
  //用户默认总大小限制
  defaultTotalSizeLimit: number = -1;
  //回收站保存文件天数
  deletedKeepDays: number = 7;
  //是否允许自主注册
  allowRegister: boolean = false;
  //预览配置
  previewConfig: PreviewConfig = new PreviewConfig();
  //扫描磁盘配置
  scanConfig: ScanConfig = new ScanConfig();
  //后台版本
  version: string | null = null;

  //*****************前端辅助变量***********************/
  //网站是否完成了安装
  installed: boolean = true;

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);

    this.assignEntity('previewConfig', PreviewConfig);
    this.assignEntity('scanConfig', ScanConfig);
  }

  getTAG(): string {
    return 'preference';
  }

  getRecycleBinStatus() {
    return this.deletedKeepDays > 0;
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
      deletedKeepDays: this.deletedKeepDays,
      allowRegister: this.allowRegister,
      previewConfig: JsonUtil.toJson(this.previewConfig.getForm()),
      scanConfig: JsonUtil.toJson(this.scanConfig.getForm()),
    };
  }

  //修改title和favicon
  updateTitleAndFavicon() {
    if (this.faviconUrl) {
      //修改favicon
      let link: any =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = this.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    document.title = this.name;
  }

  httpFetch(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;
    this.httpPost(
      Preference.URL_API_PREFERENCE_FETCH,
      {},
      function (response: any) {
        that.assign(response.data.data);

        that.updateTitleAndFavicon();

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpSystemCleanup(
    password: string,
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;
    this.httpPost(
      Preference.URL_API_SYSTEM_CLEANUP,
      { password },
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpSavePreviewEngine(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    const that = this;
    this.httpPost(
      Preference.URL_API_PREFERENCE_EDIT_PREVIEW_CONFIG,
      this.getForm(),
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpSaveScan(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    const that = this;
    this.httpPost(
      Preference.URL_API_PREFERENCE_EDIT_SCAN,
      this.getForm(),
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpScanOnce(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    this.httpGet(
      Preference.URL_API_PREFERENCE_SCAN_ONCE,
      {},
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }
}
