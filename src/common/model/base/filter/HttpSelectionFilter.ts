import SelectionFilter from './SelectionFilter';
import SelectionFilterType from './SelectionFilterType';

/**
 *
 * 从远程拉取一个筛选项的过滤器
 *
 */
export default class HttpSelectionFilter extends SelectionFilter {
  //远程的访问链接。
  url: string;

  constructor(
    name: string,
    code: string,
    url: string,
    selectionType?: SelectionFilterType,
    visible?: boolean
  ) {
    super(name, code, [], selectionType, visible);
    this.url = url;
  }

  //通过一个字符串来设置值
  //远程调用的值必须要宽容，因为值可能还没有从远程取回来呢。
  putValue(value: string) {
    this.value = value;
  }

  //严格的回填，采用父类的策略
  //这个方法会在http请求完成了之后调用。HttpSelectionFilter中会调用
  strictPutValue(value: string) {
    super.putValue(value);
  }
}
