//定义一个转换器
/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
if (!Date.prototype.format) {
  Date.prototype.format = function (fmt) {
    let o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
      'H+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds() //毫秒
    }
    let week = {
      '0': '/u65e5',
      '1': '/u4e00',
      '2': '/u4e8c',
      '3': '/u4e09',
      '4': '/u56db',
      '5': '/u4e94',
      '6': '/u516d'
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

if (!Date.prototype.setISO8601) {
  Date.prototype.setISO8601 = function (string) {
    let regexp = '([0-9]{4})(-([0-9]{2})(-([0-9]{2})' +
      '(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?' +
      '(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?'
    if (string) {
      let d = string.match(new RegExp(regexp))
      let offset = 0
      let date = new Date(d[1], 0, 1)

      if (d[3]) {
        date.setMonth(d[3] - 1)
      }
      if (d[5]) {
        date.setDate(d[5])
      }
      if (d[7]) {
        date.setHours(d[7])
      }
      if (d[8]) {
        date.setMinutes(d[8])
      }
      if (d[10]) {
        date.setSeconds(d[10])
      }
      if (d[12]) {
        date.setMilliseconds(Number('0.' + d[12]) * 1000)
      }
      if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17])
        offset *= ((d[15] === '-') ? 1 : -1)
      }
      offset -= date.getTimezoneOffset()
      let time = (Number(date) + (offset * 60 * 1000))
      this.setTime(Number(time))
    }
  }
}

//将js的时间对象，转换成yyyy-MM-dd格式的字符串
export function simpleDate (d, fallback = null) {
  if (d instanceof Date) {
    return d.format('yyyy-MM-dd')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成MM-dd格式的字符串
export function simpleMiniDate (d, fallback = null) {
  if (d instanceof Date) {
    return d.format('MM-dd')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成yyyy-MM-dd HH:mm:ss格式的字符串
export function simpleDateTime (d, fallback = null) {
  if (d instanceof Date) {
    return d.format('yyyy-MM-dd HH:mm:ss')
  } else if (d === null) {
    return fallback
  } else {
    console.error('Time format error:' + d)
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成yyyy-MM-dd HH:mm格式的字符串
export function simpleDateHourMinute (d, fallback = null) {
  if (d instanceof Date) {
    return d.format('yyyy-MM-dd HH:mm')
  } else if (d === null) {
    return fallback
  } else {
    console.error('Time format error:' + d)
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成HH:mm:ss格式的字符串
export function simpleTime (d, fallback = null) {

  if (d instanceof Date) {
    return d.format('HH:mm:ss')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成HH:mm格式的字符串
export function simpleMinute (d, fallback = null) {

  if (d instanceof Date) {
    return d.format('HH:mm')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成dd格式的字符串
export function simpleDay (d, fallback = null) {

  if (d instanceof Date) {
    return d.format('dd')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成yyyy-MM格式的字符串
export function simpleYearAndMonth (d, fallback = null) {

  if (d instanceof Date) {
    return d.format('yyyy-MM')
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将js的时间对象，转换成人性化的时间。当天:15:34 2017-04-03
export function humanTime (d, fallback = null) {

  let now = new Date()
  if (d instanceof Date) {

    if (now.toDateString() === d.toDateString()) {
      return d.format('HH:mm')
    } else {
      return d.format('yyyy-MM-dd')
    }
  } else if (d === null) {
    return fallback
  } else {
    return 'Invalid Date:' + d
  }
}

//将时间戳转换成易读的格式
export function unixTimeStamp2simpleDate (timestamp) {

  if ((typeof timestamp) === 'number') {
    let unixTimestamp = new Date(timestamp)

    return unixTimestamp.format('yyyy-MM-dd')

  } else {

    return 'Invalid timestamp'

  }
}

//将时间戳转换成易读的格式
export function unixTimeStamp2simpleDateTime (timestamp) {

  if ((typeof timestamp) === 'number') {

    let unixTimestamp = new Date(timestamp)

    return unixTimestamp.format('yyyy-MM-dd HH:mm')

  } else {

    return 'Invalid timestamp'

  }
}

//将java时间字符串转换成易读的格式
export function str2simpleDate (str) {
  if (!str) {
    return 'Invalid time'
  }

  let d = new Date()
  d.setISO8601(str)

  return d.format('yyyy-MM-dd')

}

//将java时间字符串转换成易读的格式
export function str2simpleDateTime (str) {

  if (!str) {
    return 'Invalid time'
  }

  let d = new Date()
  d.setISO8601(str)
  return d.format('yyyy-MM-dd HH:mm')

}

//将java时间字符串转换成易读的格式
export function str2DateTime (str) {

  if (!str) {
    return 'Invalid time'
  }

  let d = new Date()
  d.setISO8601(str)
  return d.format('yyyy-MM-dd HH:mm:ss')

}

//将java时间字符串转化成js date
export function str2Date (str) {
  if (!str) {
    return null
  }

  if (str instanceof Date) {
    return str
  }

  //尝试转换时间戳
  if (typeof str === 'number') {
    return new Date(str)
  }
  //尝试转换yyyy-MM-dd HH:mm:ss 这种格式
  if (str.length === 19) {
    return new Date(Date.parse(str.replace(/-/g, '/')))
  }

  //尝试转换yyyy-MM-dd这种格式
  if (str.length === 10) {
    return new Date(str)
  }

  let d = new Date()
  try {
    d.setISO8601(str)
    return d
  } catch (e) {
    console.error('error date format:' + str)
    return null
  }

}

//将时间戳转换成易读的格式
export function str2simpleTime (str) {

  if (!str) {
    return 'Invalid time'
  }
  let d = new Date()
  d.setISO8601(str)
  return d.format('HH:mm')
}

//将时间戳转换成毫秒形式
export function str2timeStamp (str) {

  if (!str) {
    return 'Invalid time'
  }
  let d = new Date()
  d.setISO8601(str)
  return d.getTime()
}

//将日期转换成相对于今天的星期几。昨天，明天，今天
export function date2Weekday (date) {
  let today = new Date()
  let dateYear = date.getFullYear()
  let dateMonth = date.getMonth()
  let dateDate = date.getDate()
  let todayYear = today.getFullYear()
  let todayMonth = today.getMonth()
  let todayDate = today.getDate()
  if (dateYear === todayYear && dateMonth === todayMonth && Math.abs(dateDate - todayDate) <= 1) {
    if (dateDate === todayDate) {
      return '今天'
    } else if (dateDate === (todayDate + 1)) {
      return '明天'
    } else if (dateDate === (todayDate - 1)) {
      return '昨天'
    }
  } else {
    if (date.getDay() === 0) {
      return '星期日'
    } else if (date.getDay() === 1) {
      return '星期一'
    } else if (date.getDay() === 2) {
      return '星期二'
    } else if (date.getDay() === 3) {
      return '星期三'
    } else if (date.getDay() === 4) {
      return '星期四'
    } else if (date.getDay() === 5) {
      return '星期五'
    } else if (date.getDay() === 6) {
      return '星期六'
    }
  }
}

//返回前一天的日期
export function preDay (date) {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000)
}

//返回后一天的日期
export function nextDay (date) {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000)
}

//这个是为了兼容pdf预览时pebble的过滤器。
export function date (d, format) {

  if (d instanceof Date) {
    return d.format(format)
  } else {
    return ''
  }

}
