import SafeUtil from './SafeUtil';

export default class ClipboardUtil {
  /**
   * 复制一段文字到粘贴板。
   *
   */
  static copy(
    text: string,
    successCallback: () => void,
    errorCallback?: () => void
  ) {
    let className = 'clipboard-textarea-util';

    let textAreaElement: HTMLTextAreaElement | null = document.querySelector(
      '.' + className
    );

    if (!textAreaElement) {
      textAreaElement = document.createElement('textarea');
      textAreaElement.className = className;
      textAreaElement.style.cssText =
        'position:fixed;opacity:0;z-index:0;width:5px;height:5px;';
      document.body.appendChild(textAreaElement);
    }

    textAreaElement.value = text;
    textAreaElement.select();

    try {
      let successful = document.execCommand('copy');
      if (successful) {
        successCallback();
      } else {
        SafeUtil.safeCallback(errorCallback)();
      }
    } catch (err) {
      console.error('复制失败', err);
      SafeUtil.safeCallback(errorCallback)();
    }
  }
}
