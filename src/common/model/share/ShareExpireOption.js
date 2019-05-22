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
    name: 'share.hour',
    value: 'HOUR',
    deltaMillisecond: 60 * 60 * 1000
  },
  DAY: {
    name: 'share.day',
    value: 'DAY',
    deltaMillisecond: 24 * 60 * 60 * 1000
  },
  WEEK: {
    name: 'share.week',
    value: 'WEEK',
    deltaMillisecond: 7 * 24 * 60 * 60 * 1000
  },
  MONTH: {
    name: 'share.month',
    value: 'MONTH',
    deltaMillisecond: 30 * 24 * 60 * 60 * 1000
  },
  YEAR: {
    name: 'share.year',
    value: 'YEAR',
    deltaMillisecond: 365 * 24 * 60 * 60 * 1000
  },
  INFINITY: {
    name: 'share.infinity',
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
