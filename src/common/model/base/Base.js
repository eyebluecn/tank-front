import $ from 'jquery'
import Vue from 'vue'
import {Notification} from 'element-ui'
import {lowerCamel, lowerSlash, startWith, toPlural} from '../../filter/str'
import {str2Date} from '../../filter/time'
import {functionName} from "../../util/Utils";

export default class Base {

  constructor(args) {
    //local fields. Used in UI.
    this.errorMessage = null
    this.editMode = false
    this.loading = false

    //加载详情时的loading，这是一种特殊的loading状态，只有详情加载好了，我们才展示整个页面，在LoadingFrame中有用到
    this.detailLoading = false
  }

  getStatusList() {

    if (!this.StatusMap) {
      console.error(this.getTAG() + '错误！未指定StatusMap!')
      return []
    }

    let list = []
    for (let key in this.StatusMap) {

      if (this.StatusMap.hasOwnProperty(key)) {
        list.push(this.StatusMap[key])
      }

    }

    if (list.length === 0) {
      console.error(this.getTAG() + 'StatusList为空，请检查')
    }

    return list

  }

  getStatusMap() {
    if (!this.StatusMap) {
      console.error(this.getTAG() + '错误！未指定StatusMap!')
      return {}
    } else {
      return this.StatusMap
    }

  }

  getStatusItem(status) {
    if (!this.StatusMap) {
      console.error(this.getTAG() + '错误！未指定StatusMap!')
      return {
        name: '未知状态',
        value: null,
        style: 'danger',
        icon: 'ban'
      }
    } else {
      let item = this.StatusMap[status]
      if (item) {
        return item
      } else {
        return {
          name: '未知状态',
          value: null,
          style: 'danger',
          icon: 'ban'
        }
      }
    }
  }

  getStatusName() {
    if (this.status && this.StatusMap) {
      let item = this.StatusMap[this.status]
      if (item) {
        return item.name
      }

      console.error('没有定义 ' + this.status)
    } else {
      console.error('没有定义 status')

    }

    return '未知状态'
  };

  getStatusStyle() {

    if (this.status && this.StatusMap) {
      let item = this.StatusMap[this.status]
      if (item) {
        return item.style
      }
      console.error(this.getTAG() + '没有定义 ' + this.status)
    } else {
      console.error(this.getTAG() + '没有定义 status')
    }

    return 'default'
  };

  getStatusIcon() {

    if (this.status && this.StatusMap) {
      let item = this.StatusMap[this.status]
      if (item) {
        return item.icon
      }
      console.error(this.getTAG() + '没有定义 ' + this.status)
    } else {
      console.error(this.getTAG() + '没有定义 status')
    }

    return 'ban'
  };

  getTypeList() {

    if (!this.TypeMap) {
      console.error(this.getTAG() + '错误！未指定TypeMap!')
      return []
    }

    let list = []
    for (let key in this.TypeMap) {

      if (this.TypeMap.hasOwnProperty(key)) {
        list.push(this.TypeMap[key])
      }

    }

    if (list.length === 0) {
      console.error(this.getTAG() + ' TypeList为空，请检查')
    }

    return list

  }

  getTypeMap() {
    if (!this.TypeMap) {
      console.error(this.getTAG() + '错误！未指定TypeMap!')
      return {}
    } else {
      return this.TypeMap
    }

  }

  getTypeItem(type) {
    if (!this.TypeMap) {
      console.error(this.getTAG() + '错误！未指定TypeMap!')
      return {
        name: '未知状态',
        value: null,
        style: 'danger',
        icon: 'ban'
      }
    } else {
      let item = this.TypeMap[type]
      if (item) {
        return item
      } else {
        return {
          name: '未知状态',
          value: null,
          style: 'danger',
          icon: 'ban'
        }
      }
    }
  }

  getTypeName() {
    if (this.type && this.TypeMap) {
      let item = this.TypeMap[this.type]
      if (item) {
        return item.name
      }

      console.error('没有定义 ' + this.type)
    } else {
      console.error('没有定义 type')
    }

    return '未知类型'
  };

  getTypeStyle() {
    if (this.type && this.TypeMap) {
      let item = this.TypeMap[this.type]
      if (item) {
        return item.style
      }

      console.error('没有定义 ' + this.type)
    } else {

      console.error('没有定义 type')
    }

    return 'default'
  };

  getTypeIcon() {
    if (this.type && this.TypeMap) {
      let item = this.TypeMap[this.type]
      if (item) {
        return item.icon
      }

      console.error('没有定义 ' + this.type)
    } else {

      console.error('没有定义 type')
    }

    return 'default'
  };

  //注册Status的枚举变量。只能Clazz来调用这个方法，谁调用this就是谁。
  static registerStatusEnum(StatusMap) {

    let Clazz = this
    let Status = {}
    let StatusList = []
    for (let key in StatusMap) {
      if (StatusMap.hasOwnProperty(key)) {
        Status[key] = key
        StatusList.push(StatusMap[key])
      }
    }
    Clazz.prototype.Status = Status
    Clazz.prototype.StatusList = StatusList
    Clazz.prototype.StatusMap = StatusMap
  }

  //注册Type的枚举变量。只能Clazz来调用这个方法，谁调用this就是谁。
  static registerTypeEnum(TypeMap) {
    let Clazz = this
    let Type = {}
    let TypeList = []
    for (let key in TypeMap) {
      if (TypeMap.hasOwnProperty(key)) {
        Type[key] = key
        TypeList.push(TypeMap[key])
      }
    }
    Clazz.prototype.Type = Type
    Clazz.prototype.TypeList = TypeList
    Clazz.prototype.TypeMap = TypeMap
  }

