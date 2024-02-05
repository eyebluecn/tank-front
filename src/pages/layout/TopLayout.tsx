import React from 'react';
import './TopLayout.less';
import TankComponent from '../../common/component/TankComponent';
import Preference from '../../common/model/preference/Preference';
import Moon from '../../common/model/global/Moon';
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from '../../common/model/global/Sun';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons/lib';
import ImageUtil from '../../common/util/ImageUtil';
import { Link } from 'react-router-dom';
import User from '../../common/model/user/User';

interface IProps {}

interface IState {}

export default class TopLayout extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  goHome() {
    Sun.navigateTo('/');
  }

  //logo可以使用自定义的。
  logoUrl() {
    let preference: Preference = Moon.getSingleton().preference;
    if (preference.logoUrl) {
      return ImageUtil.handleImageUrl(preference.logoUrl, false, 200, 200);
    } else {
      return DefaultLogoPng;
    }
  }

  toggleDrawer() {
    Sun.getSingleton().showDrawer = !Sun.getSingleton().showDrawer;
    Sun.updateFrame();
  }

  render() {
    let that = this;
    const user: User = Moon.getSingleton().user;

    let preference: Preference = Moon.getSingleton().preference;
    return (
      <div className="layout-top">
        <div className="logo-title-area" onClick={this.goHome.bind(this)}>
          <img className="header-logo" src={this.logoUrl()} alt="logo" />
          <span className="header-title">{preference.name}</span>
        </div>

        <div className="drawer-trigger">
          {Sun.getSingleton().showDrawer ? (
            <MenuFoldOutlined onClick={this.toggleDrawer.bind(this)} />
          ) : (
            <MenuUnfoldOutlined onClick={this.toggleDrawer.bind(this)} />
          )}
        </div>

        {preference.installed ? (
          <div>
            <div className="avatar-area" onMouseEnter={()=>{
              <span className="username-text">{user.username}</span>
            }}>
              <Link className="username-text" to={'/user/detail/' + user.uuid}>
                <img
                  alt="avatar"
                  className="avatar-middle"
                  src={user.getAvatarUrl()}
                />
              </Link>
            </div>
          </div>
        ) :null}
      </div>
    );
  }
}
