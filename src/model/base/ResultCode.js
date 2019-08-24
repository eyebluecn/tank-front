let ResultCode = {

  OK: "OK",
  BAD_REQUEST: "BAD_REQUEST",
  NEED_SHARE_CODE: "NEED_SHARE_CODE",
  SHARE_CODE_ERROR: "SHARE_CODE_ERROR",
  LOGIN: "LOGIN",
  USER_DISABLED: "USER_DISABLED",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  RANGE_NOT_SATISFIABLE: "RANGE_NOT_SATISFIABLE",
  NOT_INSTALLED: "NOT_INSTALLED",
  SERVER: "SERVER",
  UNKNOWN: "UNKNOWN",

}

let ResultCodeMap = {

  OK: {
    name: "成功",
    value: "OK"
  },
  BAD_REQUEST: {
    name: "请求不合法",
    value: "BAD_REQUEST"
  },
  NEED_SHARE_CODE: {
    name: "提取码必填",
    value: "NEED_SHARE_CODE"
  },
  SHARE_CODE_ERROR: {
    name: "提取码错误",
    value: "SHARE_CODE_ERROR"
  },
  LOGIN: {
    name: "未登录，禁止访问",
    value: "LOGIN"
  },
  USER_DISABLED: {
    name: "用户被禁用",
    value: "LOGIN"
  },
  UNAUTHORIZED: {
    name: "没有权限，禁止访问",
    value: "UNAUTHORIZED"
  },
  NOT_FOUND: {
    name: "内容不存在",
    value: "NOT_FOUND"
  },
  RANGE_NOT_SATISFIABLE: {
    name: "范围错误",
    value: "RANGE_NOT_SATISFIABLE"
  },
  NOT_INSTALLED: {
    name: "尚未安装",
    value: "NOT_INSTALLED"
  },
  SERVER: {
    name: "服务器未知错误",
    value: "SERVER"
  },

  UNKNOWN: {
    name: "服务器未知错误",
    value: "UNKNOWN"
  }


}

let ResultCodeList = [];
for (let key in ResultCodeMap) {
  if (ResultCodeMap.hasOwnProperty(key)) {
    ResultCodeList.push(ResultCodeMap[key]);
  }
}

export {ResultCode, ResultCodeMap, ResultCodeList};
