/**
 * 管理当前所有的菜单
 */
import MenuItem from './MenuItem';
import Moon from '../model/global/Moon';
import User from '../model/user/User';
import { UserRole } from '../model/user/UserRole';

export default class MenuManager {

  //单例模式
  private static singleton: MenuManager;


  constructor() {


  }

  static getSingleton(): MenuManager {
    if (!MenuManager.singleton) {
      //初始化一个mainLand.
      MenuManager.singleton = new MenuManager();

    }
    return MenuManager.singleton;
  }

  /**
   * 获取到当前高亮的菜单
   */
  getSelectedKeys(): string[] {

    let keys: string[] = this.getMenuItems()
      .filter((menuItem: MenuItem, index: number) => {
        return menuItem.active;
      }).map((menuItem: MenuItem, index: number) => {
        return menuItem.url;
      });

    return keys;
  }

  /**
   * 高亮某个菜单
   */
  selectMenu(url: string) {

    this.getMenuItems().forEach((menuItem: MenuItem, index: number) => {
      menuItem.active = menuItem.url === url;
    });

  }

  getMenuItems(): MenuItem[] {
    let user: User = Moon.getSingleton().user;

    let menuItems: MenuItem[] = [];

    if (user.role === UserRole.GUEST) {
      menuItems = [
        new MenuItem('登录', '/user/login', 'user'),
      ];
    } else {
      menuItems = [
        new MenuItem('文章', '/article/list', 'bar-chart'),
        new MenuItem('退出', '/user/logout', 'poweroff'),
      ];
    }

    return menuItems;

  }

}
