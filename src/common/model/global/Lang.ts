/**
 * 全局性的国际化
 */
import BrowserUtil from '../../util/BrowserUtil';
import LangEn from './i18n/LangEn';
import LangZh from './i18n/LangZh';

export default class Lang {
  //当前使用的语言，默认中文
  lang: string = 'zh';

  //全局的一个store对象
  private static singleton: Lang | null = null;

  //使用懒加载模式。
  static getSingleton(): Lang {
    if (Lang.singleton == null) {
      Lang.singleton = new Lang();

      //读取默认的语言
      let lang = BrowserUtil.browserLang();
      let localLang = localStorage.getItem('_lang');
      if (localLang === 'zh' || localLang === 'en') {
        lang = localLang;
      }
      Lang.singleton.lang = lang;
      console.info('current lang: ', lang);
    }

    return Lang.singleton;
  }

  //快捷获取一种语言对应的文字。
  static t(key: string, ...params: any[]): string {
    let json: { [key: string]: any } = LangEn;

    let lang = Lang.getSingleton().lang;
    if (lang == 'zh') {
      json = LangZh;
    }

    let keyParts: string[] = key.split('.');
    let jsonBody: any = json;
    for (let i = 0; i < keyParts.length; i++) {
      let part: string = keyParts[i];
      jsonBody = jsonBody[part];
      if (jsonBody === undefined || jsonBody === null) {
        //找不到key对应的内容，直接返回key
        return key;
      }
    }

    //到这里已经找到了
    if (typeof jsonBody !== 'string') {
      return key;
    }

    //依次将参数写入进去。
    if (params && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        let param = params[i];
        jsonBody = jsonBody.replace('{}', param);
      }
    }

    return jsonBody;
  }
}
