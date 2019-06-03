import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {currentHost, readLocalStorage, removeLocalStorage, saveToLocalStorage} from "../../util/Utils";

import {UserRole} from "./UserRole";
import {UserStatus, UserStatusList} from "./UserStatus";
import {FilterType} from "../base/FilterType";
import {handleImageUrl} from "../../util/ImageUtil";
import {MessageBox, Message} from 'element-ui'
import Vue from "vue"

let defaultAvatarPath = require("../../../assets/img/avatar.png")

export default class User extends BaseEntity {

  static LOCAL_STORAGE_KEY = "user";

  static URL_LOGIN = '/api/user/login'
  static URL_AUTHENTICATION_LOGIN = '/api/user/authentication/login'
  static URL_REGISTER = '/api/user/register'
  static URL_LOGOUT = '/api/user/logout'
  static URL_USER_CHANGE_PASSWORD = '/api/user/change/password'
  static URL_USER_RESET_PASSWORD = '/api/user/reset/password'
  static URL_USER_TOGGLE_STATUS = '/api/user/toggle/status'
  static URL_USER_TRANSFIGURATION = '/api/user/transfiguration'

  constructor(args) {
    super(args)
    this.role = UserRole.GUEST
    this.username = null
    this.password = null
    this.avatarUrl = null
    this.lastIp = null
    this.lastTime = null
    //默认大小限制100Mb.
    this.sizeLimit = 104857600
    this.totalSize = 0
    this.totalSizeLimit = -1
    this.status = UserStatus.OK

    //local fields
    this.isLogin = false

    this.validatorSchema = {
      username: {
        rules: [
          {required: true, message: 'username required'},
          {
            type: 'string',
            pattern: /^[0-9a-zA-Z_]+$/,
            message: "only lowercase letter and number and _ is permitted."
          }],
        error: null
      }
    }
  }

  getAvatarUrl() {
    if (this.avatarUrl) {
      return handleImageUrl(this.avatarUrl)
    } else {
      return defaultAvatarPath
    }
  }

  getUrlPrefix() {
    return "/api/user"
  }

  render(obj) {
    super.render(obj)
    this.renderEntity('lastTime', Date)
  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.INPUT, '用户', 'username', null, User, false),
      new Filter(FilterType.INPUT, '手机号', 'phone', null, null, false),
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
      username: this.username,
      password: this.password,
      role: this.role,
      avatarUrl: this.avatarUrl,
      sizeLimit: this.sizeLimit,
      totalSizeLimit: this.totalSizeLimit,
      uuid: this.uuid ? this.uuid : null
    }

    return form
  }

  validate() {

    return super.validate()
  }

  //local logout.
  innerLogout() {

    this.render(new User())

    removeLocalStorage(this.getTAG())

  }


  transfiguration() {
    let that = this
    this.httpTransfiguration(function (authentication) {
      let textToCopy = currentHost() + "/user/authentication/" + authentication
      MessageBox.confirm(Vue.i18n.t("model.transfigurationPrompt", [textToCopy]), Vue.i18n.t("model.transfigurationPromptText"), {
        confirmButtonText: Vue.i18n.t("copy"),
        cancelButtonText: Vue.i18n.t("cancel"),
        type: 'info'
      }).then(function () {

          Vue.$copyPlguin.copy(textToCopy, function () {
            Message.success({
              message: Vue.i18n.t("operationSuccess"),
              center: true
            })
          })
        },
        function () {
        }
      )
    });
  }

  innerLogin(response) {
    let that = this
    this.errorMessage = null
    this.render(response.data.data)
    this.isLogin = true

    //登录成功后去本地保存一下用户的简单信息，方便下次自动填入个别字段。
    this.saveToLocalStorage(response.data.data)

  }

  httpLogin(username, password, successCallback, errorCallback) {

    let that = this

    if (!username) {
      this.errorMessage = 'username required'
      return false
    }

    if (!password) {
      this.errorMessage = 'password required'
      return false
    }

    let form = {username, password}

    this.httpPost(User.URL_LOGIN, form, function (response) {

      that.innerLogin(response)

      that.safeCallback(successCallback)(response)

    }, errorCallback)
  }

  httpRegister(username, password, rePassword, successCallback, errorCallback) {

    let that = this

    if (!username) {
      this.errorMessage = 'username required'
      return
    }

    if (!password) {
      this.errorMessage = 'password required'
      return
    }

    if (rePassword !== password) {
      this.errorMessage = 'new and old password not same'
      return
    }

    let form = {username, password}

    this.httpPost(User.URL_REGISTER, form, function (response) {
      that.innerLogin(response)
      that.safeCallback(successCallback)(response)
    }, errorCallback)
  }

  httpLogout(successCallback, errorCallback) {

    let that = this

    that.innerLogout()

    this.httpPost(User.URL_LOGOUT, {}, function (response) {

      that.safeCallback(successCallback)(response)
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


  httpToggleStatus(successCallback, errorCallback) {
    let that = this
    this.httpPost(User.URL_USER_TOGGLE_STATUS, {'uuid': this.uuid}, function (response) {
      typeof successCallback === 'function' && successCallback(response)
    }, errorCallback)
  }


  httpAuthenticationLogin(authentication, successCallback, errorCallback) {
    let that = this
    let form = {authentication}
    this.httpPost(User.URL_AUTHENTICATION_LOGIN, form, function (response) {
      that.innerLogin(response)
      that.safeCallback(successCallback)(response)
    }, errorCallback)
  }


  httpTransfiguration(successCallback, errorCallback) {
    let that = this
    let form = {'uuid': this.uuid}
    this.httpPost(User.URL_USER_TRANSFIGURATION, form, function (response) {
      that.safeCallback(successCallback)(response.data.msg)
    }, errorCallback)
  }

}
