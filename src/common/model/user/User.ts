import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import {UserRole} from './UserRole';
import {UserStatus} from "./UserStatus";
import ImageUtil from "../../util/ImageUtil";
import defaultAvatarPath from "../../../assets/image/avatar.png";

export default class User extends BaseEntity {

  //获取当前登录者的信息
  static URL_INFO = '/api/user/info';
  static URL_LOGIN = '/api/user/login'
  static URL_AUTHENTICATION_LOGIN = '/api/user/authentication/login'
  static URL_REGISTER = '/api/user/register'
  static URL_LOGOUT = '/api/user/logout'
  static URL_USER_CHANGE_PASSWORD = '/api/user/change/password'
  static URL_USER_RESET_PASSWORD = '/api/user/reset/password'
  static URL_USER_TOGGLE_STATUS = '/api/user/toggle/status'
  static URL_USER_TRANSFIGURATION = '/api/user/transfiguration'

  role: UserRole = UserRole.GUEST
  username: string | null = null
  password: string | null = null
  avatarUrl: string | null = null
  lastIp: string | null = null
  lastTime: string | null = null
  //默认大小限制100Mb.
  sizeLimit: number = 104857600
  totalSize: number = 0
  totalSizeLimit: number = -1
  status: UserStatus = UserStatus.OK


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
      role: this.role,
      avatarUrl: this.avatarUrl,
      sizeLimit: this.sizeLimit,
      totalSizeLimit: this.totalSizeLimit,
      uuid: this.uuid ? this.uuid : null
    };
  }


  getAvatarUrl(origin: boolean = false) {
    if (this.avatarUrl) {
      return ImageUtil.handleImageUrl(this.avatarUrl, origin)
    } else {
      return defaultAvatarPath
    }
  }

  //登录
  httpLogin(username: string, password: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {
      username,
      password,
    };

    this.httpGet(User.URL_LOGIN, form, function (response: any) {

      that.assign(response.data.data);

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }

  //获取当前登录者的信息
  httpInfo(successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {};

    this.httpGet(User.URL_INFO, form, function (response: any) {

      that.assign(response.data.data);

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  //退出登录
  httpLogout(successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this;

    let form = {};

    this.httpGet(User.URL_LOGOUT, form, function (response: any) {

      console.info('退出成功！');

      that.assign(new User())

      SafeUtil.safeCallback(successCallback)(response);

    }, errorCallback, finalCallback);

  }


  httpChangePassword(oldPassword: string, newPassword: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    this.httpPost(User.URL_USER_CHANGE_PASSWORD, {
      'oldPassword': oldPassword,
      'newPassword': newPassword
    }, function (response: any) {

      SafeUtil.safeCallback(successCallback)(response);


    }, errorCallback)
  }

  httpResetPassword(password: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {
    this.httpPost(User.URL_USER_RESET_PASSWORD, {
      'userUuid': this.uuid,
      'password': password
    }, function (response: any) {


      SafeUtil.safeCallback(successCallback)(response);


    }, errorCallback)
  }


  httpToggleStatus(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    this.httpPost(User.URL_USER_TOGGLE_STATUS, {'uuid': this.uuid}, function (response: any) {


      SafeUtil.safeCallback(successCallback)(response);


    }, errorCallback)
  }

  httpAuthenticationLogin(authentication: string, successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    let form = {authentication}
    this.httpPost(User.URL_AUTHENTICATION_LOGIN, form, function (response: any) {


      SafeUtil.safeCallback(successCallback)(response);


    }, errorCallback)
  }

  httpTransfiguration(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this
    let form = {'uuid': this.uuid}
    this.httpPost(User.URL_USER_TRANSFIGURATION, form, function (response: any) {

      SafeUtil.safeCallback(successCallback)(response);


    }, errorCallback)
  }

}




