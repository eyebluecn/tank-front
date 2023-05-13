import Base from '../base/Base';
import InstallFieldInfo from './InstallFieldInfo';

export default class InstallTableInfo extends Base {
  name: string = '';
  tableExist: boolean = false;
  allFields: InstallFieldInfo[] = [];
  missingFields: InstallFieldInfo[] = [];

  assign(obj: any) {
    super.assign(obj);

    this.assignList('allFields', InstallFieldInfo);
    this.assignList('missingFields', InstallFieldInfo);
  }
}
