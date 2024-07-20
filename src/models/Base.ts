import ObjectUtil from '@/common/util/ObjectUtil'
import DateUtil from '@/common/util/DateUtil'

export interface IBase {
  uuid: string
  sort: number
  createTime: Date | null
  updateTime: Date | null
}

export default class Base implements IBase {
  /**
   * 唯一标识
   */
  uuid = ''

  /**
   * 排序值
   */
  sort = 0

  /**
   * 创建时间
   */
  createTime = null

  /**
   * 修改时间
   */
  updateTime = null

  //把obj中的属性，赋值到this中来。采用深拷贝。
  assign(obj: any) {
    ObjectUtil.extend(this, obj)

    this.assignEntity('createTime', Date)
    this.assignEntity('updateTime', Date)
  }

  //直接render出一个Entity. field字段名，Clazz类名。
  assignEntity(field: any, Clazz: any) {
    let thisObj: any = this

    let obj: any = thisObj[field]
    if (!obj) {
      if (Clazz) {
        let EntityClazz: any = this.constructor
        obj = new EntityClazz()[field]
      } else {
        return
      }
    }

    if (Clazz === Date) {
      thisObj[field] = DateUtil.str2Date(obj)
    } else if (Clazz.prototype instanceof Base) {
      //可能此处的该项属性做了特殊处理的。
      //1024*1024 以及 "图片尺寸不超过1M"用let bean = new Clazz(); 就无法反映出来。因为父类assign的时候已经将avatar给变成了Object.
      let bean = new thisObj.constructor()[field]
      if (!bean) {
        bean = new Clazz()
      }

      if (typeof obj === 'string') {
        try {
          obj = JSON.parse(obj)
        } catch (e) {
          console.error('JSON parse obj error', e)
        }
      }

      if (obj !== null) {
        bean.assign(obj)
        thisObj[field] = bean
      }
    } else {
      console.error('调用错误！')
    }
  }

  httpPage() {}
}
