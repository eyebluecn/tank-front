import React from 'react';
import './Detail.less';
import TankComponent from '../../common/component/TankComponent';
import { Button, Space, Tag } from 'antd';
import InfoCell from '../widget/InfoCell';
import User from '../../common/model/user/User';
import Moon from '../../common/model/global/Moon';
import DateUtil from '../../common/util/DateUtil';
import TankTitle from '../widget/TankTitle';
import TankContentCard from '../widget/TankContentCard';
import { Link, RouteComponentProps } from 'react-router-dom';
import ImagePreviewer from '../widget/previewer/ImagePreviewer';
import { UserRole, UserRoleMap } from '../../common/model/user/UserRole';
import FileUtil from '../../common/util/FileUtil';
import { UserStatus, UserStatusMap } from '../../common/model/user/UserStatus';
import BrowserUtil from '../../common/util/BrowserUtil';
import SingleTextModal from '../widget/SingleTextModal';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import ChangePasswordModal from './widget/ChangePasswordModal';
import {
  EditOutlined,
  UnlockOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import TransfigurationModal from './widget/TransfigurationModal';
import { FileSyncOutlined, StopOutlined } from '@ant-design/icons/lib';
import Lang from '../../common/model/global/Lang';
import Sun from '../../common/model/global/Sun';

interface RouteParam {
  uuid: string;
}

interface IProps extends RouteComponentProps<RouteParam> {}

interface IState {}

export default class Detail extends TankComponent<IProps, IState> {
  //登录的那个用户
  user: User = Moon.getSingleton().user;

  //当前页面正在编辑的用户
  currentUser: User = new User(this);

  //sync loading.
  syncLoading: boolean = false;

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let that = this;
    let match = this.props.match;
    this.currentUser.uuid = match.params.uuid;
    this.currentUser.httpDetail();
  }

  resetPassword() {
    let that = this;

    SingleTextModal.open(
      Lang.t('user.enterNewPassword'),
      '',
      function (text: string) {
        that.currentUser.httpResetPassword(text, function (response: any) {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
        });
      }
    );
  }

  transfiguration() {
    let user: User = this.user;
    let currentUser: User = this.currentUser;
    TransfigurationModal.open(currentUser);
  }

  toggleStatus() {
    let that = this;
    let user: User = this.user;
    let currentUser: User = this.currentUser;
    currentUser.httpToggleStatus(function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
      that.updateUI();
    });
  }

  syncPhysics() {
    let that = this;
    let user: User = this.user;
    let currentUser: User = this.currentUser;
    this.syncLoading = true;
    currentUser.httpScan(
      function () {
        MessageBoxUtil.success(Lang.t('operationSuccess'));
        that.updateUI();
      },
      null,
      function () {
        that.syncLoading = false;
        that.updateUI();
      }
    );
  }

  changePassword() {
    let user: User = this.user;
    let currentUser: User = this.currentUser;
    ChangePasswordModal.open(currentUser, function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
    });
  }

  render() {
    const user: User = this.user;
    const currentUser: User = this.currentUser;

    const handles = (
      <Space
        className={`handles ${
          Sun.getSingleton().isMobile ? 'handles-mobile' : ''
        }`}
      >
        {user.role === UserRole.ADMINISTRATOR && (
          <Button
            type="primary"
            icon={<UnlockOutlined />}
            onClick={this.resetPassword.bind(this)}
          >
            {Lang.t('user.resetPassword')}
          </Button>
        )}

        {user.role === UserRole.ADMINISTRATOR && (
          <Button
            type="primary"
            icon={<UserSwitchOutlined />}
            onClick={this.transfiguration.bind(this)}
          >
            {Lang.t('user.transfiguration')}
          </Button>
        )}

        {currentUser.uuid === user.uuid && (
          <Button
            type="primary"
            onClick={this.changePassword.bind(this)}
            icon={<UnlockOutlined />}
          >
            {Lang.t('user.changePassword')}
          </Button>
        )}

        <Link to={'/user/edit/' + currentUser.uuid}>
          <Button type="primary" icon={<EditOutlined />}>
            {Lang.t('edit')}
          </Button>
        </Link>

        {user.role === UserRole.ADMINISTRATOR &&
          currentUser.uuid !== user.uuid && (
            <Button
              type="primary"
              danger={currentUser.status === UserStatus.OK}
              icon={<StopOutlined />}
              onClick={this.toggleStatus.bind(this)}
            >
              {currentUser.status === UserStatus.OK
                ? Lang.t('user.disable')
                : Lang.t('user.active')}
            </Button>
          )}

        {user.role === UserRole.ADMINISTRATOR && (
          <Button
            type="primary"
            icon={<FileSyncOutlined />}
            loading={this.syncLoading}
            onClick={this.syncPhysics.bind(this)}
          >
            {Lang.t('user.sync')}
          </Button>
        )}
      </Space>
    );

    return (
      <div className="page-user-detail">
        <TankTitle name={Lang.t('user.profile')}>
          {!Sun.getSingleton().isMobile && handles}
        </TankTitle>
        {Sun.getSingleton().isMobile && handles}

        <TankContentCard loading={currentUser.detailLoading}>
          <div className="text-center mv20">
            <img
              className="avatar-large"
              alt="avatar"
              src={currentUser.getAvatarUrl()}
              onClick={() => {
                ImagePreviewer.showSinglePhoto(currentUser.getAvatarUrl(true));
              }}
            />
            <div className="f24">{currentUser.username}</div>
          </div>

          <InfoCell name={Lang.t('user.role')}>
            <Tag color={UserRoleMap[currentUser.role].color}>
              {UserRoleMap[currentUser.role].name}
            </Tag>
          </InfoCell>

          <InfoCell name={Lang.t('user.singleFileSizeLimit')}>
            {currentUser.space?.getHumanizeSizeLimit()}
          </InfoCell>

          <InfoCell name={Lang.t('user.totalFileSizeLimit')}>
            {currentUser.space?.getHumanizeTotalSizeLimit()}
          </InfoCell>

          <InfoCell name={Lang.t('user.totalFileSize')}>
            {currentUser.space?.getHumanizeTotalSize()}
          </InfoCell>

          <InfoCell name={Lang.t('user.status')}>
            <Tag color={UserStatusMap[currentUser.status].color}>
              {UserStatusMap[currentUser.status].name}
            </Tag>
          </InfoCell>

          <InfoCell name={Lang.t('user.lastLoginIp')}>
            {currentUser.lastIp}
          </InfoCell>

          <InfoCell name={Lang.t('user.lastLoginTime')}>
            {DateUtil.simpleDateTime(currentUser.lastTime)}
          </InfoCell>

          <InfoCell name={Lang.t('user.webdavLink')}>
            {BrowserUtil.fullHost() + '/api/dav'}
          </InfoCell>

          {currentUser.role === UserRole.ADMINISTRATOR && (
            <InfoCell name={Lang.t('user.docLink')}>
              <a
                className="f14"
                href="https://tank-doc.eyeblue.cn"
                target="_blank"
              >
                https://tank-doc.eyeblue.cn
              </a>
            </InfoCell>
          )}
        </TankContentCard>
      </div>
    );
  }
}
