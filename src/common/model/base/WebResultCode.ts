import SelectionOption from "../base/option/SelectionOption";


enum WebResultCode {
  SUCCESS = "SUCCESS",
  BAD_REQUEST = "BAD_REQUEST",
  LOGIN = "LOGIN",
  ERROR = "ERROR",
}

let WebResultCodes: WebResultCode[] = Object.keys(WebResultCode).map(k => k as WebResultCode)

let WebResultCodeMap: { [key in keyof typeof WebResultCode]: SelectionOption } = {
  SUCCESS: {
    "name": "成功",
    "value": "SUCCESS",
  },
  BAD_REQUEST: {
    "name": "请求错误",
    "value": "BAD_REQUEST",
  },
  LOGIN: {
    "name": "未登录",
    "value": "LOGIN",
  },
  ERROR: {
    "name": "未知错误",
    "value": "ERROR",
  },
}

let WebResultCodeList: SelectionOption[] = []
WebResultCodes.forEach((type: WebResultCode, index: number) => {
  WebResultCodeList.push(WebResultCodeMap[type])
})


export {WebResultCode, WebResultCodes, WebResultCodeMap, WebResultCodeList}




