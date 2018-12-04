import BaseEntity from '../base/BaseEntity'

export default class Install extends BaseEntity {

  static URL_VERIFY = '/api/install/verify'
  static URL_TABLE_INFO_LIST = '/api/install/table/info/list'

  constructor(args) {
    super(args)

    //数据库名
    this.mysqlPort = 3306
    this.mysqlHost = "127.0.0.1"
    this.mysqlSchema = "tank"
    this.mysqlUsername = "tank"
    this.mysqlPassword = null

    this.validatorSchema = {
      mysqlPort: {
        rules: [{required: true, message: 'MySQL端口必填'}],
        error: null
      },
      mysqlHost: {
        rules: [{required: true, message: 'MySQL Host必填'}],
        error: null
      },
      mysqlSchema: {
        rules: [{required: true, message: 'MySQL 数据库名必填'}],
        error: null
      },
      mysqlUsername: {
        rules: [{required: true, message: 'MySQL 用户名必填'}],
        error: null
      },
      mysqlPassword: {
        rules: [{required: true, message: 'MySQL 密码必填'}],
        error: null
      }

    }
  }

  render(obj) {
    super.render(obj)
  }

  getForm() {
    return {
      mysqlPort: this.mysqlPort,
      mysqlHost: this.mysqlHost,
      mysqlSchema: this.mysqlSchema,
      mysqlUsername: this.mysqlUsername,
      mysqlPassword: this.mysqlPassword
    }
  }

  validate() {
    return super.validate()
  }

  httpVerify(successCallback, errorCallback) {
    let that = this

    if (!this.validate()) {
      that.safeCallback(errorCallback)("验证不通过");
      return
    }

    this.httpPost(Install.URL_VERIFY, this.getForm(), function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpTableInfoList(successCallback, errorCallback) {
    let that = this

    this.httpPost(Install.URL_TABLE_INFO_LIST, this.getForm(), function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


}
