import {getMimeType} from "./MimeUtil";
import {endWith, getExtension, startWith} from "../filter/str";

export default class FileUtil {


  static isImage(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'image');
  }

  static isPdf(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'application/pdf');
  }

  static isText(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'text');
  }

  static isDoc(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'application/msword') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  static isPpt(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'application/vnd.ms-powerpoint') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  }

  static isXls(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'application/vnd.ms-excel') || startWith(mimeType, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  static isAudio(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'audio');
  }

  static isVideo(name) {
    let mimeType = getMimeType(name)
    return startWith(mimeType, 'video');
  }

  static isPsd(name) {
    let extension = getExtension(name)
    return extension === '.psd';
  }

  /**
   * 根据名字获取对应的图标。imageIcon传值了，那么图片格式采用imageIcon
   * @param name
   * @param idDir
   * @param imageIcon
   */
  static getIcon(name, idDir = false) {

    if (idDir) {
      return "/static/img/file/folder.svg"
    }

    let mimeType = getMimeType(name)
    if (FileUtil.isPdf()) {
      return "/static/img/file/pdf.svg"
    } else if (FileUtil.isDoc()) {
      return "/static/img/file/doc.svg"
    } else if (FileUtil.isPpt()) {
      return "/static/img/file/ppt.svg"
    } else if (FileUtil.isXls()) {
      return "/static/img/file/xls.svg"
    } else if (FileUtil.isAudio()) {
      return "/static/img/file/audio.svg"
    } else if (FileUtil.isVideo() || getExtension(name) === ".mkv") {
      return "/static/img/file/video.svg"
    } else if (FileUtil.isText()) {
      return "/static/img/file/text.svg"
    } else if (FileUtil.isPsd()) {
      return "/static/img/file/psd.svg"
    } else if (FileUtil.isImage()) {
      return "/static/img/file/image.svg"
    } else if (endWith(name, 'zip') || endWith(name, 'rar') || endWith(name, '7z') || endWith(name, 'tar') || endWith(name, 'tar') || endWith(name, 'gz')) {
      return "/static/img/file/archive.svg"
    } else {
      return "/static/img/file/file.svg"
    }

  }
}
