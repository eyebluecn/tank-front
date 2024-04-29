import MimeUtil from '../../../common/util/MimeUtil';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import Moon from '../../../common/model/global/Moon';
import PreviewEngine from '../../../common/model/preference/model/PreviewEngine';
import Matter from '../../../common/model/matter/Matter';
import BrowserPreviewer from './BrowserPreviewer';
import DownloadToken from '../../../common/model/download/token/DownloadToken';

/**
 * 文件预览帮助器
 */
export default class PreviewerHelper {
  static b64EncodeUnicode(str: string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        // function toSolidBytes(match, p1) {
        (match, p1) => {
          // console.debug('match: ' + match);
          return String.fromCharCode(('0x' + p1) as any);
        }
      )
    );
  }

  static b64DecodeUnicode(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  /**
   * 准备好一个文件url
   */
  static prepareMatterUrl(
    matter: Matter,
    needTokenUrl: boolean,
    successCallback: (matterUrl: string) => void
  ) {
    if (needTokenUrl) {
      //获取一个临时的下载token.
      let downloadToken = new DownloadToken();
      downloadToken.httpFetchDownloadToken(matter.uuid!, function () {
        let matterUrl = matter.getPreviewUrl(downloadToken.uuid!);

        successCallback(matterUrl);
      });
    } else {
      successCallback(matter.getPreviewUrl());
    }
  }

  /**
   * 对一个文件进行预览，自动选择预览引擎
   * @param matter 文件
   * @param previewUrl 文件预览url，分享文件预览需从外部把previewUrl传入
   */
  static preview(matter: Matter, previewUrl?: string) {
    let fileName: string = matter.name;
    let extension: string = MimeUtil.getExtensionWithoutDot(fileName);
    if (!extension) {
      MessageBoxUtil.warning(fileName + ' 没有后缀名，无法预览');
      return;
    }

    //去选择预览引擎。
    let previewConfig = Moon.getSingleton().preference.previewConfig;

    let previewEngine: PreviewEngine | null = null;

    //寻找用户自定义的预览引擎
    for (let engine of previewConfig.previewEngines) {
      if (engine.canPreview(fileName)) {
        previewEngine = engine;
        break;
      }
    }

    //寻找官方默认的预览引擎
    if (previewEngine === null) {
      let defaultEngines = PreviewEngine.defaultPreviewEngines();
      for (let engine of defaultEngines) {
        if (engine.canPreview(fileName)) {
          previewEngine = engine;
          break;
        }
      }
    }

    if (previewEngine === null) {
      MessageBoxUtil.warning(fileName + ' 无法预览');
    } else {
      let targetUrl = previewEngine.url;

      const engine: PreviewEngine = previewEngine;

      if (previewUrl) {
        targetUrl = targetUrl.replace('{originUrl}', previewUrl);
        targetUrl = targetUrl.replace('{b64Url}', encodeURIComponent(PreviewerHelper.b64EncodeUnicode(previewUrl)));
        targetUrl = targetUrl.replace('{url}', encodeURIComponent(previewUrl));
        if (engine.previewInSite) {
          BrowserPreviewer.show(fileName, targetUrl, matter.size);
        } else {
          window.open(targetUrl);
        }
      } else {
        const needToken =
          matter.privacy &&
          (targetUrl.indexOf('{url}') !== -1 ||
            targetUrl.indexOf('{b64Url}') !== -1);

        PreviewerHelper.prepareMatterUrl(matter, needToken, function (url) {
          targetUrl = targetUrl.replace('{originUrl}', matter.getPreviewUrl());
          targetUrl = targetUrl.replace(
            '{b64Url}',
            encodeURIComponent(PreviewerHelper.b64EncodeUnicode(url))
          );
          targetUrl = targetUrl.replace('{url}', encodeURIComponent(url));
          if (engine.previewInSite) {
            BrowserPreviewer.show(fileName, targetUrl, matter.size);
          } else {
            window.open(targetUrl);
          }
        });
      }
    }
  }
}
