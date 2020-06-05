/**
 * 全局性的对象，主要和整个框架相关的
 * 这个类不包含Base的子类，比如User, Preference.
 * 和Moon形成姊妹篇
 */
export default class Sun {

  //全局的一个store对象
  static singleton: Sun | null = null

  //持有全局的react-router对象，方便我们在非jsx环境中控制路由跳转
  reactRouter: any = null;

  //由于这个类采用单例模式，因此所有属性都是独一份的。
  constructor() {

  }

  //使用懒加载模式。
  static getSingleton(): Sun {
    if (Sun.singleton == null) {
      Sun.singleton = new Sun();
    }
    return Sun.singleton
  }


  ////////////和路由相关的方法 开始////////////

  /**
   * 跳转到某个页面去
   */
  static navigateTo(path: any) {
    if (Sun.getSingleton().reactRouter) {
      Sun.getSingleton().reactRouter.push(path)
    } else {
      console.error("全局的 reactRouter 未定义，请检查代码！")
    }
  }

  ////////////和路由相关的方法 结束////////////

}
