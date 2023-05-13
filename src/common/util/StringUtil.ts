export default class StringUtil {
  //大写字母
  static UPPER_CASES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  //下划线转驼峰
  static underScoreToCamel(str: string) {
    if (!str) {
      console.error('不能转换空的驼峰字符串。');
      return str;
    }

    const regex = /_[a-z]/gm;

    return str.replace(regex, function (letter: any, index: any) {
      return letter.substr(1).toUpperCase();
    });
  }

  //转换成首字母小写的驼峰法
  static lowerCamel(str: any) {
    if (!str) {
      console.error('不能转换空的驼峰字符串。');
      return str;
    }

    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter: any, index: any) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  //转换成全部小写的使用 /分隔的字符串
  static lowerSlash(str: any) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter: any, index: any) {
        return '/' + letter.toLowerCase();
      })
      .replace(/\s+/g, '');
  }

  //一个字符串包含子字符串
  static containStr(father: string | null, child: string): boolean {
    if (father === null || father === '') {
      return false;
    }
    return father.indexOf(child) !== -1;
  }

  //把一个大小转变成方便读的格式
  //human readable file size
  static humanFileSize(bytes: number, si: boolean = false) {
    let thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    let units = si
      ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

  //将首字母大写
  static capitalize(str: any) {
    if (!str) {
      return str;
    }

    str = str.replace(/^\w/, (c: any) => c.toUpperCase());

    return str;
  }

  //将首字母小写
  static lower(str: any) {
    if (!str) {
      return str;
    }

    str = str.replace(/^\w/, (c: any) => c.toLowerCase());

    return str;
  }

  //获取一个function的名字
  static functionName(func: any) {
    // Match:
    // - ^          the beginning of the string
    // - function   the word 'function'
    // - \s+        at least some white space
    // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
    // - \s*        optionally followed by white space (in theory there won't be any here,
    //              so if performance is an issue this can be omitted[1]
    // - \(         followed by an opening brace
    //
    let result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

    return result ? result[1] : ''; // for an anonymous function there won't be a match
  }

  //check whether an obj is empty
  static isEmptyObject(obj: any) {
    if (!obj) {
      return true;
    }

    for (let key in obj) {
      return false;
    }
    return true;
  }

  /**
   * 获取到上num级路径
   * 例子： /tank/setting/notification -> /tank/setting
   * @param path 原路径
   * @param num 上几级，默认1级
   */
  static prePath(path: string, num: number = 1): string {
    if (!path) {
      return path;
    }

    //去除掉最后的/符号。
    let parts: string[] = path.split('/');
    //去除所有的空
    parts = parts.filter((item: string, index: number) => {
      return item !== '';
    });

    //前面几层就是删掉前面几个元素。如果超出了，会全部删掉。
    parts.splice(parts.length - num);

    return '/' + parts.join('/');
  }

  static startWith(str: any, prefix: any) {
    if (
      typeof prefix === 'undefined' ||
      prefix === null ||
      prefix === '' ||
      typeof str === 'undefined' ||
      str === null ||
      str.length === 0 ||
      prefix.length > str.length
    ) {
      return false;
    }

    return str.substr(0, prefix.length) === prefix;
  }

  static endWith(str: any, suffix: any) {
    if (
      suffix === null ||
      suffix === '' ||
      str === null ||
      str.length === 0 ||
      suffix.length > str.length
    ) {
      return false;
    }

    return str.substring(str.length - suffix.length) === suffix;
  }

  /**
   * 去除掉开头的前缀
   * @param str 待处理的字符串
   * @param prefix 前缀
   */
  static trimPrefix(str: string | null, prefix: string): string {
    if (!str) {
      return '';
    } else {
      if (str.substr(0, prefix.length) === prefix) {
        return str.substr(prefix.length);
      } else {
        return str;
      }
    }
  }

  /**
   * 去除掉后缀
   * @param str 待处理的字符串
   * @param suffix 前缀
   */
  static trimSuffix(str: string | null, suffix: string): string {
    if (!str) {
      return '';
    } else {
      if (str.substring(str.length - suffix.length) === suffix) {
        return str.substr(0, str.length - suffix.length);
      } else {
        return str;
      }
    }
  }

  //在字符串a后面追加字符串b
  static append(a: any, b: any, separator = '') {
    if (a === null || a === '' || typeof a !== 'string') {
      return b;
    } else {
      return a + separator + b;
    }
  }

  static isBlank(text: string | null | undefined): boolean {
    if (text === null || text == undefined) {
      return true;
    }

    return text.trim() === '';
  }

  static isNotBlank(text: string | null | undefined): boolean {
    return !StringUtil.isBlank(text);
  }

  //将时间戳转换成62进制
  static generateUniqueCode(num?: number): string {
    //获取时间戳

    if (num === undefined) {
      num = new Date().getTime();
    }

    let standardString =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result;
    let list: number[] = [];
    let len = standardString.length;
    let level;
    for (level = 0; Math.floor(num / len) > 0; level++) {
      result = num % len;
      list.push(result);
      num = (num - result) / len;
    }
    list.push(num);
    let code = '';
    list.forEach((item) => {
      code = standardString[item] + code;
    });
    return code;
  }

  //字符串转换成十进制
  static parseUniqueCode(str: string): number {
    let exchangeString =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let strNew = str.split('');
    let list: number[] = [];
    strNew.map((item: string) => {
      list.push(exchangeString.indexOf(item));
    });
    let num = 0;
    for (let i = 0; i < list.length; i++) {
      num += list[i] * Math.pow(exchangeString.length, list.length - i - 1);
    }
    return num;
  }
}
