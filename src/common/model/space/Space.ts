import BaseEntity from '../base/BaseEntity';
import User from '../user/User';

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

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
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
}
