import React from 'react';
import './SideLayout.less';
import TankComponent from '../../common/component/TankComponent';
import Preference from '../../common/model/preference/Preference';
import Moon from '../../common/model/global/Moon';
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from '../../common/model/global/Sun';
import { Link } from 'react-router-dom';
import { UserRole } from '../../common/model/user/UserRole';
import { Menu } from 'antd';
import MenuItem from '../../common/menu/MenuItem';
import User from '../../common/model/user/User';
import MenuManager from '../../common/menu/MenuManager';
import { InfoCircleOutlined } from '@ant-design/icons';
import Lang from '../../common/model/global/Lang';
import AboutModal from './widget/AboutModal';
import Capacity from './widget/Capacity';

interface IProps {}

interface IState {}

export default class SideLayout extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  onSelect(param: any) {
    if (param.key === 'about') {
      AboutModal.open();
      return;
    }

    let menuManager: MenuManager = MenuManager.getSingleton();
    menuManager.selectMenu(param.key);

    //打到对应的页面中。
    if (param.key == '/user/logout') {
      Sun.navigateTo('/user/login');
    } else {
      Sun.navigateTo(param.key);
    }

    this.updateUI();
  }

  render() {
    const menuManager: MenuManager = MenuManager.getSingleton();
    const menuItems: MenuItem[] = menuManager.getMenuItems();
    const preference: Preference = Moon.getSingleton().preference;
    const user: User = Moon.getSingleton().user;

    return (
      <div
        className={`layout-side ${
          Sun.getSingleton().showDrawer ? 'show-drawer' : ''
        }`}
      >
        {preference.installed ? (
          <div>
            <div className="avatar-area">
              <Link className="username-text" to={'/user/detail/' + user.uuid}>
                <img
                  alt="avatar"
                  className="avatar-middle"
                  src={user.getAvatarUrl()}
                />
              </Link>
            </div>
            <div className="username-area">
              {user.role === UserRole.GUEST ? (
                '未登录'
              ) : (
                <Link to={'/user/detail/' + user.uuid}>
                  <span className="username-text">{user.username}</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="install-area">
            <img alt="avatar" className="install-logo" src={DefaultLogoPng} />
          </div>
        )}

        <Menu
          theme="dark"
          selectedKeys={menuManager.getSelectedKeys()}
          onClick={this.onSelect.bind(this)}
          mode="inline"
        >
          {menuItems.map((menuItem: MenuItem, index: number) => {
            if (
              menuItem.url === '/bin/list' &&
              !preference.getRecycleBinStatus()
            )
              return null;
            return (
              <Menu.Item key={menuItem.url}>
                {menuItem.icon}
                <span>{menuItem.name}</span>
              </Menu.Item>
            );
          })}
          {Sun.getSingleton().isMobile && (
            <Menu.Item className="visible-xs" key="about">
              <InfoCircleOutlined />
              <span>{Lang.t('layout.about')}</span>
            </Menu.Item>
          )}
        </Menu>
        <Capacity />
      </div>
    );
  }
}
