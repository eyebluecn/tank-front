import ColorSelectionOption from "../base/option/ColorSelectionOption";
import Color from "../base/option/Color";


enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

let UserRoles: UserRole[] = Object.keys(UserRole).map(k => k as UserRole);

let UserRoleMap: { [key in keyof typeof UserRole]: ColorSelectionOption } = {
  GUEST: {
    'name': '游客',
    'value': 'GUEST',
    'color': Color.WARNING,
  },
  USER: {
    'name': '普通用户',
    'value': 'USER',
    'color': Color.PRIMARY,
  },
  ADMINISTRATOR: {
    'name': '管理员',
    'value': 'ADMINISTRATOR',
    'color': Color.DANGER,
  },

};

let UserRoleList: ColorSelectionOption[] = [];
UserRoles.forEach((type: UserRole, index: number) => {
  UserRoleList.push(UserRoleMap[type]);
});


export {UserRole, UserRoles, UserRoleMap, UserRoleList};




