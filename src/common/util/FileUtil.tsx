import MimeUtil from './MimeUtil';
import StringUtil from './StringUtil';
import Lang from '../model/global/Lang';
import CSV from 'comma-separated-values';
import archiveSvg from '../../assets/image/file/archive.svg';
import audioSvg from '../../assets/image/file/audio.svg';
import docSvg from '../../assets/image/file/doc.svg';
import fileSvg from '../../assets/image/file/file.svg';
import folderSvg from '../../assets/image/file/folder.svg';
import imageSvg from '../../assets/image/file/image.svg';
import pdfSvg from '../../assets/image/file/pdf.svg';
import pptSvg from '../../assets/image/file/ppt.svg';
import psdSvg from '../../assets/image/file/psd.svg';
import textSvg from '../../assets/image/file/text.svg';
import videoSvg from '../../assets/image/file/video.svg';
import xlsSvg from '../../assets/image/file/xls.svg';

export type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';
export default class FileUtil {
  static isImage(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, 'image');
  }

  static isPdf(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, 'application/pdf');
  }

  static isText(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, 'text');
  }

  static isDoc(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, 'application/msword') ||
      StringUtil.startWith(
        mimeType,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    );
  }

  static isPpt(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, 'application/vnd.ms-powerpoint') ||
      StringUtil.startWith(
        mimeType,
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      )
    );
  }

  static isXls(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, 'application/vnd.ms-excel') ||
      StringUtil.startWith(
        mimeType,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    );
  }

  static isAudio(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, 'audio');
  }

  static isVideo(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, 'video');
  }

  static isPsd(name: string | null): boolean {
    let extension = MimeUtil.getExtension(name);
    return extension === '.psd';
  }

  /**
   * 根据名字获取对应的图标。imageIcon传值了，那么图片格式采用imageIcon
   * @param name
   * @param idDir
   */
  static getIcon(name: string | null, idDir: boolean = false): any {
    if (idDir) {
      return folderSvg;
    }

    if (FileUtil.isPdf(name)) {
      return pdfSvg;
    } else if (FileUtil.isDoc(name)) {
      return docSvg;
    } else if (FileUtil.isPpt(name)) {
      return pptSvg;
    } else if (FileUtil.isXls(name)) {
      return xlsSvg;
    } else if (FileUtil.isAudio(name)) {
      return audioSvg;
    } else if (
      FileUtil.isVideo(name) ||
      MimeUtil.getExtension(name) === '.mkv'
    ) {
      return videoSvg;
    } else if (FileUtil.isText(name)) {
      return textSvg;
    } else if (FileUtil.isPsd(name)) {
      return psdSvg;
    } else if (FileUtil.isImage(name)) {
      return imageSvg;
    } else if (
      StringUtil.endWith(name, 'zip') ||
      StringUtil.endWith(name, 'rar') ||
      StringUtil.endWith(name, '7z') ||
      StringUtil.endWith(name, 'tar') ||
      StringUtil.endWith(name, 'tar') ||
      StringUtil.endWith(name, 'gz')
    ) {
      return archiveSvg;
    } else {
      return fileSvg;
    }
  }

  static sizeUnits: Unit[] = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
  ];

  //把一个大小转变成方便读的格式
  //human readable file size
  static humanFileSize(bytes: number, si: boolean = false): string {
    if (bytes == -1) {
      return Lang.t('preference.noLimit');
    }

    let thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
    let units = si
      ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let u = -1;
    do {
      bytes /= thresh;
      ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }

  // 把一个Unit单元转换成bytes
  static unitToBytes(unit: Unit): number {
    switch (unit) {
      case 'B':
      case 'KB':
      case 'MB':
      case 'GB':
      case 'TB':
      case 'PB':
      case 'EB':
      case 'ZB':
      case 'YB':
        return 1024 ** FileUtil.sizeUnits.indexOf(unit);
      default:
        throw Error('unitToBytes: unit is not valid');
    }
  }

  // 把一个bytes转换成Unit单元
  static bytesToNumUnitTuple(bytes: number): [number, Unit | undefined] {
    if (bytes <= -1) return [-1, undefined];

    let index = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      index++;
    }
    return [Number(bytes.toFixed()), FileUtil.sizeUnits[index]];
  }

  static getErrorLogsToCSVUrl(logs: object) {
    const _utf = '\uFEFF'; // 为了使文件以utf-8的编码模式，同时也是解决中文乱码的问题
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvStr = new CSV(logs, {
        header: ['filename', 'path', 'errorMsg'],
      }).encode();
      const blob = new Blob([_utf + csvStr], {
        type: 'text/csv',
      });
      return window.URL.createObjectURL(blob);
    }
    return '';
  }
}
