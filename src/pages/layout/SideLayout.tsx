import React from 'react';
import './SideLayout.less';
import TankComponent from '../../common/component/TankComponent';
import Preference from '../../common/model/preference/Preference';
import Moon from '../../common/model/global/Moon';
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from '../../common/model/global/Sun';
import { Link } from 'react-router-dom';
import { UserRole } from '../../common/model/user/UserRole';
import { Menu, Button, Dropdown } from 'antd';
import MenuItem from '../../common/menu/MenuItem';
import User from '../../common/model/user/User';
import MenuManager from '../../common/menu/MenuManager';
import { InfoCircleOutlined, PlusOutlined, CloudUploadOutlined, UploadOutlined, FolderOutlined} from '@ant-design/icons';
import Lang from '../../common/model/global/Lang';
import AboutModal from './widget/AboutModal';
import Capacity from './widget/Capacity';
import Matter from '../../common/model/matter/Matter';
import Director from '../matter/widget/Director';
import MatterPanel from '../matter/widget/MatterPanel';
import List from '../matter/List'

interface IProps {
  spaceUuid?: string;
}

interface IState {}

export default class SideLayout extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  uploadDirectoryBtnRef = React.createRef<HTMLElement>(); 
  //准备新建的文件
  newMatter = new Matter();
  director = new Director();
  newMatterRef = React.createRef<MatterPanel>();
  currentDirectory = new Matter();
  user = Moon.getSingleton().user;
  //listComponent = new List();

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

  getSpaceUuid() {
    if (this.props.spaceUuid) return this.props.spaceUuid;
    return this.user.spaceUuid!;
  }

  createDirectory() {
    this.newMatter.name = 'matter.allFiles';
    this.newMatter.dir = true;
    this.newMatter.editMode = true;
    this.newMatter.puuid = this.currentDirectory.uuid || Matter.MATTER_ROOT;
    this.newMatter.spaceUuid = this.getSpaceUuid();
    this.director.createMode = true;

    this.updateUI();
    setTimeout(() => this.newMatterRef.current!.highLight());
  }


  render() {
    const menuManager: MenuManager = MenuManager.getSingleton();
    const menuItems: MenuItem[] = menuManager.getMenuItems();
    const preference: Preference = Moon.getSingleton().preference;

    return (
      <div
        className={`layout-side ${
          Sun.getSingleton().showDrawer ? 'show-drawer' : ''
        }`}
      >

        {/*
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
        */}

        <div className="blank-space">
            
        </div>


        <Menu
          theme="light"
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
