import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import { UserRole } from './UserRole';


export default class User extends BaseEntity {

  //获取当前登录者的信息
  static URL_INFO = '/api/user/info';

  //用户登录
  static URL_LOGIN = '/api/user/login';

  //用户注册
  static URL_REGISTER = '/api/user/register';

  //退出登录
  static URL_LOGOUT = '/api/user/logout';

  //修改密码
  static URL_CHANGE_PASSWORD = '/api/user/change/password';

  //用户角色
  role: UserRole = UserRole.GUEST;
  //用户名
  username: string | null = null;
  //密码
  password: string | null = null;
  //头像
  avatarUrl: string | null = null;
  //上次登录ip
  lastIp: string | null = null;
  //上次登录时间
  lastTime: string | null = null;
  //状态
  status: string | null = null;

  //是否已经登录
  isLogin: boolean = false;

  constructor(reactComponent?: React.Component) {

    super(reactComponent);

  }


  assign(obj: any) {
    super.assign(obj);

  }

  getForm(): any {
    return {
      username: this.username,
      password: this.password,
      uuid: this.uuid ? this.uuid : null,
    };
  }

  //登录
  httpInfo(successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {};

    this.httpGet(User.URL_INFO, form, function(response: any) {

      that.assign(response.data.data);

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  //登录
  httpLogin(username: string, password: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {
      username,
      password,
    };

    this.httpGet(User.URL_LOGIN, form, function(response: any) {

      that.assign(response.data.data);

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  //注册
  httpRegister(username: string, password: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {
      username,
      password,
    };

    this.httpGet(User.URL_REGISTER, form, function(response: any) {

      that.assign(response.data.data);

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  //注册
  httpLogout(successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {};

    this.httpGet(User.URL_LOGOUT, form, function(response: any) {

      console.info('退出成功！');

      that.role = UserRole.GUEST;

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  //修改密码
  httpChangePassword(oldPassword: string, newPassword: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {
      oldPassword,
      newPassword,
    };

    this.httpPost(User.URL_CHANGE_PASSWORD, form, function(response: any) {

      console.info('修改密码成功！');

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


}