  //往某个实体的prototype中注册某个枚举类型。以Category为例，会注册以下属性和方法
  //Category CategoryMap CategoryList getCategoryList() getCategoryMap()
  // getCategoryItem() getCategoryStyle() getCategoryName() getCategoryIcon()
  static registerEnum(EnumName, EnumMap) {
    let Clazz = this
    if (!EnumName || !EnumMap) {
      console.error('注册枚举变量时参数错误！')
      return
    }

    //首字母小写的键。
    let enumName = EnumName.replace(/(\w)/, function (v) {
      return v.toLowerCase()
    })
    let Enum = {}
    let EnumList = []
    for (let key in EnumMap) {
      let item = EnumMap[key]
      Enum[key] = item.value
      EnumList.push(EnumMap[key])
    }

    Clazz.prototype[EnumName] = Enum

    Clazz.prototype[EnumName + 'Map'] = EnumMap
    Clazz.prototype['get' + EnumName + 'Map'] = function () {
      return EnumMap
    }
    Clazz.prototype[EnumName + 'List'] = EnumList
    Clazz.prototype['get' + EnumName + 'List'] = function () {
      return EnumList
    }
    Clazz.prototype['get' + EnumName + 'Item'] = function () {
      let itemValue = this[enumName]
      if (itemValue !== null && typeof itemValue !== "undefined") {

        let item = null

        for (let k in EnumMap) {

          if (EnumMap.hasOwnProperty(k)) {
            let temp = EnumMap[k];
            if (temp.value === itemValue) {
              item = temp
              break
            }
          }

        }

        if (item) {
          return item
        }
        console.error('没有定义 ' + itemValue)
      } else {

        console.error('没有定义 enum')
      }
      return {
        name: '未知枚举类型',
        value: null,
        style: 'danger',
        icon: 'ban'
      }
    }
    Clazz.prototype['get' + EnumName + 'Style'] = function () {


      let itemValue = this[enumName]
      if (itemValue !== null && typeof itemValue !== "undefined") {


        let item = null

        for (let k in EnumMap) {

          if (EnumMap.hasOwnProperty(k)) {
            let temp = EnumMap[k];
            if (temp.value === itemValue) {
              item = temp
              break
            }
          }

        }

        if (item) {
          return item.style
        }

        console.error('没有定义 ' + itemValue)
      } else {

        console.error('没有定义 enum')
      }

      return 'default'
    }
    Clazz.prototype['get' + EnumName + 'Name'] = function () {

      let itemValue = this[enumName]


      if (itemValue !== null && typeof itemValue !== "undefined") {
        let item = null

        for (let k in EnumMap) {

          if (EnumMap.hasOwnProperty(k)) {
            let temp = EnumMap[k];
            if (temp.value === itemValue) {
              item = temp
              break
            }
          }

        }


        if (item) {
          return item.name
        }

        console.error('没有定义 ' + itemValue)
      } else {

        console.error('没有定义 enum')
      }

      return '未知枚举类型'
    }
    Clazz.prototype['get' + EnumName + 'Icon'] = function () {
      let itemValue = this[enumName]
      if (itemValue !== null && typeof itemValue !== "undefined") {

        let item = null

        for (let k in EnumMap) {

          if (EnumMap.hasOwnProperty(k)) {
            let temp = EnumMap[k];
            if (temp.value === itemValue) {
              item = temp
              break
            }
          }

        }

        if (item) {
          return item.icon
        }

        console.error('没有定义 ' + itemValue)
      } else {

        console.error('没有定义 enum')
      }

      return 'ban'
    }

    return 'default'
  };


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

    let beans = this[field]
    if (!beans) {
      //维持默认值
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
      errorCallback(response)
    } else {
      Notification.error({
        title: '错误',
        message: msg
      })
    }
  }

  //专门捕捉没有登录这种错误。return true -> 有错误（已经处理掉了）  false -> 没错误 （什么都没干）
  loginErrorHandler(response) {

    let temp = response['data']
    if (temp !== null && typeof temp === 'object') {
      if (temp['code'] === -400) {

        //如果当前本身就是登录页面，自然没有必要提示
        if (Vue.store.state.route.path === "/user/login") {
          return true
        }
        //这个问题不能报的太频繁，比如一个页面请求了两个接口，两个接口都报没有登录。
        if ((new Date().getTime()) - Vue.store.state.lastLoginErrorTimestamp < 3000) {
          return true
        } else {
          Vue.store.state.lastLoginErrorTimestamp = (new Date().getTime());
        }

        Notification.error({
          message: '您已退出，请登录后再访问。'
        })

        //做一次退出。
        Vue.store.state.user.innerLogout()

        Vue.router.push({
          path: '/user/login',
          query: {redirect: Vue.store.state.route.fullPath}
        })

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
    let fullUrl = url
    if (!startWith(url, 'http')) {
      fullUrl = Vue.http.options.root + url
    }

    let options = $.extend({}, opts)
    options['params'] = params

    this.loading = true
    Vue.http.get(fullUrl, options).then(function (response) {

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

      //有传入错误处理方法，就按你的执行
      if (typeof errorCallback === 'function') {
        errorCallback(response)
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

    let fullUrl = url
    if (!startWith(url, 'http')) {
      fullUrl = Vue.http.options.root + url
    }

    let options = $.extend({}, opts)

    //options["emulateJSON"] = !(params instanceof FormData);

    //Post请求临时使用json的方式。
    options['emulateJSON'] = true

    this.loading = true
    Vue.http.post(fullUrl, params, options).then(function (response) {
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

      //有传入错误处理方法，就按你的执行
      if (typeof errorCallback === 'function') {
        errorCallback(response)
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
    return lowerSlash(this.getTAG())
  }

}
