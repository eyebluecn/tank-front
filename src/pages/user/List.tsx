import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './List.less';
import SortDirection from '../../common/model/base/SortDirection';
import Pager from '../../common/model/base/Pager';
import StringUtil from '../../common/util/StringUtil';
import FileUtil from '../../common/util/FileUtil';
import DateUtil from '../../common/util/DateUtil';
import FilterPanel from '../widget/filter/FilterPanel';
import TableEmpty from '../widget/TableEmpty';
import User from '../../common/model/user/User';
import TankComponent from '../../common/component/TankComponent';
import TankTitle from '../widget/TankTitle';
import { ColumnProps } from 'antd/lib/table';
import { Button, Modal, Table, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  PlusOutlined,
  StopOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { UserRoleMap } from '../../common/model/user/UserRole';
import { UserStatus, UserStatusMap } from '../../common/model/user/UserStatus';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons/lib';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Color from '../../common/model/base/option/Color';
import TransfigurationModal from './widget/TransfigurationModal';
import Lang from '../../common/model/global/Lang';
import Moon from '../../common/model/global/Moon';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  //获取分页的一个帮助器
  pager: Pager<User> = new Pager<User>(this, User, 10);

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    //刷新一下列表
    let that = this;

    that.pager.enableHistory();

    that.refresh();
  }

  search() {
    let that = this;
    that.pager.page = 0;
    that.refresh();
  }

  refresh() {
    let that = this;

    //如果没有任何的排序，默认使用时间倒序
    if (!that.pager.getCurrentSortFilter()) {
      that.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    }

    that.pager.httpList();
  }

  toggleStatus(user: User) {
    let that = this;
    user.httpToggleStatus(function () {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
      that.updateUI();
    });
  }

  delete(user: User) {
    let that = this;
    Modal.confirm({
      title: Lang.t('user.deleteHint', user.username),
      icon: <ExclamationCircleFilled twoToneColor={Color.WARNING} />,
      onOk: () => {
        user.httpDel(function () {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          that.refresh();
        });
      },
    });
  }

  transfiguration(user: User) {
    let that = this;
    TransfigurationModal.open(user);
  }

  render() {
    let that = this;

    //router中传入的路由相关对象
    let match = this.props.match;

    //pager对象
    let pager = this.pager;

    let user: User = Moon.getSingleton().user;

    const columns: ColumnProps<User>[] = [
      {
        title: Lang.t('user.avatar'),
        dataIndex: 'avatarUrl',
        render: (text: any, record: User, index: number): React.ReactNode => (
          <Link to={StringUtil.prePath(match.path) + '/detail/' + record.uuid}>
            <img
              alt="avatar"
              className="avatar-small cursor"
              src={record.getAvatarUrl()}
            />
          </Link>
        ),
      },
      {
        title: Lang.t('user.username'),
        dataIndex: 'username',
        render: (text: any, record: User, index: number): React.ReactNode => {
          return (
            <div>
              <div>
                <Link
                  to={StringUtil.prePath(match.path) + '/detail/' + record.uuid}
                >
                  {record.username}
                </Link>
              </div>
              {user.uuid === record.uuid && (
                <div className="text-danger">(It's you)</div>
              )}
            </div>
          );
        },
      },
      {
        title: Lang.t('user.role'),
        dataIndex: 'role',
        render: (text: any, record: User, index: number): React.ReactNode => (
          <Tag color={UserRoleMap[record.role].color}>
            {UserRoleMap[record.role].name}
          </Tag>
        ),
      },
      {
        title: Lang.t('user.singleFileSizeLimit'),
        render: (text: any, record: User, index: number): React.ReactNode => (
          <span>{record.space?.getHumanizeSizeLimit()}</span>
        ),
      },
      {
        title: Lang.t('user.totalFileSize'),
        render: (text: any, record: User, index: number): React.ReactNode => (
          <span>{record.space?.getHumanizeTotalSize()}</span>
        ),
      },
      {
        title: Lang.t('user.totalFileSizeLimit'),
        render: (text: any, record: User, index: number): React.ReactNode => (
          <span>{record.space?.getHumanizeTotalSizeLimit()}</span>
        ),
      },
      {
        title: Lang.t('user.status'),
        dataIndex: 'status',
        render: (text: any, record: User, index: number): React.ReactNode => (
          <Tag color={UserStatusMap[record.status].color}>
            {UserStatusMap[record.status].name}
          </Tag>
        ),
      },
      {
        title: Lang.t('user.lastLogin'),
        dataIndex: 'lastTime',
        render: (text: any, record: User, index: number): React.ReactNode => (
          <div>
            <div>{record.lastIp}</div>
            <div>{DateUtil.simpleDateTime(record.lastTime)}</div>
          </div>
        ),
      },
      {
        title: Lang.t('createTime'),
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: pager.getDefaultSortOrder('createTime'),
        sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
        render: (text: any, record: User, index: number): React.ReactNode =>
          DateUtil.simpleDateTime(text),
      },
      {
        title: Lang.t('operation'),
        dataIndex: 'action',
        render: (text: any, record: User) => (
          <span>
            <Link
              title={Lang.t('edit')}
              to={StringUtil.prePath(match.path) + '/edit/' + record.uuid}
            >
              <Tooltip title={Lang.t('edit')}>
                <EditOutlined className="btn-action" />
              </Tooltip>
            </Link>

            {record.status === UserStatus.OK && record.uuid !== user.uuid && (
              <Tooltip title={Lang.t('user.disableUser')}>
                <StopOutlined
                  className="btn-action"
                  style={{ color: Color.DANGER }}
                  onClick={this.toggleStatus.bind(this, record)}
                />
              </Tooltip>
            )}

            {record.status === UserStatus.DISABLED &&
              record.uuid !== user.uuid && (
                <Tooltip title={Lang.t('user.activeUser')}>
                  <CheckCircleOutlined
                    className="btn-action"
                    style={{ color: Color.SUCCESS }}
                    onClick={this.toggleStatus.bind(this, record)}
                  />
                </Tooltip>
              )}

            {record.status === UserStatus.DISABLED &&
              record.uuid !== user.uuid && (
                <Tooltip title={Lang.t('user.deleteUser')}>
                  <DeleteOutlined
                    className="btn-action"
                    style={{ color: Color.DANGER }}
                    onClick={this.delete.bind(this, record)}
                  />
                </Tooltip>
              )}

            {record.uuid !== user.uuid && (
              <Tooltip title={Lang.t('user.transfiguration')}>
                <UserSwitchOutlined
                  className="btn-action"
                  style={{ color: Color.PRIMARY }}
                  onClick={this.transfiguration.bind(this, record)}
                />
              </Tooltip>
            )}
          </span>
        ),
      },
    ];

    return (
      <div className="page-user-list">
        <TankTitle name={Lang.t('layout.users')}>
          <Link to={'/user/create'}>
            <Button type={'primary'} icon={<PlusOutlined />}>
              {Lang.t('user.createUser')}
            </Button>
          </Link>
        </TankTitle>

        <div>
          <FilterPanel
            filters={pager.filters}
            onChange={this.search.bind(this)}
          />
        </div>
        <Table
          rowKey="uuid"
          loading={pager.loading}
          dataSource={pager.data}
          columns={columns}
          pagination={pager.getPagination()}
          onChange={pager.tableOnChange.bind(pager)}
          locale={{
            emptyText: (
              <TableEmpty pager={pager} onRefresh={this.refresh.bind(this)} />
            ),
          }}
        />
      </div>
    );
  }
}
