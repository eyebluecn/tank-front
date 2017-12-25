import Menu from './Menu'
import {FeatureType} from '../model/feature/FeatureType'

export default class MenuManager {

}

//根据一个用户来获取他后台菜单。
MenuManager.refreshMenus = function (user) {

  let menus = []

  if (user.role === 'GUEST') {

    //登录
    let loginMenu = new Menu('登录', '/user/login', false, 'fa fa-user-circle-o')
    menus.push(loginMenu)

  } else {

    //首页
    let indexMenu = new Menu('首页', '/', false, 'fa fa-home')
    menus.push(indexMenu)

    //全部文件
    let matterListMenu = new Menu('全部文件', '/matter/list', false, 'fa fa-th')
    menus.push(matterListMenu)

    //标签列表
    let tagListMenu = new Menu('标签列表', '/tag/list', false, 'fa fa-tags')
    menus.push(tagListMenu)

    //网站设置
    let preferenceMenu = new Menu('网站偏好', '/preference', false, 'fa fa-dashboard')
    menus.push(preferenceMenu)

    //用户列表
    let userMenu = new Menu('用户列表', '/user/list', false, 'fa fa-user')
    menus.push(userMenu)

    //退出登录
    let logoutMenu = new Menu('退出登录', '/user/login', false, 'fa fa-power-off')
    menus.push(logoutMenu)

  }

  return menus
}

