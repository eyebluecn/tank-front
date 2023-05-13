import SelectionOption from '../../base/option/SelectionOption';
import Lang from '../../global/Lang';

enum ScanCronType {
  TEN_SECONDS = 'TEN_SECONDS',
  THIRTY_SECONDS = 'THIRTY_SECONDS',
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  CUSTOM = 'CUSTOM',
}

const ScanCronTypes: ScanCronType[] = Object.keys(ScanCronType).map(
  (k) => k as ScanCronType
);

const ScanCronTypeMap: { [key in keyof typeof ScanCronType]: SelectionOption } =
  {
    TEN_SECONDS: {
      name: Lang.t('preference.scanPerTenSeconds'),
      value: '@every 10s',
    },
    THIRTY_SECONDS: {
      name: Lang.t('preference.scanPerThirtySeconds'),
      value: '@every 30s',
    },
    MINUTE: {
      name: Lang.t('preference.scanPerMinute'),
      value: '@every 1m',
    },
    HOUR: {
      name: Lang.t('preference.scanPerHour'),
      value: '0 * * * *',
    },
    CUSTOM: {
      name: Lang.t('preference.scanCustom'),
      value: 'CUSTOM',
    },
  };

const ScanCronTypeList: SelectionOption[] = [];
ScanCronTypes.forEach((type: ScanCronType) => {
  ScanCronTypeList.push(ScanCronTypeMap[type]);
});

const ScanCronTypeValueList: string[] = [];
ScanCronTypes.forEach((type: ScanCronType) => {
  ScanCronTypeValueList.push(ScanCronTypeMap[type].value);
});

export {
  ScanCronType,
  ScanCronTypeMap,
  ScanCronTypeList,
  ScanCronTypeValueList,
};
