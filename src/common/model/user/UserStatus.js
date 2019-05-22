let UserStatus = {
  OK: 'OK',
  DISABLED: 'DISABLED'
}

let UserStatusMap = {
  OK: {
    name: 'user.statusActive',
    value: 'OK',
    style: 'primary'
  },
  DISABLED: {
    name: 'user.statusDisabled',
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
