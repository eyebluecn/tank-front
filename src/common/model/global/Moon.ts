/**
 * 全局性的对象，主要和实体类相关的
 * 这个类只包含Base的子类，比如User, Preference.
 * 和Sun形成姊妹篇
 */
import User from "../user/User";

export default class Moon {

  //全局具有唯一的用户，即当前登录的用户.
  user: User = new User()

  //全局的一个store对象
  private static singleton: Moon | null = null

  //使用懒加载模式。
  static getSingleton(): Moon {
    if (Moon.singleton == null) {
      Moon.singleton = new Moon();
    }

    return Moon.singleton
  }


}
