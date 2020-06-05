export default class SafeUtil {

  //安全的调用某个函数，函数不存在，创建一个空函数。
  static safeCallback(callback: any) {
    if (typeof callback === "function") {
      return callback
    } else {
      return function () {
      }
    }
  }


  //空函数
  static noop = () => {
  };


  //停止事件冒泡
  static stopPropagation(e: any) {
    if (!e) {
      return
    }

    if (e.stopPropagation) {
      //系统的点击事件
      e.stopPropagation()
    } else if (e.domEvent && e.domEvent.stopPropagation) {
      //antd的事件
      e.domEvent.stopPropagation()

    }
  }

}
