import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import { UIElementData } from 'photoswipe/dist/types/ui/ui';

/**
 * 图片预览器
 * 支持预览一张图片或者多张图片
 */
export default class ImagePreviewer {
  static downloadElement: UIElementData = {
    name: 'download-button',
    order: 8,
    isButton: true,
    tagName: 'a',

    // SVG with outline
    html: {
      isCustomSVG: true,
      inner:
        '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
      outlineID: 'pswp__icn-download',
    },
    onInit: (el, pswp) => {
      el.setAttribute('download', '');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      pswp.on('change', () => {
        (el as HTMLAnchorElement).href = pswp.currSlide?.data.src!;
      });
    },
  };

  static getImageSize(
    url: string
  ): Promise<{ width?: number; height?: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: undefined, height: undefined });
      img.src = url;
    });
  }

  //展示一张图片
  static showSinglePhoto(url: string) {
    ImagePreviewer.showMultiPhoto([url], 0);
  }

  static async showMultiPhoto(urls: string[], index: number = 0) {
    const sizes = await Promise.all(
      urls.map((url) => ImagePreviewer.getImageSize(url))
    );

    const pswp = new PhotoSwipe({
      dataSource: urls.map((url, index) => ({
        src: url,
        width: sizes[index].width,
        height: sizes[index].height,
      })),
      index,
    });

    pswp.on('uiRegister', () => {
      pswp.ui?.registerElement(ImagePreviewer.downloadElement);
    });
    pswp.init();
  }
}
