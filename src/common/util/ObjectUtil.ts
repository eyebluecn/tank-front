import DateUtil from './DateUtil';
import JsonUtil from './JsonUtil';

export default class ObjectUtil {
  //将 extraObj 中的属性全部赋值给standardObj
  static extend(standardObj: any, extraObj: any) {
    for (let key in extraObj) {
      if (extraObj.hasOwnProperty(key)) {
        if (standardObj.hasOwnProperty(key)) {
          standardObj[key] = extraObj[key];
        }
      }
    }
  }

  // 深拷贝，保留standardObj第一层全部属性
  static deepExtend(standardObj: any, extraObj: any, checkKey: boolean = true) {
    for (let key in extraObj) {
      if (checkKey) {
        if (standardObj.hasOwnProperty(key)) {
          standardObj[key] =
            extraObj[key] instanceof Object
              ? ObjectUtil.deepExtend({}, extraObj[key], false)
              : extraObj[key];
        }
      } else {
        standardObj[key] =
          extraObj[key] instanceof Object
            ? ObjectUtil.deepExtend({}, extraObj[key], false)
            : extraObj[key];
      }
    }
    return standardObj;
  }

  //将standardObj的field属性规整成时间格式。
  static assignDate(standardObj: any, field: any) {
    if (standardObj.hasOwnProperty(field)) {
      standardObj[field] = DateUtil.str2Date(standardObj[field]);
    }
  }

  //吧standardObj的field属性归整成Clazz类型
  static assignList(standardObj: any, field: any, Clazz: any) {
    if (standardObj.hasOwnProperty(field)) {
      //如果我们要转换成字符串的数组形式，那么this[field]应该是一个字符串才对。
      if (Clazz === String) {
        standardObj[field] = JsonUtil.parseList(standardObj[field]);

        return;
      }

      //下面就是转换实体数组了。
      let beans = standardObj[field];
      if (!beans) {
        //服务器返回这个字段为空 维持构造函数中的默认值（一般而言是一个[]）
        standardObj[field] = new standardObj.constructor()[field];
        return;
      }

      standardObj[field] = [];

      if (!Clazz) {
        return;
      }

      for (let i = 0; i < beans.length; i++) {
        let bean = beans[i];
        let clazz = new Clazz();

        if (clazz.assign) {
          clazz.assign(bean);
        } else {
          console.error(clazz);
          console.error('没有定义assign方法');
        }

        standardObj[field].push(clazz);
      }
    }
  }

  //check whether an obj is empty
  static isEmptyObject(obj: object) {
    if (typeof obj !== 'object') {
      console.error('判定的不是obj对象');
      return true;
    }

    for (let key in obj) {
      return false;
    }

    return true;
  }

  /**
   * 将键值对转换成  age=18&name=xxx 的形式
   */
  static param(map: any) {
    let arr: string[] = [];
    for (let key in map) {
      if (map.hasOwnProperty(key)) {
        let value = map[key];
        arr[arr.length] =
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent(value == null ? '' : value);
      }
    }

    return arr.join('&');
  }
}
