/**
 * 预览配置
 * 支持自定义不同的文件预览类型
 */
import Base from '../../base/Base';
import PreviewEngine from './PreviewEngine';

/**
 * 预览配置
 */
export default class PreviewConfig extends Base {
  /**
   * 预览引擎
   */
  previewEngines: PreviewEngine[] = [];

  constructor() {
    super();
  }

  assign(obj: any) {
    super.assign(obj);

    this.assignList('previewEngines', PreviewEngine);
  }

  getForm(): any {
    let forms = this.previewEngines.map(
      (item: PreviewEngine, index: number) => {
        return item.getForm();
      }
    );

    return {
      previewEngines: forms,
    };
  }
}
