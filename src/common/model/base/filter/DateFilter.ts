import Filter from './Filter';
import DateUtil from '../../../util/DateUtil';

/**
 *
 * 时间筛选器
 *
 */
export default class DateFilter extends Filter {
  //时间筛选的格式
  format: string;

  //值，最终填写的内容。null表示这个值不设置
  value: Date | null = null;

  constructor(name: string, code: string, format?: string, visible?: boolean) {
    super(name, code, visible);
    if (format) {
      this.format = format;
    } else {
      this.format = DateUtil.DATE_FORMAT;
    }
  }

  //获取值字符串
  getValueString(): string {
    if (this.value) {
      return DateUtil.format(this.value, this.format);
    } else {
      return '';
    }
  }

  //通过一个字符串来设置值
  putValue(value: string) {
    this.value = DateUtil.parse(value);
  }

  reset() {
    this.value = null;
  }

  isEmpty(): boolean {
    return this.value === null;
  }
}
