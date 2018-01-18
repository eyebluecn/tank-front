import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import {readLocalStorage, removeLocalStorage, saveToLocalStorage} from "../../util/Utils";
import UserInputSelection from '../../../backyard/user/widget/UserInputSelection'

let Role = {
  USER_ROLE_GUEST: 'GUEST',
  USER_ROLE_USER: 'USER',
  USER_ROLE_ADMINISTRATOR: 'ADMINISTRATOR'
}

let RoleMap = {
  USER_ROLE_GUEST: {
    name: '游客身份',
    value: 'GUEST'
  },
  USER_ROLE_USER: {
    name: '普通注册用户',
    value: 'USER'
  },
  USER_ROLE_ADMINISTRATOR: {
    name: '管理员',
    value: 'ADMINISTRATOR'
  }
}

let Gender = {
  USER_GENDER_MALE: 'MALE',
  USER_GENDER_FEMALE: 'FEMALE',
  USER_GENDER_UNKNOWN: 'UNKNOWN'
}

let GenderMap = {
  USER_GENDER_MALE: {
    name: '男',
    value: 'MALE'
  },
  USER_GENDER_FEMALE: {
    name: '女',
    value: 'FEMALE'
  },
  USER_GENDER_UNKNOWN: {
    name: '未知',
    value: 'UNKNOWN'
  }
}

let Status = {
  USER_STATUS_OK: 'OK',
  USER_STATUS_DISABLED: 'DISABLED'
}

let StatusMap = {
  USER_STATUS_OK: {
    name: '激活',
    value: 'OK',
    style: 'primary'
  },
  USER_STATUS_DISABLED: {
    name: '未激活',
    value: 'DISABLED',
    style: 'danger'
  }
}

export default class User extends BaseEntity {
  constructor(args) {
    super(args)
    this.role = Role.USER_ROLE_GUEST
    this.username = null
    this.password = null
    this.email = null
    this.phone = null
    this.gender = Gender.USER_GENDER_MALE
    this.city = null
    this.avatarUrl = null
    this.lastIp = null
    this.lastTime = null
    //默认大小限制100Mb.
    this.sizeLimit = 104857600
    this.status = Status.USER_STATUS_OK

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

  static URL_LOGIN = '/user/login'
  static URL_LOGOUT = '/user/logout'
  static URL_USER_CHANGE_PASSWORD = '/user/change/password'
  static URL_USER_RESET_PASSWORD = '/user/reset/password'
  static URL_USER_DISABLE = '/user/disable'
  static URL_USER_ENABLE = '/user/enable'

  render(obj) {
    super.render(obj)
    this.renderEntity('lastTime', Date)
  }

  getFilters() {
    return [
      new Filter(Filter.prototype.Type.HTTP_INPUT_SELECTION, '用户', 'username', null, User, true, UserInputSelection),
      new Filter(Filter.prototype.Type.INPUT, '邮箱', 'email'),
      new Filter(Filter.prototype.Type.INPUT, '手机号', 'phone'),
      new Filter(Filter.prototype.Type.SELECTION, '状态', 'status', this.getStatusList()),
      new Filter(Filter.prototype.Type.SORT, '最新更新时间', 'orderLastTime'),
      new Filter(Filter.prototype.Type.SORT, '创建时间', 'orderCreateTime')
    ]
  }

  //获取用户头像的url.
  getAvatarUrl() {
    if (this.avatarUrl) {
      return this.avatarUrl + '?imageProcess=resize&imageResizeM=fill&imageResizeW=200&imageResizeH=200'
    } else {
      return require('../../../assets/img/avatar.png')
    }
  }

  //将用户信息存储在本地。
  renderFromLocalStorage() {

    try {
      let userString = readLocalStorage(this.getTAG())

      if (userString) {
        let json = JSON.parse(userString)
        this.render(json)
      }

    } catch (e) {
      removeLocalStorage(this.getTAG())
    }
  }

  //将用户信息存储在本地。
  saveToLocalStorage(rawUserObject = null) {

    if (rawUserObject) {
      rawUserObject.isLogin = true
    }

    saveToLocalStorage(this.getTAG(), JSON.stringify(rawUserObject))
  }

  //更新本地持久化了的个别字段。
  updateLocalStorage(opt = {}) {
    try {
      let userString = readLocalStorage(this.getTAG())

      if (userString) {
        let json = JSON.parse(userString)
        $.extend(json, opt)

        saveToLocalStorage(this.getTAG(), JSON.stringify(json))
      }

    } catch (e) {
      removeLocalStorage(this.getTAG())
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
/*User.registerStatusEnum(StatusMap)*/
User.registerEnum('Status', StatusMap)
User.registerEnum('Role', RoleMap)
User.registerEnum('Gender', GenderMap)
