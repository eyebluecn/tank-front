import React from 'react';
import TankComponent from '../../common/component/TankComponent';
import { RouteComponentProps } from 'react-router-dom';
import Pager from '../../common/model/base/Pager';
import Space, { SpaceFormValues } from '../../common/model/space/Space';
import {
  Button,
  Card,
  Col,
  Pagination,
  Progress,
  Row,
  Space as AntdSpace,
  Modal,
  Empty,
  Tooltip,
} from 'antd';
import './List.less';
import Lang from '../../common/model/global/Lang';
import ModalForm from './widget/ModalForm';
import TankTitle from '../widget/TankTitle';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import {
  EditOutlined,
  ExclamationCircleFilled,
  RestOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons/lib';
import Color from '../../common/model/base/option/Color';
import SafeUtil from '../../common/util/SafeUtil';
import Moon from '../../common/model/global/Moon';

interface IProps extends RouteComponentProps {}

interface IState {}
export default class List extends TankComponent<IProps, IState> {
  user = Moon.getSingleton().user;
  pager = new Pager<Space>(this, Space, Pager.MAX_PAGE_SIZE);
  modalState: {
    visible: boolean;
    mode: 'create' | 'edit';
    initialValues?: SpaceFormValues;
  } = {
    visible: false,
    mode: 'create',
  };

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.pager.enableHistory();
    this.pager.setFilterValue('type', 'SHARED'); // 列表只展示共享空间
    this.pager.httpList();
  }

  changePage(page: number) {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  }

  handleCreate() {
    this.modalState = {
      visible: true,
      mode: 'create',
    };
    this.updateUI();
  }

  handleEdit(space: Space) {
    this.modalState = {
      visible: true,
      mode: 'edit',
      initialValues: space.getForm(),
    };
    this.updateUI();
  }

  handleConfirmModalForm(values: SpaceFormValues) {
    const space = new Space();
    space.assign(values);
    space.httpSave(
      () => {
        MessageBoxUtil.success(Lang.t('operationSuccess'));
        this.pager.httpList();
      },
      null,
      () => this.handleHideModalForm()
    );
  }

  handleHideModalForm() {
    this.modalState = {
      ...this.modalState,
      visible: false,
    };
    this.updateUI();
  }

  handleDelete(space: Space) {
    Modal.confirm({
      title: Lang.t('space.deleteHint'),
      icon: <ExclamationCircleFilled twoToneColor={Color.WARNING} />,
      cancelText: Lang.t('cancel'),
      okText: Lang.t('confirm'),
      onOk: () => {
        space.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.pager.httpList();
        });
      },
    });
  }
  handleSpaceMember(space: Space) {
    this.props.history.push(`/space/${space.uuid}/member`);
  }

  handleSpaceRecycleBin(space: Space) {
    this.props.history.push(`/space/${space.uuid}/bin/list`);
  }

  handleSpaceMatterList(space: Space) {
    this.props.history.push(`/space/${space.uuid}/matter/list`);
  }

  render() {
    const { pager, modalState } = this;

    return (
      <div className="page-space-list">
        <TankTitle name={Lang.t('space.name')}>
          {this.user.isAdmin() && (
            <Button type="primary" onClick={() => this.handleCreate()}>
              {Lang.t('space.create')}
            </Button>
          )}
        </TankTitle>

        <Row gutter={[10, 10]}>
          {pager.data.map((space) => {
            return (
              <Col xs={24} sm={24} md={12} lg={8} key={space.uuid}>
                <Card
                  className="space-item"
                  size="small"
                  onClick={() => this.handleSpaceMatterList(space)}
                >
                  <div className="space-item-name-wrapper mb10">
                    <div
                      className="space-item-name one-line"
                      title={space.name!}
                    >
                      {space.name}
                    </div>
                    <AntdSpace className="space-item-icons">
                      <Tooltip title={Lang.t('space.memberManage')}>
                        <TeamOutlined
                          className="btn-action btn-member"
                          onClick={(e) =>
                            SafeUtil.stopPropagationWrap(e)(
                              this.handleSpaceMember(space)
                            )
                          }
                        />
                      </Tooltip>

                      <Tooltip title={Lang.t('space.bin')}>
                        <RestOutlined
                          className="btn-action btn-bin"
                          onClick={(e) =>
                            SafeUtil.stopPropagationWrap(e)(
                              this.handleSpaceRecycleBin(space)
                            )
                          }
                        />
                      </Tooltip>

                      {this.user.isAdmin() && (
                        <>
                          <Tooltip title={Lang.t('space.edit')}>
                            <EditOutlined
                              className="btn-action btn-edit"
                              onClick={(e) =>
                                SafeUtil.stopPropagationWrap(e)(
                                  this.handleEdit(space)
                                )
                              }
                            />
                          </Tooltip>

                          <Tooltip title={Lang.t('space.delete')}>
                            <DeleteOutlined
                              className="btn-action btn-del"
                              onClick={(e) =>
                                SafeUtil.stopPropagationWrap(e)(
                                  this.handleDelete(space)
                                )
                              }
                            />
                          </Tooltip>
                        </>
                      )}
                    </AntdSpace>
                  </div>
                  <div className="space-item-percent">
                    <div>
                      {Lang.t('space.sizeLimit')}：
                      {space.getHumanizeSizeLimit()}
                    </div>
                    <div>
                      {space.getHumanizeTotalSize()} /{' '}
                      {space.getHumanizeTotalSizeLimit()}
                    </div>
                    <Progress percent={Math.round(space.getUsedPercent())} />
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Pagination
          className="space-pagination pull-right"
          onChange={this.changePage.bind(this)}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />

        {pager.isEmpty() && <Empty description={Lang.t('space.emptyHint')} />}

        {modalState.visible && (
          <ModalForm
            mode={modalState.mode}
            initialValues={modalState.initialValues}
            onOk={this.handleConfirmModalForm.bind(this)}
            onCancel={() => this.handleHideModalForm()}
          />
        )}
      </div>
    );
  }
}
