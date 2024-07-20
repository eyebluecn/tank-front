import Base, { IBase } from '@/models/Base'
import { StringifyType } from '@/typings'
import { IPreviewEngine } from '@/models/sub/PreviewEngine'
import SafeUtil from '@/common/util/SafeUtil'
import { axios } from '@/setupAxios'

export interface IPreference extends IBase {
  name: string
  faviconUrl: string
  deletedKeepDays: number
  previewConfig: StringifyType<{
    previewEngines?: IPreviewEngine[]
  }>
}

export default class Preference extends Base implements IPreference {
  name = ''
  faviconUrl = ''
  deletedKeepDays = 0
  previewConfig = '{}'

  static URL_PREFERENCE = '/preference'
  static URL_PREFERENCE_FETCH = `${Preference.URL_PREFERENCE}/fetch`

  constructor(obj?: IPreference) {
    super()
    obj && this.assign(obj)
  }

  getRecycleBinStatus() {
    return this.deletedKeepDays > 0
  }

  getPreviewConfig(): { previewEngines?: IPreviewEngine[] } {
    return SafeUtil.jsonParse(this.previewConfig)
  }

  //修改title和favicon
  updateTitleAndFavicon() {
    if (this.faviconUrl) {
      //修改favicon
      let link: any = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = this.faviconUrl
      document.getElementsByTagName('head')[0].appendChild(link)
    }

    document.title = this.name
  }

  static httpFetch(): Promise<IPreference> {
    return axios.post(Preference.URL_PREFERENCE_FETCH)
  }
}
