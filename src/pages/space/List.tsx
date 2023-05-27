import React from 'react';
import TankComponent from '../../common/component/TankComponent';
import { RouteComponentProps } from 'react-router-dom';
import Pager from '../../common/model/base/Pager';
import Space, { FormValues } from '../../common/model/space/Space';
import { Button, Card, Col, Pagination, Progress, Row, Tooltip } from 'antd';
import './List.less';
import Lang from '../../common/model/global/Lang';
import ModalForm from './widget/ModalForm';
import TankTitle from '../widget/TankTitle';
import FileUtil from '../../common/util/FileUtil';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import { EditOutlined } from '@ant-design/icons';

interface IProps extends RouteComponentProps {}

interface IState {}
export default class List extends TankComponent<IProps, IState> {
  pager = new Pager<Space>(this, Space, Pager.MAX_PAGE_SIZE);
  modalState: {
    visible: boolean;
    mode: 'create' | 'edit';
    initialValues?: FormValues;
  } = {
    visible: false,
    mode: 'create',
  };

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.pager.enableHistory();
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

  handleConfirmModalForm(values: FormValues) {
    const space = new Space();
    space.assign(values);
    space.httpSave(
      () => {
        MessageBoxUtil.success(Lang.t('operationSuccess'));
        this.pager.httpList();
      },
      null,
      () => this.handleCancelModalForm()
    );
  }

  handleCancelModalForm() {
    this.modalState = {
      ...this.modalState,
      visible: false,
    };
    this.updateUI();
  }

  render() {
    const { pager, modalState } = this;

    return (
      <div className="page-space-list">
        <TankTitle name={Lang.t('space.name')}>
          <Button type="primary" onClick={() => this.handleCreate()}>
            {Lang.t('space.create')}
          </Button>
        </TankTitle>

        <Row gutter={[10, 10]}>
          {pager.data.map((space) => {
            const percent = space.totalSize! / space.totalSizeLimit!;

            return (
              <Col xs={24} sm={24} md={12} lg={8} key={space.uuid}>
                <Card className="space-item" size="small">
                  <div className="space-item-name-wrapper">
                    <div
                      className="space-item-name mb10 one-line mh15"
                      title={space.name!}
                    >
                      {space.name}
                    </div>
                    <EditOutlined
                      className="btn-edit hot-area"
                      onClick={() => this.handleEdit(space)}
                    />
                  </div>
                  <div className="space-item-percent">
                    <Tooltip
                      title={
                        <>
                          <div>
                            {Lang.t('space.sizeLimit')}：
                            {FileUtil.humanFileSize(space.sizeLimit!)}
                          </div>
                          <div>
                            {Lang.t('space.totalSize')}：
                            {FileUtil.humanFileSize(space.totalSize!)}
                          </div>
                          <div>
                            {Lang.t('space.totalSizeLimit')}：
                            {FileUtil.humanFileSize(space.totalSizeLimit!)}
                          </div>
                        </>
                      }
                    >
                      <Progress percent={percent * 100} />
                    </Tooltip>
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
        {modalState.visible && (
          <ModalForm
            mode={modalState.mode}
            initialValues={modalState.initialValues}
            onOk={this.handleConfirmModalForm.bind(this)}
            onCancel={() => this.handleCancelModalForm()}
          />
        )}
      </div>
    );
  }
}
