import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import Filter from '../base/filter/Filter';
import SortFilter from '../base/filter/SortFilter';

export default class Dashboard extends BaseEntity {
  static URL_ACTIVE_IP_TOP10 = '/api/dashboard/active/ip/top10';
  static URL_ETL = '/api/dashboard/etl';

  invokeNum: number = 0;
  totalInvokeNum: number = 0;
  uv: number = 0;
  totalUv: number = 0;
  matterNum: number = 0;
  totalMatterNum: number = 0;
  fileSize: number = 0;
  totalFileSize: number = 0;
  avgCost: number = 0;
  dt: string = '';

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);
  }

  getTAG(): string {
    return 'dashboard';
  }

  getFilters(): Filter[] {
    return [...super.getFilters(), new SortFilter('按DT排序', 'orderDt')];
  }

  httpActiveIpTop10(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;
    this.httpPost(
      Dashboard.URL_ACTIVE_IP_TOP10,
      {},
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response.data.data);
      },
      errorCallback,
      finalCallback
    );
  }

  httpEtl(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;
    this.httpPost(
      Dashboard.URL_ETL,
      {},
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response.data.data);
      },
      errorCallback,
      finalCallback
    );
  }
}
