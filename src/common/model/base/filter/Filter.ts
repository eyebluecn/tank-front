/**
 * 这个是列表筛选器的基类。
 */
export default class Filter {
  //中文名
  name: string;
  //提交时候的键值，英文
  key: string;
  //是否可见
  visible: boolean = true;

  constructor(name: string, key: string, visible?: boolean) {
    this.name = name;
    this.key = key;

    //没有传默认为true.
    if (visible === undefined) {
      this.visible = true;
    } else {
      this.visible = visible;
    }
  }

  /**
   * 获取到一个字符串的值
   */
  getValueString(): string {
    console.error(
      `${this.constructor.name} 的 getValue 不存在，请开发者及时配置。`
    );
    return '';
  }

  /**
   * 把一个字符串放置到value中去，因为有可能从请求参数中回填值
   */
  putValue(value: string) {
    console.error(
      `${this.constructor.name} 的 putValue 不存在，请开发者及时配置。`
    );
  }

  /**
   * 将过滤器的值清空
   */
  reset() {
    console.error(
      `${this.constructor.name} 的 reset 不存在，请开发者及时配置。`
    );
  }

  /**
   * 当前过滤器是否为空
   */
  isEmpty(): boolean {
    console.error(
      `${this.constructor.name} 的 isEmpty 不存在，请开发者及时配置。`
    );
    return false;
  }
}
