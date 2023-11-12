import BaseEntity from './BaseEntity';
import NumberUtil from '../../util/NumberUtil';
import SafeUtil from '../../util/SafeUtil';
import BrowserUtil from '../../util/BrowserUtil';
import StringUtil from '../../util/StringUtil';
import ObjectUtil from '../../util/ObjectUtil';
import Filter from './filter/Filter';
import SortFilter from './filter/SortFilter';
import HttpBase from './HttpBase';

/**
 * 一个分页帮助器，可以去后台请求数据，也可以渲染需要数据源。
 * 这个类具有非常神奇的能力，可以说是整个项目含金量最高的一个类！
 */
export default class Pager<T> extends HttpBase {
  static MAX_PAGE_SIZE = 500;

  /**
   * 当前分页大小 0基
   */
  page: number = 0;
  /**
   * 每一页的大小
   */
  pageSize: number = 10;
  /**
   * 总的条目数量
   */
  totalItems: number = 0;
  /**
   * 总的页数
   */
  totalPages: number = 0;

  /**
   * 返回的数据，类型为泛型
   */
  data: T[] = [];

  /**
   * 类。这个很特殊。
   */
  Clazz: any = null;

  /**
   * 分页的url链接地址
   */
  urlPage: string | null = null;

  /**
   * 过滤筛选器
   */
  filters: Filter[] = [];

  /**
   * 是否要求在浏览器中保存参数
   */
  history: boolean = false;

  constructor(
    reactComponent: React.Component | null,
    Clazz: any,
    pageSize = 20
  ) {
    super(reactComponent);

    this.pageSize = pageSize;

    //这里的处理利用了js的原型调用链，比较魔法。
    if (Clazz && Clazz.prototype instanceof BaseEntity) {
      this.Clazz = Clazz;

      let urlPage = Clazz.prototype.getUrlList();
      if (urlPage) {
        this.urlPage = urlPage;
      } else {
        console.error(Clazz + '必须定义分页url');
      }

      if (Clazz.prototype.getFilters) {
        //直接获取该类的过滤器。
        this.filters = Clazz.prototype.getFilters();
      } else {
        console.error(
          "The Clazz MUST define a prototype method named 'getFilters'"
        );
      }
    } else {
      console.error('You MUST specify a Clazz extended BaseEntity');
    }
  }

  //把obj中的属性，赋值到this中来。采用深拷贝。
  assign(obj: any) {
    super.assign(obj);

    this.assignList('data', this.Clazz);
  }

  //该方法是在地址栏添加上query参数，参数就是filters中的key和value.
  //同时地址栏上有的参数也会自动读取到filters中去
  //因此，启用该方法后返回时可以停留在之前的页码中。
  enableHistory() {
    this.history = true;

    let queryPageNum: string | null = BrowserUtil.getQueryByName('page');
    let queryPageSize: string | null = BrowserUtil.getQueryByName('pageSize');

    if (queryPageNum !== null && queryPageNum !== '') {
      this.page = parseInt(queryPageNum);
    }

    if (queryPageSize !== null && queryPageSize !== '') {
      this.pageSize = parseInt(queryPageSize);
    }

    if (!NumberUtil.isInteger(this.page)) {
      this.page = 0;
    }
    if (!NumberUtil.isInteger(this.pageSize)) {
      this.pageSize = 10;
    }

    //从请求参数中传值。
    for (let i = 0; i < this.filters.length; i++) {
      let filter: Filter = this.filters[i];

      let queryValue = BrowserUtil.getQueryByName(filter.key);

      if (queryValue !== null && queryValue !== '') {
        filter.putValue(queryValue);
      } else {
        filter.reset();
      }
    }
  }

