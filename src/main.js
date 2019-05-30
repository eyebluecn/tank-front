//For IE Exception.
import "babel-polyfill";

//custom directive.
import "./common/directive/directive"

//自定义文本框插件
import CopyPlugin from "./common/plugin/copy/CopyPlugin";
import PhotoSwipePlugin from "./common/plugin/photoswipe/PhotoSwipePlugin";
import Previewer from "./common/plugin/previewer/Previewer";

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import store from './common/vuex'

import router from './common/router'
import {sync} from 'vuex-router-sync'
import VueResource from 'vue-resource'
import NProgress from 'vue-nprogress'
import filters from './common/filter'
import i18nMessage from "./common/i18n"

//将整个eleme 都引进来了。
import ElementUI from 'element-ui'
import BrowserUtil from "./common/util/BrowserUtil";


Vue.use(ElementUI)

//expose to global.
Vue.store = store;
//expose to global.
Vue.router = router;
sync(store, router)
Vue.use(VueResource)
Vue.use(NProgress)


//使用自定义插件
Vue.use(new CopyPlugin())
Vue.use(new PhotoSwipePlugin())
Vue.use(new Previewer())

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(VueI18n)

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale: Vue.store.state.lang, // 设置地区
  messages: i18nMessage // 设置地区信息
})
Vue.i18n = i18n


const nprogress = new NProgress({parent: '.nprogress-container'})

new Vue({
  nprogress,
  i18n,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
