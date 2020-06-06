import React from 'react';
import {Link, Redirect, Route, RouteComponentProps, withRouter} from 'react-router-dom';

import './Frame.less';
import TankComponent from '../common/component/TankComponent';
import UserLogin from './user/Login';

import UserProfile from './user/Profile';
import MatterDetail from './matter/Detail';
import PreferenceIndex from './preference/Index';
import PreferenceEdit from './preference/Edit';

import MatterList from './matter/List';
import MatterEdit from './matter/Edit';

import {Layout, Menu} from 'antd';
import MenuManager from '../common/menu/MenuManager';
import MenuItem from '../common/menu/MenuItem';
import {SelectParam} from 'antd/lib/menu';
import LogoSvg from '../assets/image/logo.png';
import Index from './index/Index';
import User from '../common/model/user/User';
import Moon from '../common/model/global/Moon';
import Sun from '../common/model/global/Sun';
import {UserRole} from '../common/model/user/UserRole';
import FrameLoading from "./widget/FrameLoading";
import Preference from "../common/model/preference/Preference";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


interface IProps extends RouteComponentProps<{}> {

}

interface IState {

}


class RawFrame extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user;

  preference: Preference = Moon.getSingleton().preference;

  //是否已经完成初始化
  initialized: boolean = false

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {

    //装载全局的路由
    Sun.getSingleton().reactRouter = this.props.history;
    //装在全局Frame
    Sun.getSingleton().frameComponent = this

    this.initialize();

  }


  //获取当前登录者的信息
  initialize() {
    let that = this;

    this.preference.httpFetch(function () {

      let whitePaths = ['/user/login', '/user/register'];
      //如果当前本身是登录界面，那么不用去获取。
      if (whitePaths.indexOf(that.props.location.pathname) == -1) {

        that.user.httpInfo(null, null, function () {
          that.initialized = true
          that.updateUI();
        });

      } else {
        that.initialized = true
        that.updateUI();
      }

    })


  }

  onSelect(param: SelectParam) {
    let that = this;

    let menuManager: MenuManager = MenuManager.getSingleton();
    menuManager.selectMenu(param.key);

    //打到对应的页面中。
    if (param.key == '/user/logout') {
      this.props.history.push('/user/login');
    } else {
      this.props.history.push(param.key);
    }

    this.updateUI();
  }

  goHome() {
    this.props.history.push('/');
  }

  render() {

    let that = this;
    let menuManager: MenuManager = MenuManager.getSingleton();
    let menuItems: MenuItem[] = menuManager.getMenuItems();

    let user: User = that.user

    let content: React.ReactNode;

    if (that.initialized) {
      content = (
        <Layout style={{minHeight: '100vh'}}>
          <Sider>
            <div className="username">
              {user.role === UserRole.GUEST ?
                '未登录' :
                <Link className="username-text" to="/user/profile">{user.username}</Link>
              }
            </div>
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
          </Sider>
          <Layout>
            <Header>
              <div className="logo-title-area" onClick={this.goHome.bind(this)}>
                <img className="header-logo" src={LogoSvg} alt="logo"/>
                <span className="header-title">蓝眼云盘</span>
              </div>
            </Header>
            <Content>

              <div className="pages-content">
                <Route exact path="/" render={() =>
                  <Redirect to="/matter/list"/>
                }/>
                <Route path="/index" component={Index}/>
                <Route path="/user/login" component={UserLogin}/>
                <Route path="/user/profile" component={UserProfile}/>

                <Route path="/preference/index" component={PreferenceIndex}/>
                <Route path="/preference/edit" component={PreferenceEdit}/>

                <Route path="/matter/detail/:uuid" component={MatterDetail}/>
                <Route exact path="/matter" render={() =>
                  <Redirect to="/matter/list"/>
                }/>
                <Route path="/matter/list" component={MatterList}/>
                <Route path="/matter/create" component={MatterEdit}/>
                <Route path="/matter/edit/:uuid" component={MatterEdit}/>
              </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Eyeblue ©2020 Copyright</Footer>
          </Layout>
        </Layout>
      )
    } else {
      content = (
        <FrameLoading/>
      )
    }

    return (
      <div className="pages-frame">
        {content}
      </div>
    );
  }
}


const Frame = withRouter<IProps, React.ComponentType<IProps>>(RawFrame);
export default Frame;
