import BaseEntity from '../../base/BaseEntity';
import DateUtil from '../../../util/DateUtil';
import SafeUtil from '../../../util/SafeUtil';

export default class DownloadToken extends BaseEntity {
  userUuid: string | null = null;
  matterUuid: string | null = null;
  expireTime: string | null = null;
  ip: string | null = null;

  static URL_FETCH_DOWNLOAD_TOKEN = '/api/alien/fetch/download/token';

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  getTAG(): string {
    return 'downloadToken';
  }

  assign(obj: any) {
    super.assign(obj);
    this.assignEntity('expireTime', Date);
  }

  getFilters() {
    return [...super.getFilters()];
  }

  httpFetchDownloadToken(
    matterUuid: string,
    successCallback?: () => any,
    errorCallback?: () => any
  ) {
    let that = this;
    let date = new Date(new Date().getTime() + 10 * 60 * 1000);

    let form = {
      expireTime: DateUtil.simpleDateTime(date),
      matterUuid,
    };
    this.httpPost(
      DownloadToken.URL_FETCH_DOWNLOAD_TOKEN,
      form,
      function (response: any) {
        that.assign(response.data.data);
        SafeUtil.safeCallback(successCallback)(response);
      },
      errorCallback
    );
  }
}
