/**
 * 在列表页面中，筛选就需要这个类。
 *
 */
import BaseEntity from './BaseEntity'
import { isEmptyObject } from '../../util/Utils'

let Type = {
  //用于boolean筛选
  CHECK: 'CHECK',
  //用于文本输入筛选
  INPUT: 'INPUT',
  //用于排序字段筛选
  SORT: 'SORT',
  //用于有限的状态筛选
  SELECTION: 'SELECTION',
  //用于从有限的状态中选出多项，比如：status = RUNNING or status = STOP
  MULTI_SELECTION: 'MULTI_SELECTION',
  //用于Pager筛选
  HTTP_SELECTION: 'HTTP_SELECTION',
  //用于输入框从远程筛选。
  HTTP_INPUT_SELECTION: 'HTTP_INPUT_SELECTION',
  //用于按照时间筛选
  DATE_TIME_SELECTION: 'DATE_TIME_SELECTION'
}

export default class Filter {

  constructor (type, name, key, options, Clazz, visible = true, component) {
    if (!type || !name || !key) {
      console.error('Filter 传入的参数缺失！' + type + ' ' + name + ' ' + key)
      return
    }

    //类别 搜索框，排序，下拉框
    this.type = type
    //显示名称，一般中文
    this.name = name
    //提交参数时的键值
    this.key = key
    //对于搜索框 -> 字符串 排序 -> ASC/DESC/null 下拉框 -> OK/ERROR/RUNNING等
    this.value = null

    //对于下拉框，当前活跃的。
    this.active = -1

    this.options = options

    this.Clazz = Clazz

    //是否可见。有些时候我们希望Filter不显示，但是同时又具有筛选的功能。
    this.visible = visible

    //一些高级筛选自定义控件。
    this.component = component

    //HTTP_SELECTION的过滤条件。
    this.initFilter = {}

    if (type === Type.SELECTION) {
      if (!options || !(options instanceof Array)) {
        console.error('Filter SELECTION 的 options必须指定，并且为数组，同时必须包含name和value键值（style可选）！')

      }
    } else if (type === Type.MULTI_SELECTION) {
      if (!options || !(options instanceof Array)) {
        console.error('Filter MULTI_SELECTION 的 options必须指定，并且为数组，同时必须包含name和value键值（style可选）！')

      } else {
        this.value = []
      }
    } else if (type === Type.HTTP_SELECTION) {
      if (!Clazz || !(Clazz.prototype instanceof BaseEntity)) {
        console.error('Clazz必须指定，并且为BaseEntity的子类！')

      }
    }

  }

  isEmpty () {

    if (this.type === Type.MULTI_SELECTION) {
      return isEmptyObject(this.value)
    } else if (this.type === Type.CHECK) {
      return this.value === null
    } else {
      return !this.value
    }
  };

  reset () {
    this.value = null
    this.active = -1
  };

  putValue (value) {
    if (value === null) {
      this.value = null
      return
    }

    if (this.type === Type.MULTI_SELECTION) {

      let draftArray = null
      if (value instanceof Array) {
        draftArray = value
      } else {
        draftArray = value.split(',')
      }
      let arr = []
      for (let i = 0; i < draftArray.length; i++) {
        let item = draftArray[i]

        //验证值是否落在options中。
        for (let j = 0; j < this.options.length; j++) {
          let opt = this.options[j]
          if (opt.value === item) {
            //保证唯一性
            if (arr.indexOf(item) === -1) {
              arr.push(item)
            }
            break
          }
        }
      }
      this.value = arr
    } else if (this.type === this.Type.SELECTION) {

      for (let j = 0; j < this.options.length; j++) {

        let opt = this.options[j]
        if (opt.value === value) {
          this.value = value
          this.active = j
        }

      }
    } else {
      this.value = value
    }

  };

  //把filter中的value装填到params中，供params去进行http请求。
  getParam () {

    if (this.type === Type.MULTI_SELECTION) {
      if (this.value && this.value.length) {
        return this.value.toString()
      } else {
        return null
      }
    } else {
      return this.value
    }

  };

}

Filter.prototype.Type = Type
