import Base, { IBase } from '@/models/Base'

export interface IUser extends IBase {
  spaceUuid: string
}

export default class User extends Base implements IUser {
  spaceUuid = ''

  constructor(obj?: IUser) {
    super()
    obj && this.assign(obj)
  }
}
