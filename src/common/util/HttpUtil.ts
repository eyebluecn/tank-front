import axios, { AxiosRequestConfig } from 'axios';
import SafeUtil from './SafeUtil';

//http请求全部收口在这个工具类中，可以快速切换http框架。
export default class HttpUtil {
  static httpGet(
    url: any,
    params = {},
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    opts?: any
  ) {
    axios
      .get(url, {
        params: params,
      })
      .then(function (response) {
        SafeUtil.safeCallback(successCallback)(response);
      })
      .catch(function (error) {
        SafeUtil.safeCallback(errorCallback)(error);
      })
      .finally(function () {
        SafeUtil.safeCallback(finallyCallback)();
      });
  }

  static httpPost(
    url: any,
    params = {},
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    opts?: any
  ) {
    return axios
      .post(url, params, opts)
      .then(function (response) {
        SafeUtil.safeCallback(successCallback)(response);
      })
      .catch(function (error) {
        SafeUtil.safeCallback(errorCallback)(error);
      })
      .finally(function () {
        SafeUtil.safeCallback(finallyCallback)();
      });
  }

  /**
   * 上传文件的请求
   */
  static httpPostFile(
    url: string,
    formData: FormData,
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    processCallback?: (progressEvent: any) => void,
    opts?: any
  ) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      cancelToken: opts ? opts.cancelToken : '',
      onUploadProgress: processCallback,
    };

    axios
      .post(url, formData, config)
      .then(function (response) {
        SafeUtil.safeCallback(successCallback)(response);
      })
      .catch(function (error) {
        SafeUtil.safeCallback(errorCallback)(error);
      })
      .finally(function () {
        SafeUtil.safeCallback(finallyCallback)();
      });
  }
}
