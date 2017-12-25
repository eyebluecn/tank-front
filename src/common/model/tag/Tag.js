import BaseEntity from '../base/BaseEntity'
import Filter from '../base/Filter'
import { simpleDateTime } from '../../filter/time'
import Tank from '../tank/Tank'

export default class Tag extends BaseEntity {
  constructor (args) {
    super(args)
    this.userUuid = null
    this.name = null
    this.logoTank = new Tank('image', false, 1024 * 1024, '图片不能超过1M')
    this.logoTankUuid = null
    this.logoUrl = null
    this.validatorSchema = {
      name: {
        rules: [{required: true, message: '名称必填'}, {min: 1, max: 45, message: '名称最长45字'}],
        error: null
      }
    }
  }

  render(obj){
    super.render(obj)
    this.renderEntity('logoTank',Tank)
  }


  getFilters () {
    return [
      new Filter(Filter.prototype.Type.SORT, '排序', 'orderSort'),
      new Filter(Filter.prototype.Type.INPUT, '名称', 'name'),
      new Filter(Filter.prototype.Type.INPUT, '用户ID', 'userUuid', null, null, false, null)

    ]
  }

  getForm(){
    return{
      name: this.name,
      logoTankUuid: this.logoTankUuid,
      logoUrl: this.logoUrl,
      uuid: this.uuid ? this.uuid : null
    }
  }

  validate () {
    if(this.logoTank){
      this.logoTankUuid = this.logoTank.uuid
      this.logoUrl = this.logoTank.url
    }
    return super.validate()
  }

}