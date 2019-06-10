import Vue from 'vue'
import Vuex from 'vuex'
import User from "../model/user/User";
import Preference from '../model/preference/Preference'
import BrowserUtil from "../util/BrowserUtil";
import Cookies from "js-cookie"

Vue.use(Vuex)

let user = new User()
user.renderFromLocalStorage()

let lang = BrowserUtil.browserLang()
let localLang = Cookies.get("_lang");
if (localLang === "zh" || localLang === "en") {
  lang = localLang
}

const state = {
  config: {
    mobile: false,
    showDrawer: true
  },
  //当前版本信息。
  versionName: '3.0.4',
  //当前用户，即使没有登录依然有游客的用户在。
  user,
  breadcrumbs: [],
  //全局正在上传的文件
  uploadMatters: [],
  //当前接受上传的那个Matter List.vue实例
  uploadListInstance: null,

  //网站是否已经安装好
  installed: true,

  //当前的语言
  lang: lang,

  //网站设置
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
