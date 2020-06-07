import SelectionOption from "../base/option/SelectionOption";


enum WebResultCode {
  OK = "OK",
  BAD_REQUEST = "BAD_REQUEST",
  LOGIN = "LOGIN",
  NOT_INSTALLED = "NOT_INSTALLED",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

let WebResultCodes: WebResultCode[] = Object.keys(WebResultCode).map(k => k as WebResultCode)

let WebResultCodeMap: { [key in keyof typeof WebResultCode]: SelectionOption } = {
  OK: {
    "name": "成功",
    "value": "OK",
  },
  BAD_REQUEST: {
    "name": "请求错误",
    "value": "BAD_REQUEST",
  },
  LOGIN: {
    "name": "未登录",
    "value": "LOGIN",
  },
  NOT_INSTALLED: {
    "name": "未安装",
    "value": "NOT_INSTALLED",
  },
  SERVER: {
    "name": "服务器出错",
    "value": "SERVER",
  },
  UNKNOWN: {
    "name": "未知错误",
    "value": "UNKNOWN",
  },
}

let WebResultCodeList: SelectionOption[] = []
WebResultCodes.forEach((type: WebResultCode, index: number) => {
  WebResultCodeList.push(WebResultCodeMap[type])
})


export {WebResultCode, WebResultCodes, WebResultCodeMap, WebResultCodeList}




