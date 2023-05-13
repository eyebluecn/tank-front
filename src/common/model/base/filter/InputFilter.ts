import Filter from './Filter';

/**
 * 文本输入框筛选器
 * 这种一般是模糊搜索。
 */
export default class InputFilter extends Filter {
  //值，最终填写的内容
  value: string = '';

  //占位符
  placeholder: string;

  constructor(
    name: string,
    code: string,
    placeholder?: string | null,
    visible?: boolean
  ) {
    super(name, code, visible);

    if (placeholder) {
      this.placeholder = placeholder;
    } else {
      this.placeholder = name;
    }
  }

  //获取值字符串
  getValueString(): string {
    return this.value;
  }

  //通过一个字符串来设置值
  putValue(value: string) {
    this.value = value;
  }

  reset() {
    this.value = '';
  }

  isEmpty(): boolean {
    return this.value === '';
  }
}
