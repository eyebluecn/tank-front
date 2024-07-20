import Base, { IBase } from '@/models/Base'
import { SpaceMemberRole } from '@/common/model/space/member/SpaceMemberRole'

export interface ISpaceMember extends IBase {
  spaceUuid: string
  role: SpaceMemberRole
}

export default class SpaceMember extends Base implements ISpaceMember {
  spaceUuid = ''
  role = SpaceMemberRole.READ_ONLY

  constructor(obj?: ISpaceMember) {
    super()
    obj && this.assign(obj)
  }
}
