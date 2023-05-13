//应用的占位图片，到处都要用到。 生成网址：http://png-pixel.com/
//rgb(240,240,240)
import NumberUtil from './NumberUtil';
import MimeUtil from './MimeUtil';

export default class ImageUtil {
  static IMAGE_PLACEHOLDER_10_10 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mP88J8BAzAOZUEAoc4TYb5Mv7IAAAAASUVORK5CYII=';
  static IMAGE_PLACEHOLDER_20_7 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAHCAQAAACiwqWzAAAAEklEQVR42mP88J+BKMA4IhUCAJ1VDZFobOQaAAAAAElFTkSuQmCC';
  static IMAGE_PLACEHOLDER_4_3 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAQAAAAe/WZNAAAAEElEQVR42mP88J8BDBgxGABf8QXRk11CBwAAAABJRU5ErkJggg==';
  static IMAGE_PLACEHOLDER_16_9 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAQAAACRI2S5AAAAEklEQVR42mP88J8BL2AcVQAGACSgEXHKPyH/AAAAAElFTkSuQmCC';
  static IMAGE_PLACEHOLDER_2_1 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAQAAAAeXLZtAAAAE0lEQVR42mP88J+BKMA4qpC+CgH2ThNhpeSxLAAAAABJRU5ErkJggg==';

  /**
   * 统一处理图片url。
   * @param url 原图片路径
   * @param origin 是否使用原图，一般在查看图片详情的时候使用
   * @param width 如果origin=false 裁剪的宽度
   * @param height 如果origin=false 裁剪的高度
   * @returns
   */
  static handleImageUrl(
    url: string | null = null,
    origin: boolean = false,
    width: number = 200,
    height: number = 200
  ) {
    if (url) {
      if (origin) {
        return url;
      } else {
        //目前支持这几种格式的处理。 jpg jpeg png tif tiff bmp gif
        let supportExtensions = [
          '.jpg',
          '.jpeg',
          '.png',
          '.tif',
          '.tiff',
          '.bmp',
          '.gif',
        ];
        let extension = MimeUtil.getExtension(url);
        if (supportExtensions.indexOf(extension) === -1) {
          return url;
        } else {
          return url + '?ir=fill_' + width + '_' + height;
        }
      }
    } else {
      if (NumberUtil.fractionEqual(1, 1, width, height)) {
        return ImageUtil.IMAGE_PLACEHOLDER_10_10;
      } else if (NumberUtil.fractionEqual(20, 7, width, height)) {
        return ImageUtil.IMAGE_PLACEHOLDER_20_7;
      } else if (NumberUtil.fractionEqual(4, 3, width, height)) {
        return ImageUtil.IMAGE_PLACEHOLDER_4_3;
      } else if (NumberUtil.fractionEqual(16, 9, width, height)) {
        return ImageUtil.IMAGE_PLACEHOLDER_16_9;
      } else if (NumberUtil.fractionEqual(2, 1, width, height)) {
        return ImageUtil.IMAGE_PLACEHOLDER_2_1;
      } else {
        return ImageUtil.IMAGE_PLACEHOLDER_10_10;
      }
    }
  }
}
