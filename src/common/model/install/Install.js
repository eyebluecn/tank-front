import BaseEntity from '../base/BaseEntity'

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
    this.adminEmail = null
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

    this.adminValidatorSchema = {
      adminUsername: {
        rules: [
          {required: true, message: '昵称必填'},
          {
            type: 'string',
            pattern: /^[0-9a-zA-Z_]+$/,
            message: '昵称只能包含字母，数字和"_"'
          }],
        error: null
      },
      adminEmail: {
        rules: [
          {required: true, message: '邮箱必填'},
          {
            type: 'string',
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: '邮箱格式不正确'
          }],
        error: null
      },
      adminPassword: {
        rules: [
          {required: true, message: '密码必填'},
          {min: 6, message: '密码长度至少为6位'}
        ],
        error: null
      },
      adminRepassword: {
        rules: [
          {required: true, message: '密码必填'},
          {min: 6, message: '密码长度至少为6位'}
        ],
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
      this.defaultErrorHandler("验证不通过", errorCallback)
      return
    }

    this.httpPost(Install.URL_VERIFY, this.getForm(), function (response) {

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpTableInfoList(successCallback, errorCallback) {
    let that = this

    if (!this.verified) {
      this.defaultErrorHandler("请首先验证数据库连接", errorCallback)
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
      this.defaultErrorHandler("请首先验证数据库连接", errorCallback)
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
      this.defaultErrorHandler("请首先创建数据库表", errorCallback)
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
      this.defaultErrorHandler("请首先创建数据库表", errorCallback)
      return
    }


    if (!this.validate(that.adminValidatorSchema)) {
      this.defaultErrorHandler("验证不通过", errorCallback)
      return
    }


    if (this.adminPassword !== this.adminRepassword) {
      this.defaultErrorHandler("两次密码不一致", errorCallback)
      return
    }


    let form = this.getForm()
    form["adminUsername"] = this.adminUsername
    form["adminEmail"] = this.adminEmail
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
      this.defaultErrorHandler("请首先创建数据库表", errorCallback)
      return
    }

    if (!this.adminEmail || !this.adminPassword) {
      this.defaultErrorHandler("邮箱和密码必填", errorCallback)
      return
    }


    let form = this.getForm()
    form["adminEmail"] = this.adminEmail
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
