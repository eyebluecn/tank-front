import BaseEntity from "../base/BaseEntity";
import Filter from "../base/filter/Filter";
import FileUtil from "../../util/FileUtil";
import ImageUtil from "../../util/ImageUtil";
import EnvUtil from "../../util/EnvUtil";
import InputFilter from "../base/filter/InputFilter";
import CheckFilter from "../base/filter/CheckFilter";
import SortFilter from "../base/filter/SortFilter";

export default class Matter extends BaseEntity {
  puuid: string | null = null;
  userUuid: string | null = null;
  dir: boolean = false;
  alien: boolean = false;
  name: string | null = null;
  md5: string | null = null;
  size: number = 0;
  privacy: boolean = true;
  path: string | null = null;
  times: number = 0;
  parent: string | null = null;

  /*
  这部分是辅助UI的字段信息
   */
  //作为勾选变量
  check: boolean = false;

  //允许用户选择的文件类型
  filter: string = "*";
  //本地字段
  //给用户的提示文字
  uploadHint: string | null = null;
  //浏览器中选择好的原生file，未作任何处理。
  file: string | null = null;
  //当前上传进度的数值 0-1之间
  progress: number = 0;
  //实时上传速度 byte/s
  speed: number = 0;

  static URL_MATTER_CREATE_DIRECTORY = "/api/matter/create/directory";
  static URL_MATTER_DELETE = "/api/matter/delete";
  static URL_MATTER_DELETE_BATCH = "/api/matter/delete/batch";
  static URL_MATTER_RENAME = "/api/matter/rename";
  static URL_CHANGE_PRIVACY = "/api/matter/change/privacy";
  static URL_MATTER_MOVE = "/api/matter/move";
  static URL_MATTER_DOWNLOAD = "/api/matter/download";
  static URL_MATTER_UPLOAD = "/api/matter/upload";
  static URL_MATTER_ZIP = "/api/matter/zip";

  static MATTER_ROOT = "root";

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);
    super.assignList("parent", Matter);
  }

  getForm(): any {
    return {
      userUuid: this.userUuid,
      puuid: this.puuid,
      uuid: this.uuid ? this.uuid : null,
      dir: this.dir,
      alien: this.alien,
      name: this.name,
      md5: this.md5,
      size: this.size,
      privacy: this.privacy,
      path: this.path,
      times: this.times,
      parent: this.parent,
    };
  }

  getFilters(): Filter[] {
    return [
      ...super.getFilters(),
      new InputFilter("父级菜单uuid", "puuid", null, false),
      new InputFilter("用户", "userUuid", null, false),
      new InputFilter("关键字", "name"),
      new CheckFilter("文件夹", "dir"),
      new CheckFilter("应用数据", "alien"),
      new SortFilter("文件夹", "orderDir"),
      new SortFilter("下载次数", "orderTimes"),
      new SortFilter("大小", "orderSize"),
      new SortFilter("名称", "orderName"),
      new InputFilter("后缀名", "extensions"),
      new InputFilter("分享uuid", "shareUuid"),
      new InputFilter("提取码", "shareCode"),
      new InputFilter("分享根目录", "shareRootUuid"),
    ];
  }

  getUrlPrefix() {
    return "/api/matter"
  }

  isImage() {
    return FileUtil.isImage(this.name)
  }


  isPdf() {
    return FileUtil.isPdf(this.name)
  }

  isText() {
    return FileUtil.isText(this.name)
  }

  isDoc() {
    return FileUtil.isDoc(this.name)
  }

  isPpt() {
    return FileUtil.isPpt(this.name)
  }

  isXls() {
    return FileUtil.isXls(this.name)
  }

  isAudio() {
    return FileUtil.isAudio(this.name)
  }

  isVideo() {
    return FileUtil.isVideo(this.name)
  }

  isPsd() {
    return FileUtil.isPsd(this.name)
  }

  getIcon() {
    if (FileUtil.isImage(this.name)) {
      return ImageUtil.handleImageUrl(this.getPreviewUrl(), false, 100, 100)
    } else {
      return FileUtil.getIcon(this.name, this.dir)
    }
  }

  getPreviewUrl(downloadTokenUuid = null) {
    return EnvUtil.currentHost() + '/api/alien/preview/' + this.uuid + '/' + this.name + (downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : '')
  }

}
