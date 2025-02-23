import React from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';

import './Frame.less';
import TankComponent from '../common/component/TankComponent';
import UserLogin from './user/Login';
import UserRegister from './user/Register';

import UserList from './user/List';
import MobileUserList from './user/MobileList';
import UserDetail from './user/Detail';
import UserEdit from './user/Edit';
import UserAuthentication from './user/Authentication';

import PreferenceIndex from './preference/Index';
import PreferenceEdit from './preference/Edit';
import PreferenceEngineEdit from './preference/PreviewEngineEdit';
import PreferenceScanEdit from './preference/ScanEdit';

import DashboardIndex from './dashboard/Index';
import InstallIndex from './install/Index';

import MatterList from './matter/List';
import MatterDetail from './matter/Detail';

import BinList from './bin/List';

import ShareList from './share/List';
import ShareDetail from './share/Detail';
import User from '../common/model/user/User';
import Moon from '../common/model/global/Moon';
import Sun from '../common/model/global/Sun';
import FrameLoading from './widget/FrameLoading';
import Preference from '../common/model/preference/Preference';
import { WebResultCode } from '../common/model/base/WebResultCode';
import MessageBoxUtil from '../common/util/MessageBoxUtil';
import BottomLayout from './layout/BottomLayout';
import SideLayout from './layout/SideLayout';
import TopLayout from './layout/TopLayout';
import ContentLayout from './layout/ContentLayout';

import SpaceList from './space/List';
import SpaceMemberList from './space/member/List';
import SpaceMatterList from './space/matter/List';

interface IProps extends RouteComponentProps<{}> {}

interface IState {}

class RawFrame extends TankComponent<IProps, IState> {
  user: User = Moon.getSingleton().user;

  preference: Preference = Moon.getSingleton().preference;

  //是否已经完成初始化
  initialized: boolean = false;

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    //装载全局的路由
    Sun.getSingleton().reactRouter = this.props.history;
    //装在全局Frame
    Sun.getSingleton().frameComponent = this;

    this.initialize();
  }

  //获取当前登录者的信息
  initialize() {
    let that = this;
    let pathname: string = that.props.location.pathname;

    this.preference.httpFetch(
      function () {
        // 白名单，不要求登录
        let whitePaths = [
          '/user/login',
          '/user/register',
          '/user/authentication',
        ];
        // 尝试登录名单，登录失败不做处理
        let tryLoginPaths = ['/share/detail'];

        if (whitePaths.findIndex((path) => pathname.startsWith(path)) >= 0) {
          that.initialized = true;
          that.updateUI();
        } else if (
          tryLoginPaths.findIndex((path) => pathname.startsWith(path)) >= 0
        ) {
          that.user.httpInfo(false, function () {
            that.initialized = true;
            that.updateUI();
          });
        } else {
          that.user.httpInfo(true, function () {
            that.initialized = true;
            that.updateUI();
          });
        }
      },
      function (errMessage: string, response: any) {
        that.initialized = true;
        that.updateUI();
        if (
          response &&
          response.data &&
          response.data['code'] === WebResultCode.NOT_INSTALLED
        ) {
          MessageBoxUtil.warning('网站尚未安装，即将引导进入安装页面！');
          that.preference.installed = false;
          Sun.navigateTo('/install/index');
        }
      }
    );
  }

  render() {
    let content: React.ReactNode;

    if (this.initialized) {
      content = (
        <div className="pages-frame-inner">
          <SideLayout />

          <TopLayout />

          <ContentLayout>
            {this.preference.installed ? (
              <div className="pages-content">
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/matter/list" />}
                />
                <Route path="/user/login" component={UserLogin} />
                <Route path="/user/register" component={UserRegister} />
                <Route path="/user/detail/:uuid" component={UserDetail} />
                <Route path="/user/list" component={UserList} />
                <Route path="/mobile/user/list" component={MobileUserList} />
                <Route path="/user/create" component={UserEdit} />
                <Route path="/user/edit/:uuid" component={UserEdit} />
                <Route
                  path="/user/authentication/:authentication"
                  component={UserAuthentication}
                />

                <Route path="/dashboard/index" component={DashboardIndex} />

                <Route path="/preference/index" component={PreferenceIndex} />
                <Route path="/preference/edit" component={PreferenceEdit} />
                <Route
                  path="/preference/engine/edit"
                  component={PreferenceEngineEdit}
                />
                <Route
                  path="/preference/scan/edit"
                  component={PreferenceScanEdit}
                />

                <Route path="/matter/detail/:uuid" component={MatterDetail} />
                <Route
                  exact
                  path="/matter"
                  render={() => <Redirect to="/matter/list" />}
                />
                <Route path="/matter/list" component={MatterList} />

                <Route path="/share/list" component={ShareList} />
                <Route path="/share/detail/:uuid" component={ShareDetail} />

                <Route path="/bin/list" component={BinList} />
                <Route path="/space" exact component={SpaceList} />
                <Route
                  path="/space/:spaceUuid/member"
                  exact
                  component={SpaceMemberList}
                />
                <Route
                  path="/space/:spaceUuid/matter/list"
                  exact
                  component={SpaceMatterList}
                />
                <Route
                  path="/space/:spaceUuid/matter/detail/:uuid"
                  exact
                  component={MatterDetail}
                />
                <Route
                  path="/space/:spaceUuid/bin/list"
                  exact
                  component={BinList}
                />
              </div>
            ) : (
              <div className="pages-content">
                <Route path="/install/index" component={InstallIndex} />
              </div>
            )}
          </ContentLayout>

          <BottomLayout />
        </div>
      );
    } else {
      content = <FrameLoading />;
    }

    return <div className="pages-frame">{content}</div>;
  }
}

const Frame = withRouter<IProps, React.ComponentType<IProps>>(RawFrame);
export default Frame;
