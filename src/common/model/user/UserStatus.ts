import ColorSelectionOption from '../base/option/ColorSelectionOption';
import Color from "../base/option/Color";


enum UserStatus {
  OK = 'OK',
  DISABLED = 'DISABLED'
}

let UserStatuss: UserStatus[] = Object.keys(UserStatus).map(k => k as UserStatus);

let UserStatusMap: { [key in keyof typeof UserStatus]: ColorSelectionOption } = {
  OK: {
    'name': '正常',
    'value': 'OK',
    'color': Color.SUCCESS,
  },
  DISABLED: {
    'name': '禁用',
    'value': 'DISABLED',
    'color': Color.DANGER,
  },
};

let UserStatusList: ColorSelectionOption[] = [];
UserStatuss.forEach((type: UserStatus, index: number) => {
  UserStatusList.push(UserStatusMap[type]);
});


export {UserStatus, UserStatuss, UserStatusMap, UserStatusList};




