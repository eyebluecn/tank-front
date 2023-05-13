/**
 * 预览配置
 * 支持自定义不同的文件预览类型
 */
import Base from '../../base/Base';
import MimeUtil from '../../../util/MimeUtil';

export default class PreviewEngine extends Base {
  /**
   * 此预览引擎的url
   * {originUrl} 文件原始的url地址。eg: https://tanker.eyeblue.cn/api/alien/download/2a0ceee1-744c-4c82-4215-69c382597a50/abstract-free-photo-2210x1473.jpg
   * {url} 对于公有文件publicUrl=originUrl，对于私有文件publicUrl是originUrl带上downloadToken。 eg: https://tanker.eyeblue.cn/api/alien/download/2a0ceee1-744c-4c82-4215-69c382597a50/abstract-free-photo-2210x1473.jpg?downloadTokenUuid=6bdba52f-af6b-49ae-5a5d-fd80bfb01d3b
   * {b64Url} 文件原始地址
   */
  url: string = '';

  /**
   * 此预览引擎支持的文件后缀名。
   * 星好*表示匹配所有的后缀名。
   * 逗号分隔，不带.  例如： xls,doc,ppt,xlsx,docx,pptx
   */
  extensions: string = '';

  /**
   * 本站预览，新标签打开
   */
  previewInSite: boolean = true;

  constructor() {
    super();
  }

  getForm(): any {
    return {
      url: this.url,
      extensions: this.extensions,
      previewInSite: this.previewInSite,
    };
  }

  //提供几个默认的预览引擎。
  static defaultPreviewEngines(): PreviewEngine[] {
    let defaultEngines: PreviewEngine[] = [];

    //添加office默认预览引擎，使用微软开放接口
    let officeEngine: PreviewEngine = new PreviewEngine();
    officeEngine.url =
      'https://view.officeapps.live.com/op/embed.aspx?src={url}';
    officeEngine.extensions = 'doc,ppt,xls,docx,pptx,xlsx';
    officeEngine.previewInSite = true;
    defaultEngines.push(officeEngine);

    //添加全局预览引擎，使用浏览器预览能力。
    let globalEngine: PreviewEngine = new PreviewEngine();
    globalEngine.url = '{originUrl}';
    globalEngine.extensions = '*';
    globalEngine.previewInSite = true;
    defaultEngines.push(globalEngine);

    return defaultEngines;
  }

  //对于某个文件，是否能够预览
  canPreview(fileName: string): boolean {
    let extension: string = MimeUtil.getExtensionWithoutDot(fileName);
    if (!extension) {
      return false;
    }

    let canHandle = false;
    if (this.extensions === '*') {
      canHandle = true;
    } else {
      let parts: string[] = this.extensions.split(',');
      for (let part of parts) {
        if (
          extension === part.toLowerCase() ||
          '.' + extension === part.toLowerCase()
        ) {
          canHandle = true;
          break;
        }
      }
    }

    return canHandle;
  }
}
