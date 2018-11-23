import $ from 'jquery'
import Vue from 'vue'
import {Message} from 'element-ui'
import {lowerCamel, lowerSlash, startWith, toPlural} from '../../filter/str'
import {str2Date} from '../../filter/time'
import {functionName} from "../../util/Utils";
import {parseList} from "../../util/JsonUtils";
import {ResultCode} from "./ResultCode";

export default class Base {

  constructor(args) {

    //错误信息提示。
    this.errorMessage = null
    //是否处于编辑状态。区别于展示和编辑。
    this.editMode = false
    //是否处于创建状态。区别于创建和编辑。
    this.createMode = false

    this.loading = false

    //加载详情时的loading，这是一种特殊的loading状态，只有详情加载好了，我们才展示整个页面，在LoadingFrame中有用到
    this.detailLoading = false
  }

  render(obj) {
    if (obj) {
      $.extend(this, obj)
    }
  }

  //如果自己仅仅是作为一个列表中的属性渲染的话，那么我们只关心个别关键词段。
  //比如在SpaceApply中SpaceSeats，这个如果使用render的话，那么页面加载速度将非常慢。
  simpleRender(obj) {
    this.render(obj)
  }

  /**
   *
   * @param field 字段名
   * @param Clazz 类型名
   * @param simpleRender 是否使用极简的渲染方式。
   */
  renderList(field, Clazz, simpleRender = true) {

    //如果我们要转换成字符串的数组形式，那么this[field]应该是一个字符串才对。
    if (Clazz === String) {
      this[field] = parseList(this[field]);
      return
    }

    //下面就是转换实体数组了。
    let beans = this[field]
    if (!beans) {
      //服务器返回这个字段为空 维持构造函数中的默认值（一般而言是一个[]）
      this[field] = (new this.constructor())[field]
      return
    }

    if (!Clazz) {
      return
    }

    this[field] = []

    for (let i = 0; i < beans.length; i++) {
      let bean = beans[i]
      let clazz = new Clazz()

      if (simpleRender) {
        clazz.simpleRender(bean)
      } else {
        clazz.render(bean)
      }

      this[field].push(clazz)
    }
  }

  //直接render出一个Entity. field字段名，Clazz类名。
  renderEntity(field, Clazz) {

    let obj = this[field]
    if (!obj) {
      if (Clazz) {
        let EntityClazz = this.constructor
        obj = (new EntityClazz())[field]

      } else {
        return
      }
    }

    if (Clazz === Date) {

      this[field] = str2Date(obj)
    } else if (Clazz.prototype instanceof Base) {

      //可能此处的该项属性做了特殊处理的。
      //1024*1024 以及 "图片尺寸不超过1M"用let bean = new Clazz(); 就无法反映出来。因为父类render的时候已经将avatar给变成了Object.
      let bean = (new this.constructor())[field]
      if (!bean) {
        bean = new Clazz()
      }

      if (obj !== null) {
        bean.render(obj)
        this[field] = bean
      }

    } else {
      console.error('调用错误！')
    }

  }

  //we provide a default error handing method. handle with specific errorCallback.
  defaultErrorHandler(response, errorCallback) {

    let msg = this.getErrorMessage(response)

    if (typeof errorCallback === 'function') {
      errorCallback(msg, response)
    } else {
      Message.error({
        message: msg,
        center: true
      })
    }
  }

  //专门捕捉没有登录这种错误。return true -> 有错误（已经处理掉了）  false -> 没错误 （什么都没干）
  loginErrorHandler(response) {

    let temp = response['data']
    if (temp !== null && typeof temp === 'object') {
      if (temp['code'] === ResultCode.LOGIN) {

        //如果当前本身就是登录页面，自然没有必要提示
        if (Vue.store.state.route.path === Vue.store.state.loginPage) {
          return true
        }
        //这个问题不能报的太频繁，比如一个页面请求了两个接口，两个接口都报没有登录。
        if ((new Date().getTime()) - Vue.store.state.lastLoginErrorTimestamp < 3000) {
          return true
        } else {
          Vue.store.state.lastLoginErrorTimestamp = (new Date().getTime());
        }


        Message.error({
          message: '您已退出，请登录后再访问。'
        })

        //做一次退出。
        Vue.store.state.user.innerLogout()

        Vue.router.push({
          path: Vue.store.state.loginPage,
          query: {redirect: Vue.store.state.route.fullPath}
        })

        return true

      }
    }

    return false

  }

