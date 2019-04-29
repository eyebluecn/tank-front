let ShareExpireOption = {
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  INFINITY: 'INFINITY'
}

let ShareExpireOptionMap = {
  HOUR: {
    name: '1小时',
    value: 'HOUR',
    deltaMillisecond: 60 * 60 * 1000
  },
  DAY: {
    name: '1天',
    value: 'DAY',
    deltaMillisecond: 24 * 60 * 60 * 1000
  },
  WEEK: {
    name: '1周',
    value: 'WEEK',
    deltaMillisecond: 7 * 24 * 60 * 60 * 1000
  },
  MONTH: {
    name: '1个月',
    value: 'MONTH',
    deltaMillisecond: 30 * 24 * 60 * 60 * 1000
  },
  YEAR: {
    name: '1年',
    value: 'YEAR',
    deltaMillisecond: 365 * 24 * 60 * 60 * 1000
  },
  INFINITY: {
    name: '永远有效',
    value: 'INFINITY',
    deltaMillisecond: 0
  }
}

let ShareExpireOptionList = [];
for (let key in ShareExpireOptionMap) {
  if (ShareExpireOptionMap.hasOwnProperty(key)) {
    ShareExpireOptionList.push(ShareExpireOptionMap[key]);
  }
}

export {ShareExpireOption, ShareExpireOptionMap, ShareExpireOptionList}
