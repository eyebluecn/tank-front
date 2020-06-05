import ObjectUtil from "../../util/ObjectUtil";
import JsonUtil from "../../util/JsonUtil";
import DateUtil from "../../util/DateUtil";

/**
 *
 * 基类。使我们前端的所有自定义类的基类。
 * 在这个类中可以统计建立的实体个数。
 */
export default class Base {

  //我们认为每个实体都会存放于某个react组件中，当然可以不传入。
  constructor() {

  }

  //把obj中的属性，赋值到this中来。采用深拷贝。
  assign(obj: any) {
    ObjectUtil.extend(this, obj)
  }

  /**
   *
   * @param field 字段名
   * @param Clazz 类型名
   */
  assignList<F extends keyof this>(field: string, Clazz: any) {

    ObjectUtil.assignList(this, field, Clazz)
  }


  /**
   * 根据一个类型，渲染出对应的数组。
   * @param json 字符串或者数组对象。
   * @param Clazz 需要渲染的目标对象
   * @returns {*}
   */
  static renderList(json: any, Clazz: any) {

    let target: any = []


    let arr: any = []

    if (json instanceof String || typeof json === "string") {

      arr = JsonUtil.parseList(json)

    } else if (json instanceof Array) {
      arr = json
    } else {

      console.error("源必须为字符或者数组", json, typeof json)
      return target
    }

    //如果我们要转换成字符串的数组形式，那么this[field]应该是一个字符串才对。
    if (Clazz === String) {
      return arr
    }

    if (!Clazz || !(Clazz.prototype instanceof Base)) {
      console.error("指定的类型必须是 Base的子类 ")
      return target
    }

    for (let i = 0; i < arr.length; i++) {
      let bean = arr[i]

      let clazz = new Clazz()

      clazz.assign(bean)

      target.push(clazz)
    }

    return target
  }

  //直接render出一个Entity. field字段名，Clazz类名。
  assignEntity(field: any, Clazz: any) {

    let thisObj: any = this

    let obj: any = thisObj[field]
    if (!obj) {
      if (Clazz) {
        let EntityClazz: any = this.constructor
        obj = (new EntityClazz())[field]

      } else {
        return
      }
    }

    if (Clazz === Date) {

      thisObj[field] = DateUtil.str2Date(obj)

    } else if (Clazz.prototype instanceof Base) {

      //可能此处的该项属性做了特殊处理的。
      //1024*1024 以及 "图片尺寸不超过1M"用let bean = new Clazz(); 就无法反映出来。因为父类assign的时候已经将avatar给变成了Object.
      let bean = (new thisObj.constructor())[field]
      if (!bean) {
        bean = new Clazz()
      }

      if (obj !== null) {
        bean.assign(obj)
        thisObj[field] = bean
      }

    } else {
      console.error('调用错误！')
    }

  }


}




