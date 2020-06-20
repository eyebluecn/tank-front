import React from 'react';
import "./SideLayout.less"
import TankComponent from "../../common/component/TankComponent";
import Preference from "../../common/model/preference/Preference";
import Moon from "../../common/model/global/Moon";
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from "../../common/model/global/Sun";
import {Link} from "react-router-dom";
import {UserRole} from "../../common/model/user/UserRole";
import {Menu} from "antd";
import MenuItem from "../../common/menu/MenuItem";
import User from "../../common/model/user/User";
import MenuManager from "../../common/menu/MenuManager";
import {SelectParam} from "antd/lib/menu";

interface IProps {

}

interface IState {

}


export default class SideLayout extends TankComponent <IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }


  onSelect(param: SelectParam) {
    let that = this;

    let menuManager: MenuManager = MenuManager.getSingleton();
    menuManager.selectMenu(param.key);

    //打到对应的页面中。
    if (param.key == '/user/logout') {
      Sun.navigateTo('/user/login')
    } else {
      Sun.navigateTo(param.key)
    }

    this.updateUI();
  }


  render() {

    let that = this

    let menuManager: MenuManager = MenuManager.getSingleton();
    let menuItems: MenuItem[] = menuManager.getMenuItems();
    let preference: Preference = Moon.getSingleton().preference
    let user: User = Moon.getSingleton().user

    console.log("当前头像1", user.avatarUrl)
    console.log("当前头像", user.getAvatarUrl())

    return (
      <div className={`layout-side ${Sun.getSingleton().showDrawer ? 'show-drawer' : ''}`}>

        {preference.installed ? (
          <div>
            <div className="avatar-area">
              <Link className="username-text" to={"/user/detail/" + user.uuid}>
                <img alt="avatar" className="avatar-middle" src={user.getAvatarUrl()}/>
              </Link>
            </div>
            <div className="username-area">
              {user.role === UserRole.GUEST ?
                '未登录' :
                <Link to={"/user/detail/" + user.uuid}>
                  <span className="username-text">{user.username}</span>
                </Link>
              }
            </div>
          </div>
        ) : (
          <div className="install-area">
            <img alt="avatar" className="install-logo" src={DefaultLogoPng}/>
          </div>
        )}

        <Menu
          theme="dark"
          selectedKeys={menuManager.getSelectedKeys()}
          onSelect={this.onSelect.bind(this)}
          mode="inline">
          {
            menuItems.map((menuItem: MenuItem, index: number) => {
              return (
                <Menu.Item key={menuItem.url}>
                  {menuItem.icon}
                  <span>{menuItem.name}</span>
                </Menu.Item>
              );
            })
          }
        </Menu>
      </div>
    )
  }
}

