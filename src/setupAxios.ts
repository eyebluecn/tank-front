import { default as _axios } from 'axios';
import { WebResultCode } from './common/model/base/WebResultCode';
import { message } from 'antd';

export const axios = _axios.create({
  baseURL: '/api',
});

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

//专门捕捉没有登录这种错误。return true -> 有错误（已经处理掉了）  false -> 没错误 （什么都没干）
const specialErrorHandler = (response: any) => {
  if (!response || !response.data) {
    return false;
  }

  //1.判断是不是登录错误
  if (response.data['code'] === WebResultCode.LOGIN) {
    message.error('您尚未登录，请登录后访问！');
    //立即进行登录跳转。
    window.location.href = '/user/login';
    return true;
  }

  return false;
};

//从一个返回中获取出其错误信息。适配各种错误的类型。
const getErrorMessage = (response: any) => {
  let msg = '服务器出错，请稍后再试!';

  if (!response) {
    msg = '出错啦，请稍后重试！';
  } else if (typeof response === 'string') {
    msg = response;
  } else if (response['msg']) {
    msg = response['msg'];
  } else if (response['message']) {
    msg = response['message'];
  } else {
    let temp = response['data'];
    if (temp !== null && typeof temp === 'object') {
      if (temp['message']) {
        msg = temp['message'];
      } else if (temp['msg']) {
        msg = temp['msg'];
      } else {
        if (temp['error'] && temp['error']['message']) {
          msg = temp['error']['message'];
        }
      }
    }
  }
  return msg;
};

axios.interceptors.response.use(
  (response: any) => {
    if (specialErrorHandler(response)) return;
    return response.data.data;
  },
  (err: any) => {
    const response = err.response;
    if (specialErrorHandler(response)) return;
    const msg = getErrorMessage(response);
    if (msg) {
      message.error(msg);
    }
    return Promise.reject(err);
  },
);