  //重置所有过滤器
  resetFilter() {
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      filter.reset();
    }
  }

  //重置排序过滤器
  resetSortFilters() {
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      if (filter instanceof SortFilter) {
        filter.reset();
      }
    }
  }

  //手动设置过滤器的值
  setFilterValue(key: string, value: any) {
    if (!this.filters || !this.filters.length) {
      return;
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];

      if (filter.key === key) {
        filter.putValue(value);
      }
    }
  }

  setFilterValues(obj: any) {
    const keys = Object.keys(obj);
    if (keys.length) {
      keys.forEach((key) => this.setFilterValue(key, obj[key]));
    }
  }

  //隐藏某个Filter，实际上我们可以根据这个filter来筛选，只不过不出现在NbFilter中而已。
  showFilter(key: string, visible = true) {
    if (!this.filters || !this.filters.length) {
      return;
    }
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      if (filter.key === key) {
        filter.visible = visible;
        break;
      }
    }
  }

  showAllFilter(visible = true) {
    if (!this.filters || !this.filters.length) {
      return;
    }
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      filter.visible = visible;
    }
  }

  //根据一个key来获取某个filter
  getFilter(key: string): Filter | null {
    if (!this.filters || !this.filters.length) {
      return null;
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      if (filter.key === key) {
        return filter;
      }
    }

    return null;
  }

  //根据一个key来获取某个filter
  getFilterValue(key: string) {
    let filter = this.getFilter(key);
    if (!filter) {
      return null;
    } else {
      return filter.getValueString();
    }
  }

  /**
   * 获取当前进行sort的那个filter
   * 我们认为一次只有一个排序值
   */
  getCurrentSortFilter(): Filter | null {
    if (!this.filters || !this.filters.length) {
      return null;
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];
      if (filter instanceof SortFilter) {
        if (!filter.isEmpty()) {
          return filter;
        }
      }
    }
    return null;
  }

  //获取所有的filter参数，键值对形式
  getParams(): { [s: string]: string | number } {
    let params: { [s: string]: string | number } = {
      page: this.page,
      pageSize: this.pageSize,
    };

    if (!this.filters || !this.filters.length) {
      return params;
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i];

      if (!filter.isEmpty()) {
        params[filter.key] = filter.getValueString();
      }
    }

    return params;
  }

  //元素是否为空
  isEmpty(): boolean {
    return !this.data || !this.data.length;
  }

  //去服务器端进行请求
  httpList(successCallback?: any, errorCallback?: any, finalCallback?: any) {
    let that = this;

    let params: { [s: string]: string | number } = this.getParams();

    if (this.history) {
      window.history.replaceState(
        {},
        '',
        window.location.pathname + '?' + ObjectUtil.param(params)
      );
    }

    //准备去请求，所有错误置为空
    this.errorMessage = null;

    this.httpGet(
      this.urlPage,
      params,
      function (response: any) {
        // handle success

        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      function (errorMessage: any, response: any) {
        //失败了就清空
        that.data = [];

        SafeUtil.safeCallback(errorCallback)(errorMessage, response);
      },
      finalCallback
    );
  }

  //从pager中获取当前的分页情况，在table的分页器中显示 PaginationConfig
  getPagination(): any | false {
    let that = this;

    if (this.totalPages > 1) {
      return {
        current: that.page + 1,
        pageSize: that.pageSize,
        total: that.totalItems,
        showTotal: (totalNum: number) => '共' + totalNum + '条',
        showSizeChanger: true,
      };
    } else {
      return false;
    }
  }

  //获取默认的排序顺序,提供给table使用
  getDefaultSortOrder(columnKey: string): any | boolean {
    //将变化的这个情况更新。
    let filterKey = 'order' + StringUtil.capitalize(columnKey);

    //直接放进排序值即可，底层会自动兼容
    let sortFilter = this.getFilter(filterKey);

    if (sortFilter && sortFilter instanceof SortFilter) {
      let antdSortValue: any | null = sortFilter.getAntdValue();
      if (antdSortValue) {
        return antdSortValue;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //在table的分页器 发生变化调用 TODO: PaginationConfig SorterResult TableCurrentDataSource
  tableOnChange(pagination: any, filters: any, sorter: any, extra: any) {
    let that = this;

    if (pagination.current !== undefined) {
      that.page = pagination.current - 1;
    }

    if (pagination.pageSize !== undefined) {
      that.pageSize = pagination.pageSize;
    }

    //重置所有的sort
    that.resetSortFilters();
    if (!StringUtil.isEmptyObject(sorter)) {
      //将变化的这个情况更新。
      let filterKey =
        'order' +
        StringUtil.capitalize(StringUtil.underScoreToCamel(sorter.field));

      //直接放进排序值即可，底层会自动兼容
      that.setFilterValue(filterKey, sorter.order);
    }

    //直接去刷新
    that.httpList();
  }

  //清空data中的数据。
  clear() {
    this.data = [];
    this.page = 0;
    this.totalItems = 0;
    this.totalPages = 0;
  }
}
