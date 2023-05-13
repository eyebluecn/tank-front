/**
 * 全局性的对象，主要和整个框架相关的
 * 这个类不包含Base的子类，比如User, Preference.
 * 和Moon形成姊妹篇
 */

export default class Sun {
  //全局的一个store对象
  static singleton: Sun | null = null;

  //持有整个网站最外层的frame，方便我们刷新整个页面。
  frameComponent: any = null;

  //持有全局的react-router对象，方便我们在非jsx环境中控制路由跳转
  reactRouter: any = null;

  //全局布局样式，是否展示出左边的菜单.
  showDrawer: boolean = false;

  //全局mobile标识
  isMobile: boolean = /Mobile|iP(hone|od|ad)|iOS|Android|BlackBerry/i.test(
    window.navigator.userAgent
  );

  //由于这个类采用单例模式，因此所有属性都是独一份的。
  constructor() {}

  //使用懒加载模式。
  static getSingleton(): Sun {
    if (Sun.singleton == null) {
      Sun.singleton = new Sun();
    }
    return Sun.singleton;
  }

  //*******************和路由相关的方法 开始 *******************//

  /**
   * 跳转到某个页面去
   */
  static navigateTo(path: any) {
    if (Sun.getSingleton().reactRouter) {
      Sun.getSingleton().reactRouter.push(path);
    } else {
      console.error('全局的 reactRouter 未定义，请检查代码！');
    }
  }

  /**
   * 跳转到某个页面去，带query
   * route: {path: '', query: {}}
   */
  static navigateQueryTo(route: any) {
    let path = route.path;
    if (Object.keys(route.query).length) {
      const params = new URLSearchParams(route.query).toString();
      path += `?${params}`;
    }
    Sun.navigateTo(path);
  }

  /**
   * 回到上一页
   */
  static navigateBack() {
    if (Sun.getSingleton().reactRouter) {
      Sun.getSingleton().reactRouter.go(-1);
    } else {
      console.error('全局的 reactRouter 未定义，请检查代码！');
    }
  }

  //******************* 和路由相关的方法 结束 *******************//

  //*******************和全局视图相关的方法 开始 *******************//
  /**
   * 刷新主框架内容
   */
  static updateFrame() {
    if (Sun.getSingleton().frameComponent) {
      Sun.getSingleton().frameComponent.updateUI();
    } else {
      console.error('全局的 frameComponent 未定义，请检查代码！');
    }
  }

  //******************* 和全局视图相关的方法 结束 *******************//
}
