export function startWith(str, prefix) {
  if (typeof prefix === 'undefined' || prefix === null || prefix === '' || typeof str === 'undefined' || str === null || str.length === 0 || prefix.length > str.length) {
    return false
  }

  return str.substr(0, prefix.length) === prefix
}

export function endWith(str, suffix) {
  if (suffix === null || suffix === '' || str === null || str.length === 0 || suffix.length > str.length) {
    return false
  }

  return str.substring(str.length - suffix.length) === suffix
}

//获取文件后缀名
export function getExtension(filename) {

  if (!filename) {
    return ''
  }

  let index1 = filename.lastIndexOf('.')
  if (index1 === -1) {
    return ''
  }
  let index2 = filename.length
  return filename.substring(index1, index2)
}

//一个字符串包含子字符串
export function containStr(father, child) {

  if (father === null || father === '') {
    return false
  }
  return father.indexOf(child) !== -1
}

//把一个大小转变成方便读的格式
//human readable file size
export function humanFileSize(bytes, si = false) {
  let thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  let units = si
    ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(1) + ' ' + units[u]
}

//把数字转换成中文大写金额
export function numberCapital(num) {
  let strOutput = ''
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  num += '00'
  let intPos = num.indexOf('.')
  if (intPos >= 0) {

    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (let i = 0; i < num.length; i++) {

    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元')
}

//转换成首字母小写的驼峰法
export function lowerCamel(str) {

  if (!str) {
    console.error('不能转换空的驼峰字符串。')
    return str
  }

  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
  }).replace(/\s+/g, '')
}

//转换成全部小写的使用 /分隔的字符串. 比如uploadToken会得到 /upload/token
export function lowerSlash(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return '/' + letter.toLowerCase()
  }).replace(/\s+/g, '')
}

/*
 名词变复数归纳总结
 1.一般情况下，在名词后加“s”或“es”.
 2.以s,sh,ch,x结尾的名字，在名词后直接加“es”.
 3.以o结尾的名字，有两种情况：
 1）有生命的名词，在名词后加“es”.
 如：tomato-tomatoes potato-potatoes
 2)无生命的名字，在名字后加“s”.
 如：photo-photos radio-radios
 注意：使用java一律采用加“s”的策略
 4.以辅音字母+y结尾的名词,将y改变为i,再加-es.
 元音字母+y结尾的名词则直接加s
 */
export function toPlural(singular) {

  if (!singular) {
    console.error('不能转换空字符为复数形式。')
    return singular
  }
  let length = singular.length
  //一个字母的直接加个s.
  if (length === 1) {
    return singular + 's'
  }

  let lastChar = singular[length - 1]
  let lastSecondChar = singular[length - 2]
  if (lastChar === 's' || lastChar === 'x' || (lastChar === 'h' && (lastSecondChar === 's' || lastSecondChar === 'c'))) {
    return singular + 'es'
  } else if (lastChar === 'y' && (lastSecondChar !== 'a' && lastSecondChar !== 'e' && lastSecondChar !== 'i' && lastSecondChar !== 'o' && lastSecondChar !== 'u')) {
    return singular.substring(0, length - 1) + 'ies'
  } else {
    return singular + 's'
  }

}
