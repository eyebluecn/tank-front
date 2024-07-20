import FileUtil from '@/common/util/FileUtil'
import ImageUtil from '@/common/util/ImageUtil'
import EnvUtil from '@/common/util/EnvUtil'
import Base, { IBase } from '@/models/Base'
import { axios } from '@/setupAxios'
import SortDirection from '@/common/model/base/SortDirection'

export interface IMatter extends IBase {
  puuid: string // 父级uuid
  userUuid: string
  dir: boolean
  alien: boolean
  name: string
  md5: string
  size: number
  privacy: boolean
  path: string
  deleted: boolean
  spaceUuid: string // 空间
  deleteTime: Date | null
}

export interface IMatterDetail extends IMatter {
  parent: IMatterDetail | null // 父级，null表示根目录
}

export default class Matter extends Base implements IMatter {
  puuid = '' // 父级，'root'表示根目录
  userUuid = ''
  dir = false
  alien = false
  name = ''
  md5 = ''
  size = 0
  privacy = false
  path = ''
  deleted = false
  spaceUuid = '' // 空间
  deleteTime = null

  static URL_MATTER = '/matter'
  static URL_MATTER_PAGE = `${Matter.URL_MATTER}/page`
  static URL_MATTER_CREATE_DIRECTORY = `${Matter.URL_MATTER}/create/directory`
  static URL_MATTER_DETAIL = `${Matter.URL_MATTER}/detail`
  static URL_MATTER_SOFT_DELETE = `${Matter.URL_MATTER}/soft/delete`
  static URL_MATTER_SOFT_DELETE_BATCH = `${Matter.URL_MATTER}/soft/delete/batch`
  static URL_MATTER_RECOVERY = `${Matter.URL_MATTER}/recovery`
  static URL_MATTER_RECOVERY_BATCH = `${Matter.URL_MATTER}/recovery/batch`
  static URL_MATTER_DELETE = `${Matter.URL_MATTER}/delete`
  static URL_MATTER_DELETE_BATCH = `${Matter.URL_MATTER}/delete/batch`
  static URL_MATTER_RENAME = `${Matter.URL_MATTER}/rename`
  static URL_CHANGE_PRIVACY = `${Matter.URL_MATTER}/change/privacy`
  static URL_MATTER_MOVE = `${Matter.URL_MATTER}/move`
  static URL_MATTER_UPLOAD = `${Matter.URL_MATTER}/upload`
  static URL_MATTER_ZIP = `${Matter.URL_MATTER}/zip`
  static URL_MATTER_CRAWL = `${Matter.URL_MATTER}/crawl`

  static MATTER_ROOT = 'root'

  constructor(obj?: IMatter) {
    super()
    obj && this.assign(obj)
  }

  // assign(obj: any) {
  //   super.assign(obj)
  //   // this.assignEntity('parent', Matter);
  //   // this.assignEntity('user', User);
  //   // this.assignEntity('visitTime', Date);
  //   // this.assignEntity('deleteTime', Date);
  // }

  isImage() {
    return FileUtil.isImage(this.name)
  }

  getPreviewUrl(downloadTokenUuid?: string): string {
    return `${EnvUtil.currentHost()}/api/alien/preview/${this.uuid}/${this.name}${downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : ''}`
  }

  getIcon() {
    if (FileUtil.isImage(this.name)) {
      return ImageUtil.handleImageUrl(this.getPreviewUrl(), false, 100, 100)
    } else {
      return FileUtil.getIcon(this.name, this.dir)
    }
  }

  getDownloadUrl(downloadTokenUuid?: string): string {
    return `${EnvUtil.currentHost()}/api/alien/download/${this.uuid}/${
      this.name
    }${downloadTokenUuid ? '?downloadTokenUuid=' + downloadTokenUuid : ''}`
  }

  getSharePreviewUrl(shareUuid: string, shareCode: string, shareRootUuid: string): string {
    return `${EnvUtil.currentHost()}/api/share/matter/preview?matterUuid=${
      this.uuid
    }&shareUuid=${shareUuid}&shareCode=${shareCode}&shareRootUuid=${shareRootUuid}`
  }

  getShareDownloadUrl(shareUuid: string, shareCode: string, shareRootUuid: string): string {
    return `${EnvUtil.currentHost()}/api/share/matter/download?matterUuid=${
      this.uuid
    }&shareUuid=${shareUuid}&shareCode=${shareCode}&shareRootUuid=${shareRootUuid}`
  }

  preview() {}

  httpTogglePrivacy() {
    return axios.post(Matter.URL_CHANGE_PRIVACY, {
      uuid: this.uuid,
      privacy: !this.privacy,
      spaceUuid: this.spaceUuid,
    })
  }

  httpSoftDelete() {
    return axios.post(Matter.URL_MATTER_SOFT_DELETE, { uuid: this.uuid, spaceUuid: this.spaceUuid })
  }

  httpHardDelete() {
    return axios.post(Matter.URL_MATTER_DELETE, { uuid: this.uuid, spaceUuid: this.spaceUuid })
  }

  httpRecover() {
    return axios.post(Matter.URL_MATTER_RECOVERY, {
      uuid: this.uuid,
    })
  }

  httpRename(name: string) {
    return axios.post(Matter.URL_MATTER_RENAME, {
      uuid: this.uuid,
      spaceUuid: this.spaceUuid,
      name,
    })
  }

  static httpCreateDirectory(body: { spaceUuid: string; puuid: string; name: string }) {
    return axios.post(Matter.URL_MATTER_CREATE_DIRECTORY, body)
  }

  static httpDetail(spaceUuid: string, uuid: string): Promise<IMatterDetail> {
    return axios.get(Matter.URL_MATTER_DETAIL, {
      params: {
        spaceUuid,
        uuid,
      },
    })
  }

  static httpList(params?: {
    page?: number
    pageSize?: number
    puuid?: string
    orderName?: SortDirection
    orderSize?: SortDirection
    orderUpdateTime?: SortDirection
    orderCreateTime?: SortDirection
    orderDir?: SortDirection
    deleted?: boolean
    spaceUuid?: string
    name?: string
  }): Promise<{
    data: IMatter[]
    totalItems: number
  }> {
    return axios.get(Matter.URL_MATTER_PAGE, { params })
  }
}
