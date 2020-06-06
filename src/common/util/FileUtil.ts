import MimeUtil from "./MimeUtil";
import StringUtil from "./StringUtil";

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
}
