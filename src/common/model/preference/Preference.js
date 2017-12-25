import BaseEntity from '../base/BaseEntity'
import Tank from '../tank/Tank'

export default class Preference extends BaseEntity {
  constructor (args) {
    super(args)
    //网站名称
    this.name = null

    //logo
    this.logoUrl = null
    this.logoTankUuid = null
    this.faviconUrl = null
    this.faviconTankUuid = null

    //底部第一行文字
    this.footerLine1 = null
    this.footerLine2 = null

    this.logoTank = new Tank('image', false, 1024 * 1024, '图片不能超过1M')
    this.faviconTank = new Tank('.ico', false, 1024 * 1024, '图片不能超过1M')

    this.validatorSchema = {
      name: {
        rules: [{required: true, message: '网站名称必填'}],
        error: null
      }
    }
  }

  static URL_API_PREFERENCE_FETCH = '/preference/fetch'

  render (obj) {
    super.render(obj)
    this.renderEntity('logoTank', Tank)
    this.renderEntity('faviconTank', Tank)
  }

  getForm () {
    return {
      name: this.name,
      logoUrl: this.logoUrl,
      logoTankUuid: this.logoTankUuid,
      faviconUrl: this.faviconUrl,
      faviconTankUuid: this.faviconTankUuid,
      footerLine1: this.footerLine1,
      footerLine2: this.footerLine2
    }
  }

  validate(){
    if (this.logoTank) {
      this.logoTankUuid = this.logoTank.uuid
      this.logoUrl = this.logoTank.url
    }
    if (this.faviconTank) {
      this.faviconTankUuid = this.faviconTank.uuid
      this.faviconUrl = this.faviconTank.url
    }
    return super.validate()
  }

  httpFetch (successCallback, errorCallback) {
    let that = this
    this.httpPost(Preference.URL_API_PREFERENCE_FETCH,{},function (response) {
      that.render(response.data.data)
      typeof successCallback === 'function' && successCallback(response)
    },errorCallback)
  }

}
