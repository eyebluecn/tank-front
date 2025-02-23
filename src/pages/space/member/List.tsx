import TankComponent from '../../../common/component/TankComponent';
import { Link, RouteComponentProps } from 'react-router-dom';
import Pager from '../../../common/model/base/Pager';
import SpaceMember from '../../../common/model/space/member/SpaceMember';
import Lang from '../../../common/model/global/Lang';
import { Button, Modal, Table, Tag, Tooltip, Typography } from 'antd';
import TankTitle from '../../widget/TankTitle';
import React from 'react';
import TableEmpty from '../../widget/TableEmpty';
import SortDirection from '../../../common/model/base/SortDirection';
import { ColumnsType } from 'antd/es/table';
import User from '../../../common/model/user/User';
import Moon from '../../../common/model/global/Moon';
import {
  SpaceMemberRole,
  SpaceMemberRoleMap,
} from '../../../common/model/space/member/SpaceMemberRole';
import DateUtil from '../../../common/util/DateUtil';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import Color from '../../../common/model/base/option/Color';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import ModalForm, { SpaceMemberModalFormValues } from './widget/ModalForm';

interface IProps
  extends RouteComponentProps<{
    spaceUuid: string;
  }> {}

interface IState {}
export default class SpaceMemberList extends TankComponent<IProps, IState> {
  spaceUuid = this.props.match.params.spaceUuid;
  pager = new Pager<SpaceMember>(this, SpaceMember, 10);
  currentUser: User = Moon.getSingleton().user;
  spaceMember = new SpaceMember(); // 当前用户在当前空间下的身份
  modalState: {
    visible: boolean;
    mode: 'create' | 'edit';
    targetSpaceMember?: SpaceMember;
  } = {
    visible: false,
    mode: 'create',
  };

  componentDidMount() {
    this.pager.enableHistory();
    this.pager.setFilterValue('spaceUuid', this.spaceUuid);
    this.spaceMember.httpMine(this.spaceUuid, () => this.updateUI());
    this.refresh();
  }

  handleCreate() {
    this.modalState = {
      visible: true,
      mode: 'create',
    };
    this.updateUI();
  }

  refresh() {
    //如果没有任何的排序，默认使用时间倒序
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    }
    this.pager.httpList();
  }

  handleEdit(spaceMember: SpaceMember) {
    this.modalState = {
      visible: true,
      mode: 'edit',
      targetSpaceMember: spaceMember,
    };
    this.updateUI();
  }

  handleDelete(spaceMember: SpaceMember) {
    Modal.confirm({
      title: Lang.t('space.unBindMemberHint'),
      icon: <ExclamationCircleFilled twoToneColor={Color.WARNING} />,
      cancelText: Lang.t('cancel'),
      okText: Lang.t('confirm'),
      onOk: () => {
        spaceMember.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.refresh();
        });
      },
    });
  }

  handleConfirmModalForm(values: SpaceMemberModalFormValues) {
    const spaceMember = new SpaceMember();
    const body = {
      spaceUuid: this.spaceUuid,
      role: values.role,
    };
    if (this.modalState.mode === 'edit') {
      spaceMember.httpEdit(
        {
          ...body,
          uuid: this.modalState.targetSpaceMember?.uuid!,
          userUuid: values.userUuids.join(','),
        },
        () => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.handleHideModalForm();
          this.refresh();
        }
      );
    } else {
      spaceMember.httpCreate(
        {
          ...body,
          userUuids: values.userUuids.join(','),
        },
        () => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.handleHideModalForm();
          this.refresh();
        }
      );
    }
  }

  handleHideModalForm() {
    this.modalState = {
      ...this.modalState,
      visible: false,
    };
    this.updateUI();
  }

  render() {
    const { pager, modalState } = this;

    const columns: ColumnsType<SpaceMember> = [
      {
        title: Lang.t('user.avatar'),
        dataIndex: 'user',
        responsive: ['md', 'lg', 'xl', 'xxl'],
        render: (user: User | null) => (
          <Link to={`/user/detail/${user?.uuid}`}>
            <img
              alt="avatar"
              className="avatar-small cursor"
              src={user?.getAvatarUrl()}
            />
          </Link>
        ),
      },
      {
        title: Lang.t('user.username'),
        dataIndex: 'user',
        render: (user: User | null) => {
          return (
            <div>
              <div>
                <Link to={`/user/detail/${user?.uuid}`}>{user?.username}</Link>
              </div>
              {this.currentUser.uuid === user?.uuid && (
                <div className="text-danger">(It's you)</div>
              )}
            </div>
          );
        },
      },
      {
        title: Lang.t('space.memberRole'),
        dataIndex: 'role',
        render: (role: SpaceMemberRole) => (
          <Tag color={SpaceMemberRoleMap[role]?.color}>
            {SpaceMemberRoleMap[role]?.name}
          </Tag>
        ),
      },
      {
        title: Lang.t('createTime'),
        dataIndex: 'createTime',
        responsive: ['md', 'lg', 'xl', 'xxl'],
        sorter: true,
        sortOrder: pager.getDefaultSortOrder('createTime'),
        sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
        render: (text: Date) => DateUtil.simpleDateTime(text),
      },
      {
        title: Lang.t('operation'),
        render: (_, record) =>
          this.spaceMember.role === SpaceMemberRole.ADMIN ? (
            <>
              <Tooltip title={Lang.t('edit')}>
                <Typography.Link>
                  <EditOutlined
                    className="btn-action"
                    onClick={() => this.handleEdit(record)}
                  />
                </Typography.Link>
              </Tooltip>
              <Tooltip title={Lang.t('space.unBindMember')}>
                <DeleteOutlined
                  className="btn-action"
                  style={{ color: Color.DANGER }}
                  onClick={() => this.handleDelete(record)}
                />
              </Tooltip>
            </>
          ) : null,
      },
    ];

    return (
      <div className="page-space-member-list">
        <TankTitle name={Lang.t('space.memberManage')}>
          {this.spaceMember.role === SpaceMemberRole.ADMIN && (
            <Button type="primary" onClick={() => this.handleCreate()}>
              {Lang.t('space.bindMember')}
            </Button>
          )}
        </TankTitle>
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
        {modalState.visible && (
          <ModalForm
            mode={modalState.mode}
            targetSpaceMember={modalState.targetSpaceMember}
            onOk={this.handleConfirmModalForm.bind(this)}
            onCancel={() => this.handleHideModalForm()}
          />
        )}
      </div>
    );
  }
}
