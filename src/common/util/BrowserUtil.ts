export default class BrowserUtil {
  //根据cookie键，读取cookie值
  static readCookie(name: any) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   *
   * 获取url地址栏的参数
   * // query string: ?foo=lorem&bar=&baz
   * var foo = getQueryByName('foo'); // "lorem"
   * var bar = getQueryByName('bar'); // "" (present with empty value)
   * var baz = getQueryByName('baz'); // "" (present with no value)
   * var qux = getQueryByName('qux'); // null (absent)
   * @param name
   * @param url
   * @returns {*}
   */
  static getQueryByName(name: string, url?: string): string | null {
    if (!url) {
      url = window.location.href;
    }

    name = name.replace(/[\[\]]/g, '\\$&');

    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);

    if (!results) {
      return null;
    }

    if (!results[2]) {
      return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
   * 半颜的方法。注释待补充
   * @param name
   * @returns {*}
   */
  static getQueryString(name: any) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  static isLocalStorageNameSupported() {
    let testKey = 'test';
    let storage = window.localStorage;
    try {
      storage.setItem(testKey, '1');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  static readLocalStorage(key: any) {
    if (BrowserUtil.isLocalStorageNameSupported()) {
      return window.localStorage[key];
    } else {
      console.error('not support localStorage.');
      return null;
    }
  }

  static saveToLocalStorage(key: any, content: any) {
    if (BrowserUtil.isLocalStorageNameSupported()) {
      window.localStorage[key] = content;
    } else {
      console.error('not support localStorage.');
    }
  }

  static removeLocalStorage(key: any) {
    if (BrowserUtil.isLocalStorageNameSupported()) {
      window.localStorage.removeItem(key);
    } else {
      console.error('not support localStorage.');
    }
  }

  /**
   * 获取完整的host
   * eg:
   * https://tanker.eyeblue.cn
   */
  static fullHost() {
    return window.location.protocol + '//' + window.location.host;
  }

  //只支持zh和en
  static browserLang() {
    //常规浏览器语言和IE浏览器
    let lang = navigator.language || (navigator as any).userLanguage;

    //截取lang前2位字符
    lang = lang.substr(0, 2);
    if (lang === 'zh') {
      return 'zh';
    } else {
      return 'en';
    }
  }
}
