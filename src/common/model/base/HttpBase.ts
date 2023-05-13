import HttpUtil from '../../util/HttpUtil';
import SafeUtil from '../../util/SafeUtil';
import qs from 'qs';
import React from 'react';
import ViewBase from './ViewBase';
import Sun from '../global/Sun';
import { WebResultCode } from './WebResultCode';
import MessageBoxUtil from '../../util/MessageBoxUtil';

/**
 * 基类。带有网络请求能力的基类
 * 继承了该类就表示具有了去服务器请求的能力。
 */
export default class HttpBase extends ViewBase {
  static lastLoginErrorTimestamp = 0;

  //是否需要自动刷新State
  needReactComponentUpdate: boolean = true;

  //当前是否正在进行http请求
  loading: boolean = false;

  //请求http的时候是否有错误
  errorMessage: string | null = null;

  //我们认为每个实体都会存放于某个react组件中，当然可以不传入。
  constructor(reactComponent?: React.Component | null) {
    super();

    if (reactComponent) {
      this.reactComponent = reactComponent;
    }
  }

  //更新当前的视图，只在需要更新的情况下才更新。
  updateUI() {
    if (this.needReactComponentUpdate && this.reactComponent) {
      ViewBase.updateComponentUI(this.reactComponent, this);
    }
  }

  /**
   * 转跳到登录页面
   */
  jumpLogin() {
    Sun.navigateTo('/user/login');
  }

  /**
   * 转跳到网站安装页面
   */
  jumpInstall() {
    Sun.navigateTo('/install/index');
  }

  //从一个返回中获取出其错误信息。适配各种错误的类型。
  getErrorMessage(response: any) {
    console.error('getErrorMessage', response);
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
    this.errorMessage = msg;
    return msg;
  }

  //提供全局的默认处理方式，可以自定义错误处理
  defaultErrorHandler(response: any, errorCallback?: any) {
    let msg = this.getErrorMessage(response);

    console.error('请求出错了', typeof msg, msg);

    if (typeof errorCallback === 'function') {
      errorCallback(msg, response);
    } else {
      MessageBoxUtil.error(msg);
    }
  }

  //专门捕捉没有登录这种错误。return true -> 有错误（已经处理掉了）  false -> 没错误 （什么都没干）
  specialErrorHandler(response: any) {
    if (!response || !response.data) {
      return false;
    }

    //1.判断是不是登录错误
    if (response.data['code'] === WebResultCode.LOGIN) {
      //这个问题不能报的太频繁，比如一个页面请求了两个接口，两个接口都报没有登录。
      if (new Date().getTime() - HttpBase.lastLoginErrorTimestamp < 3000) {
        return true;
      } else {
        HttpBase.lastLoginErrorTimestamp = new Date().getTime();
      }

      MessageBoxUtil.error('您尚未登录，请登录后访问！');

      //立即进行登录跳转。
      this.jumpLogin();

      return true;
    }

    return false;
  }

  /**
   * 基类中的http请求会去统一处理错误情况。
   * 1.登录过期
   *
   */
  httpGet(
    url: any,
    params = {},
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    opts?: any
  ) {
    let that = this;

    if (!opts) {
      opts = {};
    }

    that.loading = true;

    //更新react控件的状态
    that.updateUI();

    return HttpUtil.httpGet(
      url,
      params,
      function (response: any) {
        //有可能正常接口回来的数据也是错误的。交给错误处理器处理。
        if (that.specialErrorHandler(response)) {
          SafeUtil.safeCallback(errorCallback)(response);
          return;
        }

        SafeUtil.safeCallback(successCallback)(response);
      },
      function (err: any) {
        let response = err.response;
        console.error('请求出错啦', response);

        //特殊错误情况的通用处理方式
        if (that.specialErrorHandler(response)) {
          return;
        }

        that.defaultErrorHandler(response, errorCallback);
      },
      function (res: any) {
        that.loading = false;

        //更新react控件的状态
        that.updateUI();

        SafeUtil.safeCallback(finallyCallback)(res);
      },
      opts
    );
  }

  /**
   * 基类中纯粹的http get请求。
   *
   */
  httpPureGet(
    url: any,
    params = {},
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    opts?: any
  ) {
    let that = this;

    if (!opts) {
      opts = {};
    }

    return HttpUtil.httpGet(
      url,
      params,
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      function (err: any) {
        SafeUtil.safeCallback(errorCallback)(
          that.getErrorMessage(err.response)
        );
      },
      function (res: any) {
        SafeUtil.safeCallback(finallyCallback)(res);
      },
      opts
    );
  }

  /**
   * 基类中的http请求会去统一处理错误情况。
   * 1.登录过期
   *
   */
  httpPost(
    url: any,
    params = {},
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any,
    opts?: any
  ) {
    let that = this;

    if (!opts) {
      opts = {};
    }

    that.loading = true;

    //更新react控件的状态
    that.updateUI();

    let formData = qs.stringify(params);

    if (!opts['headers']) {
      opts['headers'] = {};
    }
    opts['headers']['Content-Type'] = 'application/x-www-form-urlencoded';

    return HttpUtil.httpPost(
      url,
      formData,
      function (response: any) {
        //有可能正常接口回来的数据也是错误的。交给错误处理器处理。
        if (that.specialErrorHandler(response)) {
          SafeUtil.safeCallback(errorCallback)(response);
          return;
        }

        SafeUtil.safeCallback(successCallback)(response);
      },
      function (err: any) {
        let response = err.response;

        console.error('请求出错啦', response ? response : err);

        //特殊错误情况的通用处理方式
        if (that.specialErrorHandler(response)) {
          return;
        }

        that.defaultErrorHandler(response, errorCallback);
      },
      function (res: any) {
        that.loading = false;

        //更新react控件的状态
        that.updateUI();

        SafeUtil.safeCallback(finallyCallback)(res);
      },
      opts
    );
  }
}
