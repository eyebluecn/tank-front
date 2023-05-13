import StringUtil from '../../util/StringUtil';
import SafeUtil from '../../util/SafeUtil';
import SortFilter from './filter/SortFilter';
import Filter from './filter/Filter';
import HttpBase from './HttpBase';

/**
 * 实体基类
 * 继承这个类的表示在数据库中有对应的表。
 */
export default class BaseEntity extends HttpBase {
  /**
   * 唯一标识
   */
  uuid: string | null = null;

  /**
   * 排序值
   */
  sort: number = 0;

  /**
   * 创建时间
   */
  createTime: Date | null = null;

  /**
   * 修改时间
   */
  updateTime: Date | null = null;

  //************ 前端辅助字段 ****************/
  //加载详情的指示
  detailLoading: boolean = false;

  //我们认为每个实体都会存放于某个react组件中，当然可以不传入。
  constructor(reactComponent?: React.Component | null) {
    super(reactComponent);
  }

  //把obj中的属性，赋值到this中来。采用深拷贝。
  assign(obj: any) {
    super.assign(obj);

    this.assignEntity('createTime', Date);
    this.assignEntity('updateTime', Date);
  }

  //获取过滤器，必须每次动态生成，否则会造成filter逻辑混乱。
  getFilters(): Filter[] {
    return [
      new SortFilter('修改时间排序', 'orderCreateTime'),
      new SortFilter('创建时间排序', 'orderUpdateTime'),
    ];
  }

  //提交之前对自己进行验证。返回错误信息，null表示没有错误。
  validate(): any {
    return null;
  }

  //提交的表单
  getForm(): any {
    console.error('getForm: you should override this base method.');
  }

  //获取到当前类的单数标签。比如 Project便得到 project
  getTAG(): string {
    let className = this.constructor.name;

    //IE无法直接通过this.constructor.name获取到相应名称
    if (!className) {
      className = StringUtil.functionName(this.constructor);
    }

    return StringUtil.lowerCamel(className);
  }

  //获取到当前实体的url前缀。比如Notification获取到 /api/fs/notification
  getUrlPrefix(): string {
    return '/api' + StringUtil.lowerSlash(this.getTAG());
  }

  getUrlCreate(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/create';
  }

  getUrlDel(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/delete';
  }

  getUrlEdit(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/edit';
  }

  getUrlDetail(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/detail';
  }

  getUrlList(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/page';
  }

  getUrlSort(): string {
    let prefix = this.getUrlPrefix();

    return prefix + '/sort';
  }

  //新增或者修改
  httpSave(successCallback?: any, errorCallback?: any, finallyCallback?: any) {
    let that = this;

    let url = this.getUrlCreate();
    if (this.uuid) {
      url = this.getUrlEdit();
    }

    this.errorMessage = this.validate();
    if (this.errorMessage) {
      that.defaultErrorHandler(this.errorMessage, errorCallback);
      return;
    }

    this.httpPost(
      url,
      this.getForm(),
      function (response: any) {
        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finallyCallback
    );
  }

  //common http detail methods.
  httpDetail(
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    let that = this;
    if (!this.uuid) {
      this.errorMessage = 'uuid未指定，无法获取到详情！';

      this.defaultErrorHandler(this.errorMessage, errorCallback);

      return;
    }

    let url = this.getUrlDetail() + '?uuid=' + this.uuid;

    this.detailLoading = true;

    this.httpGet(
      url,
      {},
      function (response: any) {
        that.detailLoading = false;

        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      function (response: any) {
        that.detailLoading = false;

        if (typeof errorCallback === 'function') {
          errorCallback(that.getErrorMessage(response), response);
        } else {
          //没有传入错误处理的方法就采用默认处理方法：toast弹出该错误信息。
          that.defaultErrorHandler(response);
        }
      },
      finallyCallback
    );
  }

  httpDel(successCallback?: any, errorCallback?: any, finallyCallback?: any) {
    let that = this;
    if (!this.uuid) {
      this.errorMessage = '没有id，无法删除！';
      that.defaultErrorHandler(this.errorMessage, errorCallback);

      return;
    }

    let url = this.getUrlDel() + '?uuid=' + this.uuid;

    this.httpPost(
      url,
      {},
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback,
      finallyCallback
    );
  }
}
