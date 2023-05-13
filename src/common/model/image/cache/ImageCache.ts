import BaseEntity from '../../base/BaseEntity';
import User from '../../user/User';
import Matter from '../../matter/Matter';
import InputFilter from '../../base/filter/InputFilter';
import SafeUtil from '../../../util/SafeUtil';

export default class ImageCache extends BaseEntity {
  static URL_DELETE_BATCH = '/api/image/cache/delete/batch';

  name: string | null = null;
  userUuid: string | null = null;
  matterUuid: string | null = null;
  matterName: string | null = null;
  mode: string | null = null;
  md5: string | null = null;
  size: number = 0;
  path: number = 0;

  /*
      这部分是辅助UI的字段信息
     */
  //作为勾选变量
  check: boolean = false;

  user: User = new User();
  matter: Matter = new Matter();

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  getTAG(): string {
    return 'imageCache';
  }

  assign(obj: any) {
    super.assign(obj);
  }

  getFilters() {
    return [
      ...super.getFilters(),
      new InputFilter('User Uuid', 'userUuid', null, false),
      new InputFilter('File Uuid', 'matterUuid', null, false),
    ];
  }

  getForm() {
    return {
      uuid: this.uuid ? this.uuid : null,
    };
  }

  getResizeUrl() {
    return (
      '/api/alien/preview/' +
      this.matterUuid +
      '/' +
      this.matterName +
      '?ir=' +
      this.mode
    );
  }

  getOriginUrl() {
    return '/api/alien/download/' + this.matterUuid + '/' + this.matterName;
  }

  httpDeleteBatch(
    uuids: string,
    successCallback?: () => any,
    errorCallback?: () => any
  ) {
    this.httpPost(
      ImageCache.URL_DELETE_BATCH,
      { uuids: uuids },
      function (response: any) {
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }
}
