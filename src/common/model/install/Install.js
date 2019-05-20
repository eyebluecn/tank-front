import BaseEntity from '../base/BaseEntity'
import Vue from "vue"

export default class Install extends BaseEntity {

  static URL_VERIFY = '/api/install/verify'
  static URL_TABLE_INFO_LIST = '/api/install/table/info/list'
  static URL_ADMIN_LIST = '/api/install/admin/list'
  static URL_CREATE_TABLE = '/api/install/create/table'
  static URL_CREATE_ADMIN = '/api/install/create/admin'
  static URL_VALIDATE_ADMIN = '/api/install/validate/admin'
  static URL_FINISH = '/api/install/finish'

  constructor(args) {
    super(args)

    //数据库名
    this.mysqlPort = 3306
    this.mysqlHost = "127.0.0.1"
    this.mysqlSchema = "tank"
    this.mysqlUsername = "tank"
    this.mysqlPassword = null

    //管理员用户名
    this.adminUsername = null
    this.adminPassword = null
    this.adminRepassword = null

    //表元信息
    this.tableInfoList = []

    //管理员列表
    this.adminList = []

    //数据库连接是否可用
    this.verified = false
    //管理员配置完毕
    this.adminConfigured = false


    this.validatorSchema = {
      mysqlPort: {
        rules: [{required: true, message: 'MySQL required'}],
        error: null
      },
      mysqlHost: {
        rules: [{required: true, message: 'MySQL Host required'}],
        error: null
      },
      mysqlSchema: {
        rules: [{required: true, message: 'MySQL schema required'}],
        error: null
      },
      mysqlUsername: {
        rules: [{required: true, message: 'MySQL username required'}],
        error: null
      },
      mysqlPassword: {
        rules: [{required: true, message: 'MySQL password required'}],
        error: null
      }

    }

    this.adminValidatorSchema = {
      adminUsername: {
        rules: [
          {required: true, message: 'Username required'},
          {
            type: 'string',
            pattern: /^[0-9a-zA-Z_]+$/,
            message: Vue.i18n.t("model.usernameRule")
          }],
        error: null
      },
      adminPassword: {
        rules: [
          {required: true, message: 'Password required'},
          {min: 6, message: Vue.i18n.t("model.passwordRule")}
        ],
        error: null
      },
      adminRepassword: {
        rules: [
          {required: true, message: 'Password required'},
          {min: 6, message: Vue.i18n.t("model.passwordRule")}
        ],
        error: null
      }

    }

  }

  getUrlPrefix() {
    return "/api/install"
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

  validate(validatorSchema = this.validatorSchema) {
    return super.validate(validatorSchema)
  }

  //表创建完毕
  tableCreated() {
    if (!this.tableInfoList || this.tableInfoList.length === 0) {
      return false
    }
    for (let i = 0; i < this.tableInfoList.length; i++) {
      let tableInfo = this.tableInfoList[i]
      if (!tableInfo.tableExist) {
        return false
      }

      if (tableInfo.tableExist && tableInfo.missingFields.length !== 0) {
        return false
      }
    }

    return true;
  }


  httpVerify(successCallback, errorCallback) {
    let that = this

    if (!this.validate()) {
      this.defaultErrorHandler("Validate error", errorCallback)
      return
    }

    this.httpPost(Install.URL_VERIFY, this.getForm(), function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpTableInfoList(successCallback, errorCallback) {
    let that = this

    if (!this.verified) {
      this.defaultErrorHandler("Please verify mysql first", errorCallback)
      return
    }

    this.httpPost(Install.URL_TABLE_INFO_LIST, this.getForm(), function (response) {

      that.tableInfoList.splice(0, that.tableInfoList.length);
      that.tableInfoList.push(...response.data.data)

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpCreateTable(successCallback, errorCallback) {
    let that = this

    if (!this.verified) {
      this.defaultErrorHandler("Please verify mysql first", errorCallback)
      return
    }

    this.httpPost(Install.URL_CREATE_TABLE, this.getForm(), function (response) {

      that.tableInfoList.splice(0, that.tableInfoList.length);
      that.tableInfoList.push(...response.data.data)

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  //获取管理员列表
  httpAdminList(successCallback, errorCallback) {
    let that = this

    if (!this.tableCreated()) {
      this.defaultErrorHandler("Please verify create table first", errorCallback)
      return
    }


    let form = this.getForm()


    this.httpPost(Install.URL_ADMIN_LIST, form, function (response) {


      that.adminList.splice(0, that.adminList.length);
      that.adminList.push(...response.data.data)


      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


  httpCreateAdmin(successCallback, errorCallback) {
    let that = this

    if (!this.tableCreated()) {
      this.defaultErrorHandler("Please verify create table first", errorCallback)
      return
    }


    if (!this.validate(that.adminValidatorSchema)) {
      this.defaultErrorHandler("Validate error", errorCallback)
      return
    }


    if (this.adminPassword !== this.adminRepassword) {
      this.defaultErrorHandler("password not same", errorCallback)
      return
    }


    let form = this.getForm()
    form["adminUsername"] = this.adminUsername
    form["adminPassword"] = this.adminPassword


    this.httpPost(Install.URL_CREATE_ADMIN, form, function (response) {

      that.adminConfigured = true
      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


  //验证管理员账号
  httpValidateAdmin(successCallback, errorCallback) {
    let that = this

    if (!this.tableCreated()) {
      this.defaultErrorHandler("Please verify create table first", errorCallback)
      return
    }

    if (!this.adminUsername || !this.adminPassword) {
      this.defaultErrorHandler("username and password required", errorCallback)
      return
    }

    let form = this.getForm()
    form["adminUsername"] = this.adminUsername
    form["adminPassword"] = this.adminPassword


    this.httpPost(Install.URL_VALIDATE_ADMIN, form, function (response) {

      that.adminConfigured = true
      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


  //完成安装过程
  httpFinish(successCallback, errorCallback) {
    let that = this


    let form = this.getForm()

    this.httpPost(Install.URL_FINISH, form, function (response) {


      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }


}
