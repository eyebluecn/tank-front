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
   * @param url 请求地址
   * @param formData 表单数据
   * @param successCallback 成功回调
   * @param errorCallback 失败回调
   * @param finallyCallback 最终回调
   * @param processCallback 进度回调
   * @param opts 可选配置，支持 cancelToken 和 timeout
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
      cancelToken: opts?.cancelToken || undefined,
      onUploadProgress: processCallback,
      // Support custom timeout, default to 10 minutes for large file uploads
      timeout: opts?.timeout || 10 * 60 * 1000,
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
