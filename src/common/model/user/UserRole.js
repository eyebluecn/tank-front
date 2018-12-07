let UserRole = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMINISTRATOR: 'ADMINISTRATOR'
}

let UserRoleMap = {
  GUEST: {
    name: '游客身份',
    value: 'GUEST'
  },
  USER: {
    name: '注册用户',
    value: 'USER'
  },
  ADMINISTRATOR: {
    name: '管理员',
    value: 'ADMINISTRATOR'
  }
}


let UserRoleList = [];
for (let key in UserRoleMap) {
  if (UserRoleMap.hasOwnProperty(key)) {
    UserRoleList.push(UserRoleMap[key]);
  }
}

export {UserRole, UserRoleMap, UserRoleList}
