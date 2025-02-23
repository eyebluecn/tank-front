import { message } from 'antd';
import axios, { CancelTokenSource } from 'axios';
import BaseEntity from '../base/BaseEntity';
import Filter from '../base/filter/Filter';
import HttpUtil from '../../util/HttpUtil';
import FileUtil from '../../util/FileUtil';
import ImageUtil from '../../util/ImageUtil';
import EnvUtil from '../../util/EnvUtil';
import InputFilter from '../base/filter/InputFilter';
import CheckFilter from '../base/filter/CheckFilter';
import SortFilter from '../base/filter/SortFilter';
import MimeUtil from '../../util/MimeUtil';
import StringUtil from '../../util/StringUtil';
import NumberUtil from '../../util/NumberUtil';
import SafeUtil from '../../util/SafeUtil';
import ImagePreviewer from '../../../pages/widget/previewer/ImagePreviewer';
import MessageBoxUtil from '../../util/MessageBoxUtil';
import PreviewerHelper from '../../../pages/widget/previewer/PreviewerHelper';
import HttpBase from '../base/HttpBase';
import User from '../user/User';

export default class Matter extends BaseEntity {
  puuid: string = '';
  userUuid: string = '';
  dir: boolean = false;
  alien: boolean = false;
  name: string = '';
  md5: string | null = null;
  size: number = 0;
  privacy: boolean = true;
  path: string | null = null;
  times: number = 0;
  //上次访问时间
  visitTime: Date | null = null;
  parent: Matter | null = null;
  user: User = new User();
  // 文件是否被软删除
  deleted: boolean = false;
  deleteTime: Date | null = null;
  spaceUuid: string | null = null;

  /*
    这部分是辅助UI的字段信息
     */
  //作为勾选变量
  check: boolean = false;
  editMode: boolean = false;

  //允许用户选择的文件类型
  filter: string = '*';
  //本地字段
  //给用户的提示文字
  uploadHint: string | null = null;
  //浏览器中选择好的原生file，未作任何处理。
  file: File | null = null;
  //当前上传进度的数值 0-1之间
  progress: number = 0;
  //实时上传速度 byte/s
  speed: number = 0;
  //取消上传source
  cancelSource: CancelTokenSource = axios.CancelToken.source();

  static URL_MATTER_CREATE_DIRECTORY = '/api/matter/create/directory';
  static URL_MATTER_SOFT_DELETE = '/api/matter/soft/delete';
  static URL_MATTER_SOFT_DELETE_BATCH = '/api/matter/soft/delete/batch';
  static URL_MATTER_RECOVERY = '/api/matter/recovery';
  static URL_MATTER_RECOVERY_BATCH = '/api/matter/recovery/batch';
  static URL_MATTER_DELETE = '/api/matter/delete';
  static URL_MATTER_DELETE_BATCH = '/api/matter/delete/batch';
  static URL_MATTER_RENAME = '/api/matter/rename';
  static URL_CHANGE_PRIVACY = '/api/matter/change/privacy';
  static URL_MATTER_MOVE = '/api/matter/move';
  static URL_MATTER_UPLOAD = '/api/matter/upload';
  static URL_MATTER_ZIP = '/api/matter/zip';
  static URL_MATTER_CRAWL = '/api/matter/crawl';
  static URL_MATTER_SEARCH = '/api/matter/search';

  static MATTER_ROOT = 'root';

