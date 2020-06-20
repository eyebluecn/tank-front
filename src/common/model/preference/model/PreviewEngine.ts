/**
 * 预览配置
 * 支持自定义不同的文件预览类型
 */
import Base from "../../base/Base";


export default class PreviewEngine extends Base {

  /**
   * 此预览引擎的url
   */
  url: string = ""

  /**
   * 此预览引擎支持的文件后缀名。
   * 逗号分隔，不带.  例如： xls,doc,ppt,xlsx,docx,pptx
   */
  extensions: string = ""


  constructor() {
    super()
  }

  getForm(): any {
    return {
      url: this.url,
      extensions: this.extensions,
    };
  }

}




