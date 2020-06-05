import SelectionOption from '../base/option/SelectionOption';


enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

let UserRoles: UserRole[] = Object.keys(UserRole).map(k => k as UserRole);

let UserRoleMap: { [key in keyof typeof UserRole]: SelectionOption } = {
  GUEST: {
    'name': '游客',
    'value': 'GUEST',
  },
  USER: {
    'name': '普通用户',
    'value': 'USER',
  },
  ADMINISTRATOR: {
    'name': '管理员',
    'value': 'ADMINISTRATOR',
  },

};

let UserRoleList: SelectionOption[] = [];
UserRoles.forEach((type: UserRole, index: number) => {
  UserRoleList.push(UserRoleMap[type]);
});


export { UserRole, UserRoles, UserRoleMap, UserRoleList };




