export default class BrowserUtil {

  //只支持zh和en
  static browserLang() {
    let lang = navigator.language || navigator.userLanguage;//常规浏览器语言和IE浏览器
    lang = lang.substr(0, 2);//截取lang前2位字符
    if (lang === "zh") {
      return "zh"
    } else {
      return "en"
    }
  }

}