  //专门捕捉没有认证手机这种错误。return true -> 有错误（已经处理掉了）  false -> 没错误 （什么都没干）
  phoneValidateErrorHandler(response) {

    let temp = response['data']
    if (temp !== null && typeof temp === 'object') {
      if (temp['code'] === ResultCode.REQUIRE_PHONE) {

        Message.error({
          message: '请认证手机后再操作'
        })

        Vue.$popupPhoneValidation.show(Vue.store.state.user)

        return true

      }
    }

    return false

  }

  //get errorMessage from response and wrap the value to this.errorMessage.
  getErrorMessage(response) {

    let msg = '服务器出错，请稍后再试!'

    if (response === null) {
      msg = '出错啦，请稍后重试！'
    } else if (typeof response === 'string') {
      msg = response
    } else if (response['msg']) {
      msg = response['msg']
    } else if (response['message']) {
      msg = response['message']
    } else {
      let temp = response['data']
      if (temp !== null && typeof temp === 'object') {
        if (temp['message']) {
          msg = temp['message']
        } else if (temp['msg']) {
          msg = temp['msg']
        } else {
          if (temp['error'] && temp['error']['message']) {
            msg = temp['error']['message']
          }
        }
      }
    }
    this.errorMessage = msg
    return msg
  }

  //Vue.http.get('/someUrl', [options]).then(successCallback, errorCallback);
  //opts中可以传递一些特殊的选项。具体参考：https://github.com/pagekit/vue-resource/blob/develop/docs/http.md
  httpGet(url, params = {}, successCallback, errorCallback, opts = {}) {

    let that = this

    let options = $.extend({}, opts)
    options['params'] = params

    this.loading = true
    Vue.http.get(url, options).then(function (response) {

      that.loading = false;
      (typeof successCallback === 'function') && successCallback(response)

    }, function (response) {

      that.loading = false

      console.error(response)
      //错误信息一律存放在自己的errorMessage中，user httpLogout将显得不灵活了
      //that.errorMessage = that.getErrorMessage(response)

      //对于没有登录的错误直接跳转到登录页面
      if (that.loginErrorHandler(response)) {
        return
      }

      //对于没有认证手机的错误直接弹出手机认证框
      if (that.phoneValidateErrorHandler(response)) {
        return
      }

      //有传入错误处理方法，就按你的执行
      if (typeof errorCallback === 'function') {
        errorCallback(that.getErrorMessage(response), response)
      } else {
        //没有传入错误处理的方法就采用默认处理方法：toast弹出该错误信息。
        that.defaultErrorHandler(response)
      }

    })

  }

  //Vue.http.post('/someUrl', [body], [options]).then(successCallback, errorCallback);
  //url is something like this: /article/detail/1
  //opts中可以传递一些特殊的选项。具体参考：https://github.com/pagekit/vue-resource/blob/develop/docs/http.md
  httpPost(url, params, successCallback, errorCallback, opts = {}) {
    let that = this


    let options = $.extend({}, opts)

    //options["emulateJSON"] = !(params instanceof FormData);

    //Post请求临时使用json的方式。
    options['emulateJSON'] = true

    this.loading = true
    Vue.http.post(url, params, options).then(function (response) {
      that.loading = false

      typeof successCallback === 'function' && successCallback(response)

    }, function (response) {
      that.loading = false

      console.error(response)
      //错误信息一律存放在自己的errorMessage中，user httpLogout将显得不灵活了
      //that.errorMessage = that.getErrorMessage(response)

      //对于没有登录的错误直接跳转到登录页面
      if (that.loginErrorHandler(response)) {
        return
      }

      //对于没有认证手机的错误直接弹出手机认证框
      if (that.phoneValidateErrorHandler(response)) {
        return
      }

      //有传入错误处理方法，就按你的执行
      if (typeof errorCallback === 'function') {
        errorCallback(that.getErrorMessage(response), response)
      } else {
        //没有传入错误处理的方法就采用默认处理方法：toast弹出该错误信息。
        that.defaultErrorHandler(response)
      }

    })

  }

  //获取到当前类的单数标签。比如 Project便得到 project
  getTAG() {

    let className = this.constructor.name

    //IE无法直接通过this.constructor.name获取到相应名称
    if (!className) {
      className = functionName(this.constructor)
    }

    return lowerCamel(className)
  }

  //获取到当前类的复数标签。比如 Project便得到 projects
  getTAGS() {

    return toPlural(this.getTAG())
  }

  //获取到当前实体的url前缀。
  getUrlPrefix() {
    return "/api" + lowerSlash(this.getTAG())
  }

  //调用某个函数，如果函数有问题，那么打印出来。
  safeCallback(callback) {
    if (typeof callback === "function") {
      return callback
    } else {
      return function () {
      }
    }
  }


}
