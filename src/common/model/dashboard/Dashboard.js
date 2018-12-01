import BaseEntity from '../base/BaseEntity'

export default class Dashboard extends BaseEntity {


  static URL_API_INVOKE_LIST = '/api/dashboard/invoke/list'

  constructor(args) {
    super(args)
    //网站名称
    this.name = null
  }

  //过去七日分时调用量
  httpInvokeList(successCallback, errorCallback) {
    let that = this
    this.httpPost(Dashboard.URL_API_INVOKE_LIST, {}, successCallback, errorCallback)
  }

}
