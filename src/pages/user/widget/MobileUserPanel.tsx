import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import InfoCell from '../../widget/InfoCell';
import Lang from '../../../common/model/global/Lang';
import User from '../../../common/model/user/User';
import { Link } from 'react-router-dom';
import { UserRoleMap } from '../../../common/model/user/UserRole';
import { Tag, Tooltip } from 'antd';
import FileUtil from '../../../common/util/FileUtil';
import {
  UserStatus,
  UserStatusMap,
} from '../../../common/model/user/UserStatus';
import DateUtil from '../../../common/util/DateUtil';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  StopOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import Color from '../../../common/model/base/option/Color';
import Expanding from '../../widget/Expanding';
import './MobileUserPanel.less';
import SafeUtil from '../../../common/util/SafeUtil';
import Sun from '../../../common/model/global/Sun';

interface IProps {
  user: User;
  isCurrentUser: boolean;
  onToggleStatus: (user: User) => any;
  onDelete: (user: User) => any;
  onTransfiguration: (user: User) => any;
}

interface IState {}

export default class MobileUserPanel extends TankComponent<IProps, IState> {
  // 小屏幕下操作栏
  showMore: boolean = false;

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  clickRow() {
    Sun.navigateTo(`/user/detail/${this.props.user.uuid}`);
  }

  toggleHandles() {
    this.showMore = !this.showMore;
    this.updateUI();
  }

  render() {
    const { user, isCurrentUser } = this.props;

    return (
      <div className="mobile-user">
        <div className="panel" onClick={() => this.clickRow()}>
          <img className="avatar" src={user.getAvatarUrl()} />
          <p className="username one-line">{user.username}</p>
          <Tag color={UserRoleMap[user.role].color}>
            {UserRoleMap[user.role].name}
          </Tag>
          <EllipsisOutlined
            className="btn-action navy f18 hot-area"
            onClick={(e) =>
              SafeUtil.stopPropagationWrap(e)(this.toggleHandles())
            }
          />
        </div>

        <Expanding>
          {this.showMore ? (
            <div className="ml10 panel-detail">
              <InfoCell name={Lang.t('user.singleFileSizeLimit')}>
                <span>{user.space?.getHumanizeSizeLimit()}</span>
              </InfoCell>
              <InfoCell name={Lang.t('user.totalFileSize')}>
                <span>{user.space?.getHumanizeTotalSize()}</span>
              </InfoCell>
              <InfoCell name={Lang.t('user.totalFileSizeLimit')}>
                <span>{user.space?.getHumanizeTotalSizeLimit()}</span>
              </InfoCell>
              <InfoCell name={Lang.t('user.status')}>
                <Tag color={UserStatusMap[user.status].color}>
                  {UserStatusMap[user.status].name}
                </Tag>
              </InfoCell>
              <InfoCell name={Lang.t('user.lastLogin')}>
                <div>
                  <div>{user.lastIp}</div>
                  <div>{DateUtil.simpleDateTime(user.lastTime)}</div>
                </div>
              </InfoCell>
              <InfoCell name={Lang.t('createTime')}>
                <span>{DateUtil.simpleDateTime(user.createTime)}</span>
              </InfoCell>
              <InfoCell name={Lang.t('operation')}>
                <div>
                  <Link title={Lang.t('edit')} to={'/user/edit/' + user.uuid}>
                    <Tooltip title={Lang.t('edit')}>
                      <EditOutlined className="btn-action" />
                    </Tooltip>
                  </Link>
                  {user.status === UserStatus.OK && !isCurrentUser && (
                    <Tooltip title={Lang.t('user.disableUser')}>
                      <StopOutlined
                        className="btn-action"
                        style={{ color: Color.DANGER }}
                        onClick={() => this.props.onToggleStatus(user)}
                      />
                    </Tooltip>
                  )}
                  {user.status === UserStatus.DISABLED && !isCurrentUser && (
                    <>
                      <Tooltip title={Lang.t('user.activeUser')}>
                        <CheckCircleOutlined
                          className="btn-action"
                          style={{ color: Color.SUCCESS }}
                          onClick={() => this.props.onToggleStatus(user)}
                        />
                      </Tooltip>
                      <Tooltip title={Lang.t('user.deleteUser')}>
                        <DeleteOutlined
                          className="btn-action"
                          style={{ color: Color.DANGER }}
                          onClick={() => this.props.onDelete(user)}
                        />
                      </Tooltip>
                    </>
                  )}
                  {!isCurrentUser && (
                    <Tooltip title={Lang.t('user.transfiguration')}>
                      <UserSwitchOutlined
                        className="btn-action"
                        style={{ color: Color.PRIMARY }}
                        onClick={() => this.props.onTransfiguration(user)}
                      />
                    </Tooltip>
                  )}
                </div>
              </InfoCell>
            </div>
          ) : null}
        </Expanding>
      </div>
    );
  }
}
