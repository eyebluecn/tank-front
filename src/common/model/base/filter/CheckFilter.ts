import Filter from './Filter';

/**
 *
 * Checkbox筛选框过滤器
 *
 */
export default class CheckFilter extends Filter {
  //值，最终填写的内容。null表示这个值不设置
  value: boolean | null = null;

  constructor(name: string, code: string, visible?: boolean) {
    super(name, code, visible);
  }

  //获取值字符串，[null,true,false] => ["","true","false"]
  getValueString(): string {
    let stringValue = '';
    if (this.value === true) {
      stringValue = 'true';
    } else if (this.value === false) {
      stringValue = 'false';
    } else {
      stringValue = '';
    }
    return stringValue;
  }

  //通过一个字符串来设置值
  putValue(value: any) {
    if (value === 'true' || value === true) {
      this.value = true;
    } else if (value === 'false' || value === false) {
      this.value = false;
    } else {
      this.value = null;
    }
  }

  reset() {
    this.value = null;
  }

  isEmpty(): boolean {
    return this.value === null;
  }
}
