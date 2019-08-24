let ShareType = {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY',
  MIX: 'MIX'
}

let ShareTypeMap = {
  FILE: {
    name: '文件',
    value: 'FILE'
  },
  DIRECTORY: {
    name: '文件夹',
    value: 'DIRECTORY'
  },
  MIX: {
    name: '混合',
    value: 'MIX'
  }
}


let ShareTypeList = [];
for (let key in ShareTypeMap) {
  if (ShareTypeMap.hasOwnProperty(key)) {
    ShareTypeList.push(ShareTypeMap[key]);
  }
}

export {ShareType, ShareTypeMap, ShareTypeList}
