import MimeUtil from "./MimeUtil";
import StringUtil from "./StringUtil";
import Lang from "../model/global/Lang";
import CSV from "comma-separated-values";

export default class FileUtil {
  static isImage(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, "image");
  }

  static isPdf(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, "application/pdf");
  }

  static isText(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, "text");
  }

  static isDoc(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, "application/msword") ||
      StringUtil.startWith(
        mimeType,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    );
  }

  static isPpt(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, "application/vnd.ms-powerpoint") ||
      StringUtil.startWith(
        mimeType,
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      )
    );
  }

  static isXls(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return (
      StringUtil.startWith(mimeType, "application/vnd.ms-excel") ||
      StringUtil.startWith(
        mimeType,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    );
  }

  static isAudio(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, "audio");
  }

  static isVideo(name: string | null): boolean {
    let mimeType = MimeUtil.getMimeType(name);
    return StringUtil.startWith(mimeType, "video");
  }

  static isPsd(name: string | null): boolean {
    let extension = MimeUtil.getExtension(name);
    return extension === ".psd";
  }

  /**
   * 根据名字获取对应的图标。imageIcon传值了，那么图片格式采用imageIcon
   * @param name
   * @param idDir
   */
  static getIcon(name: string | null, idDir: boolean = false): any {
    if (idDir) {
      return require("../../assets/image/file/folder.svg");
    }

    if (FileUtil.isPdf(name)) {
      return require("../../assets/image/file/pdf.svg");
    } else if (FileUtil.isDoc(name)) {
      return require("../../assets/image/file/doc.svg");
    } else if (FileUtil.isPpt(name)) {
      return require("../../assets/image/file/ppt.svg");
    } else if (FileUtil.isXls(name)) {
      return require("../../assets/image/file/xls.svg");
    } else if (FileUtil.isAudio(name)) {
      return require("../../assets/image/file/audio.svg");
    } else if (
      FileUtil.isVideo(name) ||
      MimeUtil.getExtension(name) === ".mkv"
    ) {
      return require("../../assets/image/file/video.svg");
    } else if (FileUtil.isText(name)) {
      return require("../../assets/image/file/text.svg");
    } else if (FileUtil.isPsd(name)) {
      return require("../../assets/image/file/psd.svg");
    } else if (FileUtil.isImage(name)) {
      return require("../../assets/image/file/image.svg");
    } else if (
      StringUtil.endWith(name, "zip") ||
      StringUtil.endWith(name, "rar") ||
      StringUtil.endWith(name, "7z") ||
      StringUtil.endWith(name, "tar") ||
      StringUtil.endWith(name, "tar") ||
      StringUtil.endWith(name, "gz")
    ) {
      return require("../../assets/image/file/archive.svg");
    } else {
      return require("../../assets/image/file/file.svg");
    }
  }


  //把一个大小转变成方便读的格式
  //human readable file size
  static humanFileSize(bytes: number, si: boolean = false): string {
    if (bytes == -1) {
      return Lang.t("preference.noLimit")
    }

    let thresh = si ? 1000 : 1024
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B'
    }
    let units = si
      ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let u = -1
    do {
      bytes /= thresh
      ++u
    } while (Math.abs(bytes) >= thresh && u < units.length - 1)
    return bytes.toFixed(1) + ' ' + units[u]
  }

  static getErrorLogsToCSVUrl(logs: object) {
    const _utf = "\uFEFF"; // 为了使文件以utf-8的编码模式，同时也是解决中文乱码的问题
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvStr = new CSV(logs, {
        header: ["filename", "path", "errorMsg"],
      }).encode();
      const blob = new Blob([_utf + csvStr], {
        type: "text/csv",
      });
      return URL.createObjectURL(blob);
    }
    return "";
  };

}
