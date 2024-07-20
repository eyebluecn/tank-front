import Base, { IBase } from '@/models/Base'
import { IMatter } from '@/models/Matter'

export interface IShare extends IBase {
  code: string
}

export default class Share extends Base implements IShare {
  code = ''

  constructor(obj?: IShare) {
    super()
    obj && this.assign(obj)
  }
}
