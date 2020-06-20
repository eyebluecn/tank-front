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
    'name': "user.roleGuest",
    'value': 'GUEST',
    'color': Color.WARNING,
  },
  USER: {
    'name': "user.roleUser",
    'value': 'USER',
    'color': Color.PRIMARY,
  },
  ADMINISTRATOR: {
    'name': "user.roleAdministrator",
    'value': 'ADMINISTRATOR',
    'color': Color.DANGER,
  },

};

let UserRoleList: ColorSelectionOption[] = [];
UserRoles.forEach((type: UserRole, index: number) => {
  UserRoleList.push(UserRoleMap[type]);
});


export {UserRole, UserRoles, UserRoleMap, UserRoleList};




