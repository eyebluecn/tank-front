import BaseEntity from '../base/BaseEntity'
import Filter from "../base/Filter";
import {FilterType} from "../base/FilterType";
import {lowerSlash} from "../../common/filter/str";

export default class Dashboard extends BaseEntity {

  static URL_ACTIVE_IP_TOP10 = "/api/dashboard/active/ip/top10"

  constructor(args) {
    super(args)

    this.invokeNum = 0;
    this.totalInvokeNum = 0;
    this.uv = 0;
    this.totalUv = 0;
    this.matterNum = 0;
    this.totalMatterNum = 0;
    this.fileSize = 0;
    this.totalFileSize = 0;
    this.avgCost = 0;
    this.dt = 0;
  }

  //获取到当前实体的url前缀。
  getUrlPrefix() {
    return "/api/dashboard"
  }

  render(obj) {
    super.render(obj)

  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.SORT, 'Sort Dt', 'orderDt')
    ]
  }

  httpActiveIpTop10(successCallback, errorCallback) {
    let that = this
    this.httpPost(Dashboard.URL_ACTIVE_IP_TOP10, {}, successCallback, errorCallback)
  }

}
