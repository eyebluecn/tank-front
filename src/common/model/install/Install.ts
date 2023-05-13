import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import User from '../user/User';
import InstallTableInfo from './InstallTableInfo';
import Base from '../base/Base';

export default class Install extends BaseEntity {
  static URL_VERIFY = '/api/install/verify';
  static URL_TABLE_INFO_LIST = '/api/install/table/info/list';
  static URL_ADMIN_LIST = '/api/install/admin/list';
  static URL_CREATE_TABLE = '/api/install/create/table';
  static URL_CREATE_ADMIN = '/api/install/create/admin';
  static URL_VALIDATE_ADMIN = '/api/install/validate/admin';
  static URL_FINISH = '/api/install/finish';

  //数据库类型
  dbType: string = 'mysql';

  //数据库名
  mysqlPort: number = 3306;
  mysqlHost: string = '127.0.0.1';
  mysqlSchema: string = 'tank';
  mysqlUsername: string = 'tank';
  mysqlPassword: string | null = null;
  mysqlCharset: string = 'utf8';

  //管理员用户名
  adminUsername: string | null = null;
  adminPassword: string | null = null;
  adminRepassword: string | null = null;

  //表元信息
  tableInfoList: InstallTableInfo[] = [];

  //管理员列表
  adminList: User[] = [];

  //数据库连接是否可用
  verified: boolean = false;
  //管理员配置完毕
  adminConfigured: boolean = false;

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);
  }

  getTAG(): string {
    return 'install';
  }

  getMysqlForm() {
    return {
      dbType: this.dbType,
      mysqlHost: this.mysqlHost,
      mysqlPort: this.mysqlPort,
      mysqlSchema: this.mysqlSchema,
      mysqlUsername: this.mysqlUsername,
      mysqlPassword: this.mysqlPassword,
      mysqlCharset: this.mysqlCharset,
    };
  }

  getForm() {
    return {
      dbType: this.dbType,
      mysqlPort: this.mysqlPort,
      mysqlHost: this.mysqlHost,
      mysqlSchema: this.mysqlSchema,
      mysqlUsername: this.mysqlUsername,
      mysqlPassword: this.mysqlPassword,
      mysqlCharset: this.mysqlCharset,
      adminUsername: this.adminUsername,
      adminPassword: this.adminPassword,
    };
  }

  //表创建完毕
  tableCreated() {
    if (!this.tableInfoList || this.tableInfoList.length === 0) {
      return false;
    }
    for (let i = 0; i < this.tableInfoList.length; i++) {
      let tableInfo = this.tableInfoList[i];
      if (!tableInfo.tableExist) {
        return false;
      }

      if (tableInfo.tableExist && tableInfo.missingFields.length !== 0) {
        return false;
      }
    }

    return true;
  }

  httpVerify(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;

    this.httpPost(
      Install.URL_VERIFY,
      this.getMysqlForm(),
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpTableInfoList(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    if (!this.verified) {
      this.defaultErrorHandler('Please verify mysql first', errorCallback);
      return;
    }

    this.httpPost(
      Install.URL_TABLE_INFO_LIST,
      this.getForm(),
      function (response: any) {
        that.tableInfoList.splice(0, that.tableInfoList.length);
        let list = Base.renderList(response.data.data, InstallTableInfo);
        that.tableInfoList.push(...list);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpCreateTable(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    if (!this.verified) {
      this.defaultErrorHandler('Please verify mysql first', errorCallback);
      return;
    }

    this.httpPost(
      Install.URL_CREATE_TABLE,
      this.getForm(),
      function (response: any) {
        that.tableInfoList.splice(0, that.tableInfoList.length);
        that.tableInfoList.push(...response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  //获取管理员列表
  httpAdminList(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    if (!this.tableCreated()) {
      this.defaultErrorHandler(
        'Please verify create table first',
        errorCallback
      );
      return;
    }

    let form = this.getForm();

    this.httpPost(
      Install.URL_ADMIN_LIST,
      form,
      function (response: any) {
        that.adminList = BaseEntity.renderList(response.data.data, User);
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpCreateAdmin(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    if (!this.tableCreated()) {
      this.defaultErrorHandler(
        'Please verify create table first',
        errorCallback
      );
      return;
    }

    if (this.adminPassword !== this.adminRepassword) {
      this.defaultErrorHandler('password not same', errorCallback);
      return;
    }

    let form = this.getForm();

    this.httpPost(
      Install.URL_CREATE_ADMIN,
      form,
      function (response: any) {
        that.adminConfigured = true;
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  //验证管理员账号
  httpValidateAdmin(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    if (!this.tableCreated()) {
      this.defaultErrorHandler(
        'Please verify create table first',
        errorCallback
      );
      return;
    }

    if (!this.adminUsername || !this.adminPassword) {
      this.defaultErrorHandler('username and password required', errorCallback);
      return;
    }

    let form = this.getForm();

    this.httpPost(
      Install.URL_VALIDATE_ADMIN,
      form,
      function (response: any) {
        that.adminConfigured = true;
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  //完成安装过程
  httpFinish(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;

    let form = this.getForm();

    this.httpPost(
      Install.URL_FINISH,
      form,
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }
}
