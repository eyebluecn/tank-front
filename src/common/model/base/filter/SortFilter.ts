import Filter from './Filter';
import SortDirection from '../SortDirection';

/**
 *
 * 排序过滤器
 *
 */
export default class SortFilter extends Filter {
  //值，最终填写的内容。null表示这个值不设置
  value: SortDirection | null = null;

  constructor(name: string, code: string, visible?: boolean) {
    super(name, code, visible);
    //过滤排序器，more是不显示的。
    //没有传默认为true.
    if (visible === undefined) {
      this.visible = false;
    } else {
      this.visible = visible;
    }
  }

  //获取值字符串，[null,true,false] => ["","true","false"]
  getValueString(): string {
    if (this.value) {
      return this.value;
    } else {
      return '';
    }
  }

  //通过一个字符串来设置值
  putValue(value: string) {
    if (value === SortDirection.DESC || value === SortDirection.DESCEND) {
      this.value = SortDirection.DESC;
    } else if (value === SortDirection.ASC || value === SortDirection.ASCEND) {
      this.value = SortDirection.ASC;
    } else {
      this.value = null;
    }
  }

  //获取到antd需要使用的值 TODO: SortOrder
  getAntdValue(): any | null {
    if (
      this.value === SortDirection.DESC ||
      this.value === SortDirection.DESCEND
    ) {
      return SortDirection.DESCEND;
    } else if (
      this.value === SortDirection.ASC ||
      this.value === SortDirection.ASCEND
    ) {
      return SortDirection.ASCEND;
    } else {
      return null;
    }
  }

  reset() {
    this.value = null;
  }

  isEmpty(): boolean {
    return this.value === null;
  }
}
