import SelectionOption from '../base/option/SelectionOption';


enum UserStatus {
  OK = 'OK',
  DISABLED = 'DISABLED'
}

let UserStatuss: UserStatus[] = Object.keys(UserStatus).map(k => k as UserStatus);

let UserStatusMap: { [key in keyof typeof UserStatus]: SelectionOption } = {
  OK: {
    'name': '正常',
    'value': 'OK',
  },
  DISABLED: {
    'name': '禁用',
    'value': 'DISABLED',
  },
};

let UserStatusList: SelectionOption[] = [];
UserStatuss.forEach((type: UserStatus, index: number) => {
  UserStatusList.push(UserStatusMap[type]);
});


export {UserStatus, UserStatuss, UserStatusMap, UserStatusList};




