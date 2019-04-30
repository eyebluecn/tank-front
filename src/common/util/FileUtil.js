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
   */
  static getIcon(name, idDir = false) {

    if (idDir) {
      return "/static/img/file/folder.svg"
    }

    if (FileUtil.isPdf(name)) {
      return "/static/img/file/pdf.svg"
    } else if (FileUtil.isDoc(name)) {
      return "/static/img/file/doc.svg"
    } else if (FileUtil.isPpt(name)) {
      return "/static/img/file/ppt.svg"
    } else if (FileUtil.isXls(name)) {
      return "/static/img/file/xls.svg"
    } else if (FileUtil.isAudio(name)) {
      return "/static/img/file/audio.svg"
    } else if (FileUtil.isVideo(name) || getExtension(name) === ".mkv") {
      return "/static/img/file/video.svg"
    } else if (FileUtil.isText(name)) {
      return "/static/img/file/text.svg"
    } else if (FileUtil.isPsd(name)) {
      return "/static/img/file/psd.svg"
    } else if (FileUtil.isImage(name)) {
      return "/static/img/file/image.svg"
    } else if (endWith(name, 'zip') || endWith(name, 'rar') || endWith(name, '7z') || endWith(name, 'tar') || endWith(name, 'tar') || endWith(name, 'gz')) {
      return "/static/img/file/archive.svg"
    } else {
      return "/static/img/file/file.svg"
    }

  }
}
