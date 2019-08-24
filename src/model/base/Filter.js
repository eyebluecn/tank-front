/**
 * 在列表页面中，筛选就需要这个类。
 *
 */
import BaseEntity from './BaseEntity'
import {isEmptyObject} from '../../common/util/Utils'
import {FilterType} from "./FilterType";
import {simpleDate, simpleDateTime} from "../../common/filter/time";

export default class Filter {

  constructor(type, name, key, options, Clazz, visible = true) {
    if (!type || !name || !key) {
      console.error('Filter params error!' + type + ' ' + name + ' ' + key)
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

    //HTTP_SELECTION的过滤条件。
    this.initFilter = {}

    if (type === FilterType.SELECTION) {
      if (!options || !(options instanceof Array)) {
        console.error('Filter SELECTION 的 options必须指定，并且为数组，同时必须包含name和value键值（style可选）!')

      }
    } else if (type === FilterType.MULTI_SELECTION) {
      if (!options || !(options instanceof Array)) {
        console.error('Filter MULTI_SELECTION 的 options必须指定，并且为数组，同时必须包含name和value键值（style可选）!')

      } else {
        this.value = []
      }
    } else if (type === FilterType.HTTP_SELECTION) {
      if (!Clazz || !(Clazz.prototype instanceof BaseEntity)) {
        console.error('Clazz必须指定，并且为BaseEntity的子类!')

      }
    }

  }

  isEmpty() {

    if (this.type === FilterType.MULTI_SELECTION) {
      return isEmptyObject(this.value)
    } else if (this.type === FilterType.CHECK) {
      return this.value === null
    } else {
      return !this.value
    }
  };

  reset() {
    this.value = null
    this.active = -1
  };

  putValue(value) {
    if (value === null) {
      this.value = null
      return
    }

    if (this.type === FilterType.MULTI_SELECTION) {

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
    } else if (this.type === FilterType.SELECTION) {

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
  getParam() {

    if (this.type === FilterType.MULTI_SELECTION) {
      if (this.value && this.value.length) {
        return this.value.toString()
      } else {
        return null
      }
    } else if (this.type === FilterType.DATE_TIME_SELECTION) {
      if (this.value instanceof Date) {
        return simpleDateTime(this.value)
      } else {
        return this.value
      }
    } else if (this.type === FilterType.DATE_SELECTION) {
      if (this.value instanceof Date) {
        return simpleDate(this.value)
      } else {
        return this.value
      }
    } else {
      return this.value
    }

  };

}

