import Filter from './Filter';
import SelectionOption from '../option/SelectionOption';
import SelectionFilterType from './SelectionFilterType';

/**
 *
 * 单项选择过滤器
 *
 */
export default class SelectionFilter extends Filter {
  //候选项，要求必须有name和value。
  options: SelectionOption[];

  //值，最终填写的内容。null表示这个值不设置
  value: string = '';

  //采用的样式
  selectionType: SelectionFilterType;

  constructor(
    name: string,
    code: string,
    options: SelectionOption[],
    selectionType?: SelectionFilterType,
    visible?: boolean
  ) {
    super(name, code, visible);

    this.options = options;
    if (selectionType === undefined) {
      this.selectionType = SelectionFilterType.COMBOBOX;
    } else {
      this.selectionType = selectionType;
    }
  }

  //获取值字符串
  getValueString(): string {
    return this.value;
  }

  //通过一个字符串来设置值
  putValue(value: string) {
    if (value === '') {
      this.value = '';
    } else {
      //必须是options中的值才接纳。
      for (let j = 0; j < this.options.length; j++) {
        let opt = this.options[j];
        if (opt.value === value) {
          this.value = value;
          return;
        }
      }

      this.value = '';
    }
  }

  reset() {
    this.value = '';
  }

  isEmpty(): boolean {
    return this.value === '';
  }
}
