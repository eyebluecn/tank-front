let UserRole = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMINISTRATOR: 'ADMINISTRATOR'
}

let UserRoleMap = {
  GUEST: {
    name: 'user.roleGuest',
    value: 'GUEST',
    style: "warning",
  },
  USER: {
    name: 'user.roleUser',
    value: 'USER',
    style: "primary",
  },
  ADMINISTRATOR: {
    name: 'user.roleAdministrator',
    value: 'ADMINISTRATOR',
    style: "success",
  }
}


let UserRoleList = [];
for (let key in UserRoleMap) {
  if (UserRoleMap.hasOwnProperty(key)) {
    UserRoleList.push(UserRoleMap[key]);
  }
}

export {UserRole, UserRoleMap, UserRoleList}
