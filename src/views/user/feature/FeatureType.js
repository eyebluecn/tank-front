let FeatureType = {
  PUBLIC: 'PUBLIC',
  USER_MANAGE: 'USER_MANAGE',
  USER_MINE: 'USER_MINE',
  OTHER: 'OTHER'
}

let FeatureTypeMap = {
  PUBLIC: {
    name: '公共接口',
    value: 'PUBLIC',
    style: 'info'
  },
  USER_MANAGE: {
    name: '管理用户',
    value: 'USER_MANAGE',
    style: 'info'
  },
  USER_MINE: {
    name: '查看自己资料',
    value: 'USER_MINE',
    style: 'info'
  },
  OTHER: {
    name: '其他',
    value: 'OTHER',
    style: 'info'
  }
}

let FeatureTypeList = [];
for (let key in FeatureTypeMap) {
  if (FeatureTypeMap.hasOwnProperty(key)) {
    FeatureTypeList.push(FeatureTypeMap[key]);
  }
}

export { FeatureType, FeatureTypeMap, FeatureTypeList }