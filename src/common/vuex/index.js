import Vue from 'vue'
import Vuex from 'vuex'
import User from "../model/user/User";
import Preference from '../model/preference/Preference'

Vue.use(Vuex)

let user = new User()
user.renderFromLocalStorage()

const state = {
  config: {
    mobile: false,
    showDrawer: true
  },
  debug: true,

  //当前版本信息。
  version: {
    identifier: 'cn.eyeblue.tank',
    platform: 'WEB',
    versionCode: '6',
    versionName: '2.0.0'
  },

  //当前用户，即使没有登录依然有游客的用户在。
  user,

  breadcrumbs: [],

  //网站是否已经安装好
  installed: true,

  //网站偏好设置
  preference: new Preference(),
  //上次报没有登录错误的时间戳，用于控制登录提示框的个数不能太频繁。
  lastLoginErrorTimestamp: 0

}

const getters = {
  getConfig(state) {
    return state.config
  }
}

const mutations = {}

const actions = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
