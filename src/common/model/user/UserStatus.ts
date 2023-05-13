import ColorSelectionOption from '../base/option/ColorSelectionOption';
import Color from '../base/option/Color';
import Lang from '../global/Lang';

enum UserStatus {
  OK = 'OK',
  DISABLED = 'DISABLED',
}

let UserStatuss: UserStatus[] = Object.keys(UserStatus).map(
  (k) => k as UserStatus
);

let UserStatusMap: { [key in keyof typeof UserStatus]: ColorSelectionOption } =
  {
    OK: {
      name: Lang.t('user.statusActive'),
      value: 'OK',
      color: Color.SUCCESS,
    },
    DISABLED: {
      name: Lang.t('user.statusDisabled'),
      value: 'DISABLED',
      color: Color.DANGER,
    },
  };

let UserStatusList: ColorSelectionOption[] = [];
UserStatuss.forEach((type: UserStatus, index: number) => {
  UserStatusList.push(UserStatusMap[type]);
});

export { UserStatus, UserStatuss, UserStatusMap, UserStatusList };
