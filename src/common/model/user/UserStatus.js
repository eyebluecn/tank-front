let UserStatus = {
  OK: 'OK',
  DISABLED: 'DISABLED'
}

let UserStatusMap = {
  OK: {
    name: '激活',
    value: 'OK',
    style: 'primary'
  },
  DISABLED: {
    name: '未激活',
    value: 'DISABLED',
    style: 'danger'
  }
}



let UserStatusList = [];
for (let key in UserStatusMap) {
  if (UserStatusMap.hasOwnProperty(key)) {
    UserStatusList.push(UserStatusMap[key]);
  }
}

export {UserStatus, UserStatusMap, UserStatusList}
