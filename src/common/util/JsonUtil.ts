export default class JsonUtil {
  //将一个json字符串转换成 json 数组
  static parseList(str: any) {
    if (!str) {
      return [];
    }
    if (str instanceof Array) {
      return str;
    }
    try {
      let list = JSON.parse(str);
      if (list instanceof Array) {
        return list;
      } else {
        console.error('不能将' + str + '转换成数组');
        return [];
      }
    } catch (e) {
      console.error('不能将' + str + '转换成JSON');
      return [];
    }
  }

  //将一个字符串转成js对象
  static toObj(str: any) {
    if (!str) {
      return {};
    }

    try {
      return JSON.parse(str);
    } catch (e) {
      console.error('不能将json字符串' + str + '转换成对象');
      return {};
    }
  }

  //将一个对象转成json字符串
  static toJson(obj: any): string {
    if (!obj) {
      obj = {};
    }

    return JSON.stringify(obj);
  }

  //将JSON进行格式化。
  static prettyJson(json: any) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    return JSON.stringify(json, null, 2);
  }
}
