let Platform = {
  ANDROID: 'ANDROID',
  IOS: 'IOS',
  WEB: 'WEB'
}

let PlatformMap = {
  ANDROID: {
    name: 'android端',
    value: 'ANDROID',
    icon: 'fa-android'
  },
  IOS: {
    name: 'ios端',
    value: 'IOS',
    icon: 'fa-apple'
  },
  WEB: {
    name: 'web端',
    value: 'WEB',
    icon: 'fa-edge'
  }
}

let PlatformList = []
for (let key in PlatformMap) {
  if (PlatformMap.hasOwnProperty(key)) {
    PlatformList.push(PlatformMap[key])
  }
}

export { Platform, PlatformMap, PlatformList }
