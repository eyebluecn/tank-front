/**
 * 全局性的对象，主要和实体类相关的
 * 这个类只包含Base的子类，比如User, Preference.
 * 和Sun形成姊妹篇
 */
import User from "../user/User";
import Preference from "../preference/Preference";
import BrowserUtil from "../../util/BrowserUtil";
import Cookies from "js-cookie";

export default class Moon {

  //全局具有唯一的用户，即当前登录的用户.
  user: User = new User()

  //全局唯一的偏好设置
  preference: Preference = new Preference()

  //当前使用的语言，默认中文
  lang: string = "zh"

  //全局的一个store对象
  private static singleton: Moon | null = null

  //使用懒加载模式。
  static getSingleton(): Moon {
    if (Moon.singleton == null) {
      Moon.singleton = new Moon();

      //读取默认的语言
      let lang = BrowserUtil.browserLang()
      let localLang = Cookies.get("_lang");
      if (localLang === "zh" || localLang === "en") {
        lang = localLang
      }
      Moon.singleton.lang = lang
      console.log("当前浏览器默认语言是：", lang)

    }

    return Moon.singleton
  }


}
