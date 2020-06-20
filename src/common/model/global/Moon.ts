/**
 * 全局性的对象，主要和实体类相关的
 * 这个类只包含Base的子类，比如User, Preference.
 * 和Sun形成姊妹篇
 */
import User from "../user/User";
import Preference from "../preference/Preference";
import BrowserUtil from "../../util/BrowserUtil";
import Cookies from "js-cookie";
import LangEn from "./i18n/LangEn";
import LangZh from "./i18n/LangZh";


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

  //快捷获取一种语言对应的文字。
  static t(key: string, ...params: any[]): string {

    let json: { [key: string]: any } = LangEn

    let lang = Moon.getSingleton().lang
    if (lang == "zh") {
      json = LangZh
    }

    let keyParts: string[] = key.split(".")
    let jsonBody: any = json
    for (let i = 0; i < keyParts.length; i++) {
      let part: string = keyParts[i]
      jsonBody = jsonBody[part]
      if (jsonBody === undefined || jsonBody === null) {
        //找不到key对应的内容，直接返回key
        return key
      }
    }

    //到这里已经找到了
    if (typeof jsonBody !== "string") {
      return key
    }

    //依次将参数写入进去。
    if (params && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        let param = params[i]
        jsonBody = jsonBody.replace("{}", param)
      }
    }

    return jsonBody
  }

}
