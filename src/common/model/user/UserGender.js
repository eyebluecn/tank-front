let UserGender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN'
}

let UserGenderMap = {
  MALE: {
    name: '男',
    value: 'MALE'
  },
  FEMALE: {
    name: '女',
    value: 'FEMALE'
  },
  UNKNOWN: {
    name: '未知',
    value: 'UNKNOWN'
  }
}


let UserGenderList = [];
for (let key in UserGenderMap) {
  if (UserGenderMap.hasOwnProperty(key)) {
    UserGenderList.push(UserGenderMap[key]);
  }
}

export {UserGender, UserGenderMap, UserGenderList}
