import BaseEntity from '../../base/BaseEntity'
import Filter from '../../base/Filter'
import {FilterType} from "../../base/FilterType";
import User from "../../user/User";
import Matter from "../../matter/Matter";

export default class ImageCache extends BaseEntity {

  constructor(args) {
    super(args)

    this.userUuid = null;
    this.matterUuid = null;
    this.uri = null;
    this.md5 = null;
    this.size = 0;
    this.path = 0;
    this.user = new User()
    this.matter = new Matter()
  }

  render(obj) {
    super.render(obj)

  }

  getFilters() {
    return [
      ...super.getFilters(),
      new Filter(FilterType.INPUT, '用户Uuid', 'userUuid', null, null, false),
      new Filter(FilterType.INPUT, '文件Uuid', 'matterUuid', null, null, false)
    ]
  }

  getForm() {
    return {
      uuid: this.uuid ? this.uuid : null
    }
  }

  getName() {
    let quotePosition = this.uri.indexOf("?")
    let query = this.uri.substr(quotePosition + 1)
    let path = this.uri.substr(0, quotePosition)
    let imageName = path.substr(path.lastIndexOf("/") + 1)

    return imageName + "?" + query
  }

}
