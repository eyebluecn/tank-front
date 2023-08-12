import BaseEntity from '../base/BaseEntity';
import User from '../user/User';
import FileUtil from '../../util/FileUtil';
import Filter from '../base/filter/Filter';
import InputFilter from '../base/filter/InputFilter';

export interface SpaceFormValues {
  name: string;
  sizeLimit: number;
  totalSizeLimit: number;
  uuid: string | null;
}

export default class Space extends BaseEntity {
  name: string | null = null;
  totalSize: number = 0;
  sizeLimit: number = 0;
  totalSizeLimit: number = 0;
  userUuid: string | null = null;
  user: User | null = null;
  type: 'PRIVATE' | 'SHARED' | null = null;

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  getTAG(): string {
    return 'space';
  }

  getFilters(): Filter[] {
    return [
      ...super.getFilters(),
      new InputFilter('空间名称', 'name'),
      new InputFilter('空间类型', 'type'),
    ];
  }

  assign(obj: any) {
    super.assign(obj);
    this.assignEntity('user', User);
  }

  getForm(): SpaceFormValues {
    return {
      name: this.name!,
      sizeLimit: this.sizeLimit,
      totalSizeLimit: this.totalSizeLimit,
      uuid: this.uuid ? this.uuid : null,
    };
  }

  getHumanizeTotalSize() {
    return FileUtil.humanFileSize(this.totalSize);
  }

  getHumanizeSizeLimit() {
    return FileUtil.humanFileSize(this.sizeLimit);
  }

  getHumanizeTotalSizeLimit() {
    return FileUtil.humanFileSize(this.totalSizeLimit);
  }

  getUsedPercent() {
    if (this.totalSizeLimit === 0) {
      return 0;
    }
    return (this.totalSize / this.totalSizeLimit) * 100;
  }
}
