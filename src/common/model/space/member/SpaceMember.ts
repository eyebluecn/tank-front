import BaseEntity from '../../base/BaseEntity';
import User from '../../user/User';
import { SpaceMemberRole } from './SpaceMemberRole';
import Filter from '../../base/filter/Filter';
import SortFilter from '../../base/filter/SortFilter';
import InputFilter from '../../base/filter/InputFilter';

export interface SpaceMemberFormValues {
  spaceUuid: string;
  userUuid: string;
  role: SpaceMemberRole;
  uuid: string | null;
}
export default class SpaceMember extends BaseEntity {
  spaceUuid: string | null = null;
  userUuid: string | null = null;
  role: SpaceMemberRole | null = null;
  user: User | null = null;

  constructor(reactComponent?: React.Component) {
    super(reactComponent);
  }

  getTAG(): string {
    return 'spaceMember';
  }


  assign(obj: any) {
    super.assign(obj);
    this.assignEntity('user', User);
  }

  getFilters(): Filter[] {
    return [
      ...super.getFilters(),
      new InputFilter('空间ID', 'spaceUuid', '按空间ID搜索', false),
    ];
  }

  getForm(): SpaceMemberFormValues {
    return {
      spaceUuid: this.spaceUuid!,
      userUuid: this.userUuid!,
      role: this.role!,
      uuid: this.uuid ? this.uuid : null,
    };
  }
}