  //下载zip包
  static downloadZip(uuidsString: string, spaceUuid: string) {
    window.open(
      `${EnvUtil.currentHost()}${
        Matter.URL_MATTER_ZIP
      }?uuids=${uuidsString}&spaceUuid=${spaceUuid}`
    );
  }

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);
    this.assignEntity('parent', Matter);
    this.assignEntity('user', User);
    this.assignEntity('visitTime', Date);
    this.assignEntity('deleteTime', Date);
  }

  getTAG(): string {
    return 'matter';
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
      new InputFilter('父级菜单uuid', 'puuid', null, false),
      new InputFilter('用户', 'userUuid', null, false),
      new InputFilter('关键字', 'name'),
      new CheckFilter('文件夹', 'dir'),
      new CheckFilter('应用数据', 'alien'),
      new CheckFilter('删除', 'deleted'),
      new SortFilter('文件夹', 'orderDir'),
      new SortFilter('下载次数', 'orderTimes'),
      new SortFilter('大小', 'orderSize'),
      new SortFilter('名称', 'orderName'),
      new InputFilter('后缀名', 'extensions'),
      new InputFilter('分享uuid', 'shareUuid'),
      new InputFilter('提取码', 'shareCode'),
      new InputFilter('分享根目录', 'shareRootUuid'),
      new SortFilter('删除时间排序', 'orderDeleteTime'),
      new InputFilter('空间uuid', 'spaceUuid'),
    ];
  }

  getUrlPrefix() {
    return '/api/matter';
  }

  isImage() {
    return FileUtil.isImage(this.name);
  }

  getIcon() {
    if (FileUtil.isImage(this.name)) {
      return ImageUtil.handleImageUrl(this.getPreviewUrl(), false, 100, 100);
    } else {
      return FileUtil.getIcon(this.name, this.dir);
    }
  }

  //下载文件
  download(downloadUrl?: string | null) {
    if (!downloadUrl) {
      downloadUrl = this.getDownloadUrl();
    }
    window.open(downloadUrl);
  }

  //预览文件 在分享的预览中才主动传入previewUrl.
  preview(previewUrl?: string | null) {
    let shareMode = true;
    if (previewUrl) {
      shareMode = true;
    } else {
      shareMode = false;
      previewUrl = this.getPreviewUrl();
    }

    if (this.isImage()) {
      ImagePreviewer.showSinglePhoto(previewUrl);
    } else {
      if (shareMode) {
        PreviewerHelper.preview(this, previewUrl);
      } else {
        PreviewerHelper.preview(this);
      }
    }
  }

  httpCreateDirectory(
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    let that = this;
    let form = {
      name: this.name,
      puuid: this.puuid,
      spaceUuid: this.spaceUuid,
    };

    return this.httpPost(
      Matter.URL_MATTER_CREATE_DIRECTORY,
      form,
      function (response: any) {
        that.assign(response.data.data);
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback,
      finallyCallback
    );
  }

  httpSoftDelete(successCallback?: any, errorCallback?: any) {
    this.httpPost(
      Matter.URL_MATTER_SOFT_DELETE,
      { uuid: this.uuid, spaceUuid: this.spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  static httpSoftDeleteBatch(
    uuids: string,
    spaceUuid: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    new HttpBase().httpPost(
      Matter.URL_MATTER_SOFT_DELETE_BATCH,
      { uuids, spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  httpDelete(successCallback?: any, errorCallback?: any) {
    this.httpPost(
      Matter.URL_MATTER_DELETE,
      { uuid: this.uuid, spaceUuid: this.spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  static httpSearch(
    params: {
      puuid: string;
      spaceUuid: string;
      keyword?: string;
    },
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    new HttpBase().httpGet(
      Matter.URL_MATTER_SEARCH,
      params,
      (res: any) => {
        const list = BaseEntity.renderList(res.data.data, Matter);
        successCallback?.(list);
      },
      errorCallback,
      finallyCallback
    );
  }

  static httpCrawl(
    body: {
      url: string;
      puuid: string;
      filename: string;
      spaceUuid: string;
    },
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    new HttpBase().httpPost(
      Matter.URL_MATTER_CRAWL,
      body,
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback,
      finallyCallback
    );
  }

  static httpDeleteBatch(
    uuids: string,
    spaceUuid: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    new HttpBase().httpPost(
      Matter.URL_MATTER_DELETE_BATCH,
      { uuids, spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  httpRecovery(successCallback?: any, errorCallback?: any) {
    this.httpPost(
      Matter.URL_MATTER_RECOVERY,
      { uuid: this.uuid, spaceUuid: this.spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  static httpRecoveryBatch(
    uuids: string,
    spaceUuid: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    new HttpBase().httpPost(
      Matter.URL_MATTER_RECOVERY_BATCH,
      { uuids, spaceUuid },
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  httpDetail(
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    let that = this;
    if (!this.uuid) {
      this.errorMessage = 'uuid未指定，无法获取到详情！';

      this.defaultErrorHandler(this.errorMessage, errorCallback);

      return;
    }

    this.detailLoading = true;

    this.httpGet(
      this.getUrlDetail(),
      {
        uuid: this.uuid,
        spaceUuid: this.spaceUuid,
      },
      function (response: any) {
        that.detailLoading = false;

        that.assign(response.data.data);

        SafeUtil.safeCallback(successCallback)(response);
      },
      function (response: any) {
        that.detailLoading = false;

        if (typeof errorCallback === 'function') {
          errorCallback(that.getErrorMessage(response), response);
        } else {
          //没有传入错误处理的方法就采用默认处理方法：toast弹出该错误信息。
          that.defaultErrorHandler(response);
        }
      },
      finallyCallback
    );
  }

  httpRename(
    name: string,
    successCallback?: any,
    errorCallback?: any,
    finallyCallback?: any
  ) {
    let that = this;
    this.httpPost(
      Matter.URL_MATTER_RENAME,
      { uuid: this.uuid, spaceUuid: this.spaceUuid, name: name },
      function (response: any) {
        that.assign(response.data.data);
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback,
      finallyCallback
    );
  }

  httpChangePrivacy(
    privacy: boolean,
    successCallback?: any,
    errorCallback?: any
  ) {
    let that = this;
    this.httpPost(
      Matter.URL_CHANGE_PRIVACY,
      { uuid: this.uuid, privacy: privacy, spaceUuid: this.spaceUuid },
      function (response: any) {
        that.privacy = privacy;
        if (typeof successCallback === 'function') {
          successCallback(response);
          message.success(response.data.msg);
        } else {
          message.success(response.data.msg);
        }
      },
      errorCallback
    );
  }

  static httpMove(
    spaceUuid: string,
    srcUuids: string,
    destUuid: string,
    successCallback?: any,
    errorCallback?: any
  ) {
    let form: any = { spaceUuid, srcUuids };
    if (destUuid) {
      form.destUuid = destUuid;
    } else {
      form.destUuid = 'root';
    }
    new HttpBase().httpPost(
      Matter.URL_MATTER_MOVE,
      form,
      function (response: any) {
        typeof successCallback === 'function' && successCallback(response);
      },
      errorCallback
    );
  }

  /*
    以下是和上传相关的内容。
     */

  //从file中装填metaData
  validate() {
    if (!this.file) {
      this.errorMessage = '请选择上传文件';
      return false;
    }

    this.name = this.file.name;
    if (!this.name) {
      this.errorMessage = '请选择上传文件';
      return false;
    }

    this.size = this.file.size;

    this.errorMessage = null;
    return true;
  }

  //验证过滤器有没有误填写，这个方法主要给开发者使用。
  validateFilter() {
    let filter = this.filter;
    if (filter === null || filter === '') {
      this.errorMessage = '过滤器设置错误，请检查-1';
      console.error('过滤器设置错误，请检查.-1');
      return false;
    }
    if (filter !== '*') {
      let regex1 = /^(image|audio|video|text)(\|(image|audio|video|text))*$/g;
      let regex2 = /^(\.[\w]+)(\|\.[\w]+)*$/;
      // 测试几种特殊类型 image|audio|video|text

      if (!regex1.test(filter)) {
        //测试后缀名
        if (!regex2.test(filter)) {
          this.errorMessage = '过滤器设置错误，请检查-2';
          console.error('过滤器设置错误，请检查.-2');
          return false;
        }
      }
    }

    //validate privacy
    let privacy = this.privacy;
    if (!privacy) {
      if (privacy !== false) {
        this.errorMessage = 'privacy属性为Boolean类型';
        console.error('privacy属性为Boolean类型.');
        return false;
      }
    }

    return true;
  }

  //验证用户上传的文件是否符合过滤器
  validateFileType() {
    if (!this.filter) {
      this.errorMessage = '该过滤条件有问题';
      return false;
    }
    if (this.filter === '*') {
      this.errorMessage = null;
      return true;
    }

    let type = MimeUtil.getMimeType(this.name);
    let extension = MimeUtil.getExtension(this.name);
    let simpleType = type.substring(0, type.indexOf('/'));

    //专门解决android微信浏览器中名字乱命名的bug.
    if (StringUtil.startWith(this.name, 'image%3A')) {
      extension = 'jpg';
      simpleType = 'image';
    } else if (StringUtil.startWith(this.name, 'video%3A')) {
      extension = 'mp4';
      simpleType = 'video';
    } else if (StringUtil.startWith(this.name, 'audio%3A')) {
      extension = 'mp3';
      simpleType = 'audio';
    }

    if (StringUtil.containStr(this.filter, extension)) {
      this.errorMessage = null;
      return true;
    }

    if (simpleType) {
      if (StringUtil.containStr(this.filter, simpleType)) {
        this.errorMessage = null;
        return true;
      }
    }
    this.errorMessage = '您上传的文件格式不符合要求';
    return false;
  }

  //文件上传
  httpUpload(successCallback?: any, failureCallback?: any) {
    let that = this;

    //验证是否装填好
    if (!this.validate()) {
      return;
    }

    //验证用户填写的过滤条件是否正确
    if (!this.validateFilter()) {
      return;
    }

    //验证是否满足过滤器
    if (!this.validateFileType()) {
      MessageBoxUtil.error('文件类型不满足，请重试');
      return;
    }

    //（兼容性：chrome，ff，IE9及以上）
    let formData = new FormData();

    formData.append('spaceUuid', that.spaceUuid!);
    formData.append('puuid', that.puuid);
    formData.append('file', that.file!);
    formData.append('alien', that.alien.toString());
    formData.append('privacy', that.privacy.toString());

    //闭包
    let lastTimeStamp = new Date().getTime();
    let lastSize = 0;

    that.loading = true;

    HttpUtil.httpPostFile(
      Matter.URL_MATTER_UPLOAD,
      formData,
      function (response: any) {
        that.uuid = response.data.data.uuid;
        SafeUtil.safeCallback(successCallback)(response);
      },
      function (err: any) {
        if (axios.isCancel(err)) {
          that.clear();
          SafeUtil.safeCallback(failureCallback)();
          return;
        }
        const response = err.response;
        that.errorMessage = response;
        that.clear();
        that.defaultErrorHandler(response);
        SafeUtil.safeCallback(failureCallback)(that.getErrorMessage(response));
      },
      function () {
        that.loading = false;
      },
      function (event) {
        //上传进度。
        that.progress = event.loaded / event.total;

        let currentTime = new Date().getTime();
        let deltaTime = currentTime - lastTimeStamp;

        //每1s计算一次速度
        if (deltaTime > 1000) {
          lastTimeStamp = currentTime;

          let currentSize = event.loaded;
          let deltaSize = currentSize - lastSize;
          lastSize = currentSize;

          that.speed = NumberUtil.parseInt(
            (deltaSize / (deltaTime / 1000)).toFixed(0)
          );
        }
        that.updateUI();
      },
      {
        cancelToken: that.cancelSource.token,
      }
    );
  }

  cancelUpload() {
    this.cancelSource.cancel();
  }

  //清除文件
  clear() {
    //filter,privacy不变
    let matter = new Matter();
    matter.filter = this.filter;
    matter.privacy = this.privacy;
    matter.errorMessage = this.errorMessage;
    matter.uploadHint = this.uploadHint;
    this.assign(matter);
  }

  getPreviewUrl(downloadTokenUuid?: string): string {
    return `${EnvUtil.currentHost()}/api/alien/preview/${this.uuid}/${
      this.name
    }${downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : ''}`;
  }

  getDownloadUrl(downloadTokenUuid?: string): string {
    return `${EnvUtil.currentHost()}/api/alien/download/${this.uuid}/${
      this.name
    }${downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : ''}`;
  }

  getShareDownloadUrl(
    shareUuid: string,
    shareCode: string,
    shareRootUuid: string
  ): string {
    return `${EnvUtil.currentHost()}/api/share/matter/download?matterUuid=${
      this.uuid
    }&shareUuid=${shareUuid}&shareCode=${shareCode}&shareRootUuid=${shareRootUuid}`;
  }

  getSharePreviewUrl(
    shareUuid: string,
    shareCode: string,
    shareRootUuid: string
  ): string {
    return `${EnvUtil.currentHost()}/api/share/matter/preview?matterUuid=${
      this.uuid
    }&shareUuid=${shareUuid}&shareCode=${shareCode}&shareRootUuid=${shareRootUuid}`;
  }
}
