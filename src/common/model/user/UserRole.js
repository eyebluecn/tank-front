let UserRole = {
  GUEST: 'GUEST',
  USER: 'USER',
  ADMINISTRATOR: 'ADMINISTRATOR'
}

let UserRoleMap = {
  GUEST: {
    name: 'Guest',
    value: 'GUEST',
    style: "warning",
  },
  USER: {
    name: 'User',
    value: 'USER',
    style: "primary",
  },
  ADMINISTRATOR: {
    name: 'Administrator',
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
