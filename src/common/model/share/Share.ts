import BaseEntity from '../base/BaseEntity';
import Matter from '../matter/Matter';
import FileUtil from '../../util/FileUtil';
import EnvUtil from '../../util/EnvUtil';
import { ShareType } from './ShareType';
import { ShareExpireOption, ShareExpireOptionMap } from './ShareExpireOption';
import DateUtil from '../../util/DateUtil';
import SafeUtil from '../../util/SafeUtil';
import MessageBoxUtil from '../../util/MessageBoxUtil';

export default class Share extends BaseEntity {
  name: string | null = null;
  shareType: ShareType = ShareType.MIX;
  userUuid: string | null = null;
  username: string | null = null;
  downloadTimes: number = 0;
  code: string | null = null;
  expireInfinity: boolean = false;
  expireTime: Date | null = null;

  //当前正在查看的文件夹
  dirMatter: Matter = new Matter();
  //当前share对应的matters
  matters: Matter[] = [];
  spaceUuid: string | null = null;

  //本地临时字段
  expireOption: ShareExpireOption = ShareExpireOption.MONTH;

  static URL_CREATE = '/api/share/create';
  static URL_BROWSE = '/api/share/browse';
  static URL_DELETE_BATCH = '/api/share/delete/batch';
  static URL_ZIP = '/api/share/zip';
  static URL_MATTER_PAGE = '/api/share/matter/page';

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  assign(obj: any) {
    super.assign(obj);
    super.assignEntity('expireTime', Date);
    super.assignEntity('dirMatter', Matter);
    super.assignList('matters', Matter);
  }

  getTAG(): string {
    return 'share';
  }

  getFilters() {
    return [...super.getFilters()];
  }

  getForm() {
    return {
      name: this.name,
      uuid: this.uuid ? this.uuid : null,
    };
  }

  getIcon() {
    if (this.shareType === ShareType.MIX) {
      return FileUtil.getIcon('zip', false);
    } else {
      return FileUtil.getIcon(
        this.name,
        this.shareType === ShareType.DIRECTORY
      );
    }
  }

  getLink() {
    return EnvUtil.currentHost() + '/share/detail/' + this.uuid;
  }

  hasExpired() {
    if (this.expireInfinity) {
      return false;
    } else {
      if (this.expireTime) {
        return new Date(this.expireTime).getTime() < new Date().getTime();
      } else {
        return false;
      }
    }
  }

  //获取过期时间
  getExpireTime() {
    const delta = ShareExpireOptionMap[this.expireOption].deltaMillisecond;
    const now = new Date();
    return new Date(now.getTime() + delta);
  }

  //下载zip包
  downloadZip(rootUuid: string, puuid?: string) {
    window.open(
      `${EnvUtil.currentHost()}${Share.URL_ZIP}?shareUuid=${this.uuid}&code=${
        this.code
      }&puuid=${puuid}&rootUuid=${rootUuid}`
    );
  }

  //创建一个分享matterUuids要求为数组，expireTime要求为时间对象
  httpCreate(
    matterUuids: string,
    successCallback?: () => any,
    errorCallback?: () => any
  ) {
    let that = this;

    const form = {
      matterUuids,
      spaceUuid: this.spaceUuid,
      expireInfinity: this.expireOption === ShareExpireOption.INFINITY,
      expireTime: DateUtil.simpleDateTime(this.getExpireTime()),
    };

    this.httpPost(
      Share.URL_CREATE,
      form,
      function (response: any) {
        that.assign(response.data.data);
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpDeleteBatch(
    uuids: string,
    successCallback?: () => any,
    errorCallback?: () => any
  ) {
    this.httpPost(
      Share.URL_DELETE_BATCH,
      { uuids: uuids },
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }

  httpBrowse(
    puuid: string,
    rootUuid: string,
    successCallback?: () => any,
    errorCallback?: () => any
  ) {
    let that = this;

    const form = {
      puuid,
      rootUuid,
      shareUuid: this.uuid,
      code: this.code,
    };

    this.detailLoading = true;
    this.httpPost(
      Share.URL_BROWSE,
      form,
      function (response: any) {
        that.assign(response.data.data);
        that.detailLoading = false;
        SafeUtil.safeCallback(successCallback)(response);
      },
      function (errorMsg: any) {
        that.detailLoading = false;
        MessageBoxUtil.error(errorMsg);
        SafeUtil.safeCallback(errorCallback)(errorMsg);
      }
    );
  }
}
