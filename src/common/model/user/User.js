import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {readLocalStorage, removeLocalStorage, saveToLocalStorage} from "../../util/Utils";
import UserInputSelection from '../../../backyard/user/widget/UserInputSelection'
import {UserRole} from "./UserRole";
import {UserStatus, UserStatusList} from "./UserStatus";
import {UserGender} from "./UserGender";
import {FilterType} from "../base/FilterType";


export default class User extends BaseEntity {

  static LOCAL_STORAGE_KEY = "user";
  static URL_LOGIN = '/api/user/login'
  static URL_LOGOUT = '/api/user/logout'
  static URL_USER_CHANGE_PASSWORD = '/api/user/change/password'
  static URL_USER_RESET_PASSWORD = '/api/user/reset/password'
  static URL_USER_DISABLE = '/api/user/disable'
  static URL_USER_ENABLE = '/api/user/enable'

  constructor(args) {
    super(args)
    this.role = UserRole.GUEST
    this.username = null
    this.password = null
    this.email = null
    this.phone = null
    this.gender = UserGender.MALE
    this.city = null
    this.avatarUrl = null
    this.lastIp = null
    this.lastTime = null
    //默认大小限制100Mb.
    this.sizeLimit = 104857600
    this.status = UserStatus.OK

    //local fields
    this.isLogin = false

    //登录的密码，服务器返回字段中没有密码
    this.localPassword = null

    this.validatorSchema = {
      username: {
        rules: [
          {required: true, message: '昵称必填'},
          {
            type: 'string',
            pattern: /^[0-9a-zA-Z_]+$/,
            message: '昵称只能包含字母，数字和"_"'
          }],
        error: null
      },
      password: {
        rules: [
          {required: true, message: '密码必填'},
          {min: 6, message: '密码长度至少为6位'}
        ],
        error: null
      },
      email: {
        rules: [
          {required: true, message: '邮箱必填'},
          {
            type: 'string',
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: '邮箱格式不正确'
          }],
        error: null
      }
    }
  }

  render(obj) {
    super.render(obj)
    this.renderEntity('lastTime', Date)
  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.HTTP_INPUT_SELECTION, '用户', 'username', null, User, true, UserInputSelection),
      new Filter(FilterType.INPUT, '邮箱', 'email'),
      new Filter(FilterType.INPUT, '手机号', 'phone'),
      new Filter(FilterType.SELECTION, '状态', 'status', UserStatusList),
      new Filter(FilterType.SORT, '最新更新时间', 'orderLastTime')
    ]
  }

  //将用户信息存储在本地。
  renderFromLocalStorage() {

    try {
      let userString = readLocalStorage(User.LOCAL_STORAGE_KEY)

      if (userString) {
        let json = JSON.parse(userString)
        this.render(json)

      }

    } catch (e) {
      removeLocalStorage(User.LOCAL_STORAGE_KEY)
    }
  }

  //将用户信息存储在本地。
  saveToLocalStorage(rawUserObject = null) {

    //有可能rawUserObject直接就是一个user对象，那么我们需要删掉一些无用的信息。
    delete rawUserObject['validatorSchema']
    delete rawUserObject['userProfile']
    delete rawUserObject['avatar']

    saveToLocalStorage(User.LOCAL_STORAGE_KEY, JSON.stringify(rawUserObject))
  }

  //清除本地的user信息
  clearLocalStorage() {

    removeLocalStorage(User.LOCAL_STORAGE_KEY)
  }

  //更新本地持久化了的个别字段。
  updateLocalStorage(opt = {}) {
    try {
      let userString = readLocalStorage(User.LOCAL_STORAGE_KEY)

      if (userString) {
        let json = JSON.parse(userString)
        $.extend(json, opt)

        saveToLocalStorage(User.LOCAL_STORAGE_KEY, JSON.stringify(json))
      }

    } catch (e) {
      removeLocalStorage(User.LOCAL_STORAGE_KEY)
    }
  }


  getForm() {
    let form = {
      avatarUrl: this.avatarUrl,
      username: this.username,
      password: this.password,
      email: this.email,
      gender: this.gender,
      sizeLimit: this.sizeLimit
    }

    if (this.phone) {
      form.phone = this.phone
    }
    if (this.city) {
      form.city = this.city
    }
    if (this.uuid) {
      form.uuid = this.uuid
    }

    return form

  }

  validate() {

    if (this.editMode) {
      this.password = '10101010'
    }

    return super.validate()
  }

  //local logout.
  innerLogout() {

    this.render(new User())

    removeLocalStorage(this.getTAG())

  }

  innerLogin(response) {
    let that = this
    this.errorMessage = null
    this.render(response.data.data)
    this.isLogin = true

    //登录成功后去本地保存一下用户的简单信息，方便下次自动填入个别字段。
    this.saveToLocalStorage(response.data.data)

  }

  loginValidate() {

    if (!this.email) {
      this.errorMessage = '账号必填'
      return false
    }

    if (!this.localPassword) {
      this.errorMessage = '密码必填'
      return false
    }

    return true
  }

  getLoginForm() {

    return {
      email: this.email,
      password: this.localPassword
    }
  }

  getResetForm() {
    return {
      phone: this.phone,
      password: this.password
    }
  }

  httpLogin(successCallback, errorCallback) {

    let that = this

    if (!this.loginValidate()) {
      return
    }

    let form = this.getLoginForm()

    this.httpPost(User.URL_LOGIN, form, function (response) {

      that.innerLogin(response)

      successCallback && successCallback(response)
    }, errorCallback)
  }

  httpLogout(successCallback, errorCallback) {

    let that = this

    that.innerLogout()

    this.httpPost(User.URL_LOGOUT, {}, function (response) {

      successCallback && successCallback(response)
    }, errorCallback)
  }

  httpUserChangePassword(oldPassword, newPassword, successCallback, errorCallback) {
    let that = this
    this.httpPost(User.URL_USER_CHANGE_PASSWORD, {
      'oldPassword': oldPassword,
      'newPassword': newPassword
    }, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpUserResetPassword(password, successCallback, errorCallback) {
    this.httpPost(User.URL_USER_RESET_PASSWORD, {'userUuid': this.uuid, 'password': password}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }

  httpChangeStatus(successCallback, errorCallback) {
    let that = this
    if (this.status === 'OK') {
      this.httpPost(User.URL_USER_DISABLE, {'uuid': this.uuid}, function (response) {
        typeof successCallback === 'function' && successCallback(response)
      }, errorCallback)
    } else {
      this.httpPost(User.URL_USER_ENABLE, {'uuid': this.uuid}, function (response) {
        typeof successCallback === 'function' && successCallback(response)
      }, errorCallback)
    }

  }

}
