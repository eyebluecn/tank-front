let UserStatus = {
  OK: 'OK',
  DISABLED: 'DISABLED'
}

let UserStatusMap = {
  OK: {
    name: 'Active',
    value: 'OK',
    style: 'primary'
  },
  DISABLED: {
    name: 'Disabled',
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
