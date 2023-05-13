import SelectionOption from '../base/option/SelectionOption';

enum ShareType {
  FILE = 'FILE',
  DIRECTORY = 'DIRECTORY',
  MIX = 'MIX',
}

const ShareTypes: ShareType[] = Object.keys(ShareType).map(
  (k) => k as ShareType
);

const ShareTypeMap: { [key in keyof typeof ShareType]: SelectionOption } = {
  FILE: {
    name: '文件',
    value: 'FILE',
  },
  DIRECTORY: {
    name: '文件夹',
    value: 'DIRECTORY',
  },
  MIX: {
    name: '混合',
    value: 'MIX',
  },
};

let ShareTypeList: SelectionOption[] = [];
ShareTypes.forEach((type: ShareType) => {
  ShareTypeList.push(ShareTypeMap[type]);
});

export { ShareType, ShareTypeMap, ShareTypeList };
