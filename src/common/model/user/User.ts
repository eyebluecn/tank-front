import SafeUtil from '../../util/SafeUtil';
import BaseEntity from '../base/BaseEntity';
import { UserRole } from './UserRole';
import { UserStatus, UserStatusList } from './UserStatus';
import ImageUtil from '../../util/ImageUtil';
import defaultAvatarPath from '../../../assets/image/avatar.png';
import Filter from '../base/filter/Filter';
import SortFilter from '../base/filter/SortFilter';
import InputFilter from '../base/filter/InputFilter';
import SelectionFilter from '../base/filter/SelectionFilter';
import Space from '../space/Space';
import HttpBase from '../base/HttpBase';

export default class User extends BaseEntity {
  //获取当前登录者的信息
  static URL_INFO = '/api/user/info';
  static URL_LOGIN = '/api/user/login';
  static URL_AUTHENTICATION_LOGIN = '/api/user/authentication/login';
  static URL_REGISTER = '/api/user/register';
  static URL_LOGOUT = '/api/user/logout';
  static URL_USER_CHANGE_PASSWORD = '/api/user/change/password';
  static URL_USER_RESET_PASSWORD = '/api/user/reset/password';
  static URL_USER_TOGGLE_STATUS = '/api/user/toggle/status';
  static URL_USER_TRANSFIGURATION = '/api/user/transfiguration';
  static URL_USER_SCAN = '/api/user/scan';
  static URL_USER_SEARCH = '/api/user/search';

  role: UserRole = UserRole.GUEST;
  username: string | null = null;
  password: string | null = null;
  avatarUrl: string | null = null;
  lastIp: string | null = null;
  lastTime: Date = new Date();
  status: UserStatus = UserStatus.OK;
  spaceUuid: string | null = null;
  space: Space = new Space();

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);

    this.assignEntity('lastTime', Date);
    this.assignEntity('space', Space);
  }

  hasLogin(): boolean {
    return this.role !== UserRole.GUEST;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMINISTRATOR;
  }

  getTAG(): string {
    return 'user';
  }

  getFilters(): Filter[] {
    return [
      ...super.getFilters(),
      new SortFilter('按上次登录时间排序', 'orderLastTime'),
      new InputFilter('用户名', 'username', '按用户名搜索'),
      new SelectionFilter('状态', 'status', UserStatusList),
    ];
  }

  getForm(): any {
    return {
      username: this.username,
      password: this.password,
      role: this.role,
      avatarUrl: this.avatarUrl,
      uuid: this.uuid ? this.uuid : null,
    };
  }

  getAvatarUrl(origin: boolean = false) {
    if (this.avatarUrl) {
      return ImageUtil.handleImageUrl(this.avatarUrl, origin);
    } else {
      return defaultAvatarPath;
    }
  }

  //登录
  httpLogin(
    username: string,
    password: string,
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    let form = {
      username,
      password,
    };

    this.httpGet(
      User.URL_LOGIN,
      form,
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  //注册
  httpRegister(
    username: string,
    password: string,
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;

    let form = {
      username,
      password,
    };

    this.httpGet(
      User.URL_REGISTER,
      form,
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  //获取当前登录者的信息
  httpInfo(loginRequired: boolean, finalCallback?: any) {
    let that = this;
    if (loginRequired) {
      // httpGet有统一的登录处理机制
      this.httpGet(
        User.URL_INFO,
        {},
        function (response: any) {
          that.assign(response.data.data);
        },
        null,
        finalCallback
      );
    } else {
      this.httpPureGet(
        User.URL_INFO,
        {},
        function (response: any) {
          that.assign(response.data.data);
        },
        () => {},
        finalCallback
      );
    }
  }

  httpSave(
    limit: {
      sizeLimit: number;
      totalSizeLimit: number;
    },
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    let that = this;

    let url = this.getUrlCreate();
    if (this.uuid) {
      url = this.getUrlEdit();
    }

    this.errorMessage = this.validate();
    if (this.errorMessage) {
      that.defaultErrorHandler(this.errorMessage, errorCallback);
      return;
    }

    this.httpPost(
      url,
      { ...this.getForm(), ...limit },
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finallyCallback
    );
  }

  //退出登录
  httpLogout(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;

    let form = {};

    this.httpGet(
      User.URL_LOGOUT,
      form,
      function (response: any) {
        console.info('退出成功！');

        that.assign(new User());

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finalCallback
    );
  }

  httpChangePassword(
    oldPassword: string,
    newPassword: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    let that = this;
    this.httpPost(
      User.URL_USER_CHANGE_PASSWORD,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpResetPassword(
    password: string,
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    this.httpPost(
      User.URL_USER_RESET_PASSWORD,
      {
        userUuid: this.uuid,
        password: password,
      },
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpToggleStatus(
    successCallback?: any,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;
    this.httpPost(
      User.URL_USER_TOGGLE_STATUS,
      { uuid: this.uuid },
      function (response: any) {
        that.assign(response.data.data);
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  static httpSearch(
    keyword?: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    new HttpBase().httpGet(
      User.URL_USER_SEARCH,
      {
        keyword,
      },
      successCallback,
      errorCallback
    );
  }

  httpAuthenticationLogin(
    authentication: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    let that = this;
    let form = { authentication };
    this.httpPost(
      User.URL_AUTHENTICATION_LOGIN,
      form,
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpTransfiguration(
    successCallback: (text: string) => void,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;
    let form = { uuid: this.uuid };
    this.httpPost(
      User.URL_USER_TRANSFIGURATION,
      form,
      function (response: any) {
        successCallback(response.data.msg);
      },
      errorCallback
    );
  }

  httpScan(
    successCallback: (text: string) => void,
    errorCallback?: any,
    finalCallback?: any
  ) {
    let that = this;
    let form = { uuid: this.uuid };
    this.httpPost(
      User.URL_USER_SCAN,
      form,
      function (response: any) {
        successCallback(response.data.msg);
      },
      errorCallback,
      finalCallback
    );
  }
}
