import SelectionOption from '../../base/option/SelectionOption';
import Lang from '../../global/Lang';

enum ScanScopeType {
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
}

const ScanScopeTypes: ScanScopeType[] = Object.keys(ScanScopeType).map(
  (k) => k as ScanScopeType
);

const ScanScopeTypeMap: {
  [key in keyof typeof ScanScopeType]: SelectionOption;
} = {
  ALL: {
    name: Lang.t('space.allSpaces'),
    value: 'ALL',
  },
  CUSTOM: {
    name: Lang.t('space.partialSpaces'),
    value: 'CUSTOM',
  },
};

let ScanScopeTypeList: SelectionOption[] = [];
ScanScopeTypes.forEach((type: ScanScopeType) => {
  ScanScopeTypeList.push(ScanScopeTypeMap[type]);
});

export { ScanScopeType, ScanScopeTypeMap, ScanScopeTypeList };
