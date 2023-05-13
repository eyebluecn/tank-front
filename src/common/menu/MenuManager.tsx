/**
 * 管理当前所有的菜单
 */
import React from 'react';
import MenuItem from './MenuItem';
import Moon from '../model/global/Moon';
import User from '../model/user/User';
import { UserRole } from '../model/user/UserRole';
import Sun from '../../common/model/global/Sun';
import {
  AppstoreOutlined,
  CloudSyncOutlined,
  DashboardOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  SettingOutlined,
  ShareAltOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { LoginOutlined } from '@ant-design/icons/lib';
import Preference from '../model/preference/Preference';
import Lang from '../model/global/Lang';

export default class MenuManager {
  //单例模式
  private static singleton: MenuManager;

  constructor() {}

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
      })
      .map((menuItem: MenuItem, index: number) => {
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
    let preference: Preference = Moon.getSingleton().preference;

    let menuItems: MenuItem[] = [];

    if (!preference.installed) {
      menuItems = [
        new MenuItem(
          Lang.t('layout.install'),
          '/install/index',
          <SettingOutlined />
        ),
      ];
    } else if (user.role === UserRole.GUEST) {
      menuItems = [
        new MenuItem(Lang.t('user.login'), '/user/login', <LoginOutlined />),
      ];
    } else {
      menuItems.push(
        new MenuItem(
          Lang.t('layout.allFiles'),
          '/matter/list',
          <AppstoreOutlined />
        )
      );
      menuItems.push(
        new MenuItem(Lang.t('layout.space'), '/space', <CloudSyncOutlined />)
      );
      menuItems.push(
        new MenuItem(
          Lang.t('layout.myShare'),
          '/share/list',
          <ShareAltOutlined />
        )
      );
      menuItems.push(
        new MenuItem(Lang.t('layout.bin'), '/bin/list', <DeleteOutlined />)
      );

      if (user.role === UserRole.ADMINISTRATOR) {
        menuItems.push(
          new MenuItem(
            Lang.t('layout.setting'),
            '/preference/index',
            <SettingOutlined />
          )
        );
        menuItems.push(
          new MenuItem(
            Lang.t('layout.dashboard'),
            '/dashboard/index',
            <DashboardOutlined />
          )
        );
        menuItems.push(
          new MenuItem(
            Lang.t('layout.users'),
            `${Sun.getSingleton().isMobile ? '/mobile' : ''}/user/list`,
            <TeamOutlined />
          )
        );
      }
      menuItems.push(
        new MenuItem(
          Lang.t('layout.logout'),
          '/user/logout',
          <PoweroffOutlined />
        )
      );
    }

    return menuItems;
  }
}
