import React from 'react';
import './TopLayout.less';
import TankComponent from '../../common/component/TankComponent';
import Preference from '../../common/model/preference/Preference';
import Moon from '../../common/model/global/Moon';
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from '../../common/model/global/Sun';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons/lib';
import ImageUtil from '../../common/util/ImageUtil';

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
      </div>
    );
  }
}
