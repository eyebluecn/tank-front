let MoneyType = {
  CASH: 'CASH',
  DISCOUNT: 'DISCOUNT'
}

let MoneyTypeMap = {
  CASH: {
    name: '按金额',
    value: 'CASH',
    style: 'success'
  },
  DISCOUNT: {
    name: '打折扣',
    value: 'DISCOUNT',
    style: 'primary'
  }
}

let MoneyTypeList = []
for (let key in MoneyTypeMap) {
  if (MoneyTypeMap.hasOwnProperty(key)) {
    MoneyTypeList.push(MoneyTypeMap[key])
  }
}

export { MoneyType, MoneyTypeMap, MoneyTypeList }
