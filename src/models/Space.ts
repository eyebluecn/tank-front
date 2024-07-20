import Base, { IBase } from '@/models/Base'

export interface ISpace extends IBase {
  name: string
}

export default class Space extends Base implements ISpace {
  name = ''

  constructor(obj?: ISpace) {
    super()
    obj && this.assign(obj)
  }
}
