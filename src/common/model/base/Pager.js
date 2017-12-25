import Base from './Base'
import Vue from 'vue'
import $ from 'jquery'
import { isInteger } from '../../util/Utils'

export default class Pager extends Base {

  constructor (Clazz, pageSize = 10, page = 0) {
    super()

    this.page = page
    this.pageSize = pageSize
    this.totalItems = 0
    this.totalPages = 0
    this.data = []

    //this field means whether add filter query to the URL.
    this.history = null

    //供nb-pager使用的
    this.offset = 3

    //list attributes.
    if (Clazz && (Clazz.prototype instanceof Base)) {
      this.Clazz = Clazz

      let tags = Clazz.prototype.getTAGS()
      if (tags) {
        this[Clazz.prototype.getTAGS()] = null
        this.TAGS = tags
      } else {
        console.error('The Clazz MUST define a prototype named \'TAGS\'')
      }
      //考虑兼容模式，允许自定义URL_PAGE.
      let urlPage = Clazz.prototype.URL_PAGE
      if (!urlPage) {
        urlPage = Clazz.prototype.getUrlPage()
      }
      if (urlPage) {
        this.URL_PAGE = urlPage
      } else {
        console.error('The Clazz MUST define a prototype named \'URL_PAGE\'')
      }

      if (Clazz.prototype.getFilters) {

        //这个地方的Filter不能用同一个，会出问题的。
        this.FILTERS = Clazz.prototype.getFilters()

      } else {
        console.error('The Clazz MUST define a prototype method named \'getFilters\'')
      }

    } else {
      console.error('You MUST specify a Clazz extended Base')
    }

  }

  //重置Filter。
  resetFilter () {
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      filter.reset()
    }
  };

  //手动设置过滤器的值
  setFilterValue (key, value) {
    if (!this.FILTERS || !this.FILTERS.length) {
      return
    }
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      if (filter.key === key) {
        filter.putValue(value)
      }
    }
  };

  //根据key来删除某个Filter
  removeFilter (key) {
    if (!this.FILTERS || !this.FILTERS.length) {
      return
    }
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      if (filter.key === key) {
        this.FILTERS.splice(i, 1)
        break
      }
    }
  };

  //隐藏某个Filter，实际上我们可以根据这个filter来筛选，只不过不出现在NbFilter中而已。
  showFilter (key, visible = true) {
    if (!this.FILTERS || !this.FILTERS.length) {
      return
    }
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      if (filter.key === key) {
        filter.visible = visible
        break
      }
    }
  };

  showAllFilter (visible = true) {
    if (!this.FILTERS || !this.FILTERS.length) {
      return
    }
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      filter.visible = visible
    }
  }

  //根据一个key来获取某个filter
  getFilter (key) {
    if (!this.FILTERS || !this.FILTERS.length) {
      return null
    }
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]
      if (filter.key === key) {
        return filter
      }
    }
  };

  //获取当前pager中的list
  getList () {
    return this.data
  }

  isEmpty () {
    if (!this.data) {
      return true
    }
    return this.data.length === 0

  }

  //该方法是在地址栏添加上query参数，参数就是FILTERS中的key和value.
  //同时地址栏上有的参数也会自动读取到FILTERS中去
  //因此，启用该方法后返回时可以停留在之前的页码中。
  enableHistory () {
    this.history = true

    let query = Vue.store.state.route.query

    if (typeof query.page !== 'undefined') {
      this.page = parseInt(query.page)
    }
    if (typeof query.pageSize !== 'undefined') {
      this.pageSize = parseInt(query.pageSize)
    }

    if (!isInteger(this.page)) {
      this.page = 0
    }
    if (!isInteger(this.pageSize)) {
      this.pageSize = 10
    }

    //try to fill the filters by query.
    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]

      if (typeof query[filter.key] !== 'undefined') {

        let value = query[filter.key]
        //check类型的要转成boolean.
        if (filter.type === filter.Type.CHECK) {
          if (value === 'true') {
            value = true
          } else if (value === 'false') {
            value = false
          } else {
            value = null
          }
        }
        filter.putValue(value)

      }

    }
  }

  //you can specify the page url here.
  httpCustomPage (url, params, successCallback, errorCallback) {
    let that = this
    this.loading = true
    this.errorMessage = null

    if (this.history) {
      history.replaceState({}, '', Vue.store.state.route.path + '?' + $.param(params))
    }

    this.httpGet(url, params, function (response) {
      that.loading = false

      that.render(response.data.data)

      successCallback && successCallback(response)

    }, errorCallback)

  };

  //use default FILTERS as parameters..
  httpFastPage (successCallback, errorCallback) {

    if (!isInteger(this.page)) {
      this.page = 0
    }

    if (!isInteger(this.pageSize)) {
      this.pageSize = 10
    }

    let params = {
      page: this.page,
      pageSize: this.pageSize
    }

    for (let i = 0; i < this.FILTERS.length; i++) {
      let filter = this.FILTERS[i]

      if (filter.getParam() !== null && filter.getParam() !== '') {
        params[filter.key] = filter.getParam()
      }
    }

    this.httpCustomPage(this.URL_PAGE, params, successCallback, errorCallback)

  };

  //use default url_page.
  httpPage (params, successCallback, errorCallback) {

    this.httpCustomPage(this.URL_PAGE, params, successCallback, errorCallback)

  };

  render (obj) {

    super.render(obj)
    this.renderList('data', this.Clazz)

  }

}




