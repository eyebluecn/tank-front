import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './List.less';
import TankComponent from '../../common/component/TankComponent';
import Pager from '../../common/model/base/Pager';
import Matter from '../../common/model/matter/Matter';
import Moon from '../../common/model/global/Moon';
import SortDirection from '../../common/model/base/SortDirection';
import {
  Button,
  Col,
  Empty,
  Input,
  Modal,
  Pagination,
  Row,
  Space as AntdSpace,
} from 'antd';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import {
  CloseCircleOutlined,
  ExclamationCircleFilled,
  MinusSquareOutlined,
  PlusSquareOutlined,
  RedoOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import ImagePreviewer from '../widget/previewer/ImagePreviewer';
import { UserRole } from '../../common/model/user/UserRole';
import Lang from '../../common/model/global/Lang';
import BinMatterPanel from './widget/BinMatterPanel';
import Sun from '../../common/model/global/Sun';
import Space from '../../common/model/space/Space';
import BreadcrumbPanel from '../widget/BreadcrumbPanel';
import BreadcrumbModel from '../../common/model/base/option/BreadcrumbModel';
import SpaceMember from '../../common/model/space/member/SpaceMember';
import { SpaceMemberRole } from '../../common/model/space/member/SpaceMemberRole';

interface IProps
  extends RouteComponentProps<{
    spaceUuid?: string;
  }> {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  //当前空间信息
  space = new Space();
  // 当前用户在当前空间下的成员信息
  spaceMember = new SpaceMember();
  //当前文件夹信息。
  matter = new Matter();
  //当前选中的文件
  selectedMatters: Matter[] = [];
  //获取分页的一个帮助器
  pager = new Pager<Matter>(this, Matter, Pager.MAX_PAGE_SIZE);
  user = Moon.getSingleton().user;
  preference = Moon.getSingleton().preference;

  constructor(props: IProps) {
    super(props);
  }

  initSpace() {
    if (this.props.match.params.spaceUuid) {
      this.space.uuid = this.props.match.params.spaceUuid;
      this.space.httpDetail(() => this.updateUI());
      this.spaceMember.httpMine(this.props.match.params.spaceUuid, () =>
        this.updateUI()
      );
    }
  }

  // 如果在空间下，有些操作权限只对管理员和读写成员开放
  checkHandlePermission() {
    if (!this.props.match.params.spaceUuid) return true;
    return [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(
      this.spaceMember.role!
    );
  }

  componentDidMount() {
    this.initSpace();
    //刷新一下列表
    if (this.user.role === UserRole.ADMINISTRATOR) {
      this.pager.getFilter('userUuid')!.visible = true;
    } else {
      this.pager.setFilterValue('userUuid', this.user.uuid);
    }
    this.pager.enableHistory();
    this.refresh();
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    if (this.props.location.search !== nextProps.location.search) {
      this.pager.enableHistory();
      this.refresh();
    }
  }

  refresh() {
    // 清空暂存区
    this.selectedMatters = [];
    // 刷新文件列表
    this.refreshPager();
  }

  refreshPager() {
    //如果没有任何的排序，默认使用时间倒序和文件夹在顶部
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue('orderDeleteTime', SortDirection.DESC);
      this.pager.setFilterValue('orderDir', SortDirection.DESC);
    }

    // 如果在共享空间中
    if (this.props.match.params.spaceUuid) {
      this.pager.setFilterValue('spaceUuid', this.props.match.params.spaceUuid);
    }

    // 过滤掉被软删除的文件
    this.pager.setFilterValue('deleted', true);

    this.pager.httpList();
  }

  checkMatter(matter?: Matter) {
    if (matter) {
      if (matter.check) {
        this.selectedMatters.push(matter);
      } else {
        const index = this.selectedMatters.findIndex(
          (item) => item.uuid === matter.uuid
        );
        this.selectedMatters.splice(index, 1);
      }
    } else {
      //统计所有的勾选
      this.selectedMatters = [];
      this.pager.data.forEach((matter) => {
        if (matter.check) {
          this.selectedMatters.push(matter);
        }
      });
    }
    this.updateUI();
  }

  checkAll() {
    this.pager.data.forEach((i) => {
      i.check = true;
    });
    this.checkMatter();
  }

  checkNone() {
    this.pager.data.forEach((i) => {
      i.check = false;
    });
    this.checkMatter();
  }

  getSpaceUuid() {
    if (this.props.match.params.spaceUuid) {
      return this.props.match.params.spaceUuid;
    }
    return this.user.spaceUuid!;
  }

  deleteBatch() {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedMatters.map((i) => i.uuid).toString();
        Matter.httpDeleteBatch(uuids, this.getSpaceUuid(), () => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.refresh();
        });
      },
    });
  }

  recoverBatch() {
    Modal.confirm({
      title: Lang.t('actionRecoveryConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedMatters.map((i) => i.uuid).toString();
        Matter.httpRecoveryBatch(uuids, this.getSpaceUuid(), () => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.refresh();
        });
      },
    });
  }

  searchFile(value?: string) {
    this.pager.resetFilter();
    if (value) {
      this.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
      this.pager.setFilterValue('orderDir', SortDirection.DESC);
      this.pager.setFilterValue('name', value);
      this.pager.setFilterValue('deleted', true);
      if (this.props.match.params.spaceUuid) {
        this.pager.setFilterValue(
          'spaceUuid',
          this.props.match.params.spaceUuid
        );
      }
      this.pager.httpList();
    } else {
      this.refresh();
    }
  }

  changeSearch(e: any) {
    if (!e.currentTarget.value) this.searchFile();
  }

  changePage(page: number) {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  }

  previewImage(matter: Matter) {
    let imageArray: string[] = [];
    let startIndex = -1;
    this.pager.data.forEach((item) => {
      if (item.isImage()) {
        imageArray.push(item.getPreviewUrl());
        if (item.uuid === matter.uuid) {
          startIndex = imageArray.length - 1;
        }
      }
    });

    ImagePreviewer.showMultiPhoto(imageArray, startIndex);
  }

  goDetail(matter: Matter) {
    const prefix = this.props.match.params.spaceUuid
      ? `/space/${this.props.match.params.spaceUuid}`
      : '';
    Sun.navigateTo(`${prefix}/matter/detail/${matter.uuid}`);
  }

  getBreadcrumbModels(): BreadcrumbModel[] {
    const breadcrumbModels: BreadcrumbModel[] = [
      {
        name: Lang.t('layout.bin'),
        path: '',
        query: {},
        displayDirect: true,
      },
    ];
    if (this.space.name) {
      breadcrumbModels.unshift({
        name: this.space.name,
        path: '/space',
        query: {},
        displayDirect: false,
      });
    }

    return breadcrumbModels;
  }

  render() {
    const { pager, selectedMatters } = this;
    return (
      <div className="page-bin-list">
        <BreadcrumbPanel breadcrumbModels={this.getBreadcrumbModels()} />

        <Row className="mt10">
          <Col xs={24} sm={24} md={14} lg={16}>
            <AntdSpace className="buttons">
              {this.checkHandlePermission() && (
                <>
                  {selectedMatters.length !== pager.data.length ? (
                    <Button
                      type="primary"
                      className="mb10"
                      onClick={() => this.checkAll()}
                    >
                      <PlusSquareOutlined />
                      {Lang.t('selectAll')}
                    </Button>
                  ) : null}
                  {pager.data.length &&
                  selectedMatters.length === pager.data.length ? (
                    <Button
                      type="primary"
                      className="mb10"
                      onClick={() => this.checkNone()}
                    >
                      <MinusSquareOutlined />
                      {Lang.t('cancel')}
                    </Button>
                  ) : null}
                  {selectedMatters.length ? (
                    <>
                      <Button
                        type="primary"
                        className="mb10"
                        onClick={() => this.recoverBatch()}
                      >
                        <RedoOutlined />
                        {Lang.t('matter.recovery')}
                      </Button>
                      <Button
                        type="primary"
                        className="mb10"
                        onClick={() => this.deleteBatch()}
                      >
                        <CloseCircleOutlined />
                        {Lang.t('matter.hardDelete')}
                      </Button>
                    </>
                  ) : null}
                </>
              )}

              <Button
                type="primary"
                className="mb10"
                onClick={() => this.refresh()}
              >
                <SyncOutlined />
                {Lang.t('refresh')}
              </Button>
            </AntdSpace>
          </Col>
          <Col xs={24} sm={24} md={10} lg={8}>
            <Input.Search
              className="mb10"
              placeholder={Lang.t('matter.searchFile')}
              onSearch={(value) => this.searchFile(value)}
              onChange={(e) => this.changeSearch(e)}
              enterButton
            />
          </Col>
        </Row>

        <div>
          {pager.loading || pager.data.length ? (
            pager.data.map((matter) => (
              <BinMatterPanel
                key={matter.uuid}
                mode={this.props.match.params.spaceUuid ? 'space' : 'normal'}
                matter={matter}
                spaceMemberRole={
                  this.props.match.params.spaceUuid
                    ? this.spaceMember.role!
                    : undefined
                }
                onDeleteSuccess={() => this.refresh()}
                onRecoverySuccess={() => this.refresh()}
                onCheckMatter={(m) => this.checkMatter(m)}
                onPreviewImage={(m) => this.previewImage(m)}
                onGoDetail={(m) => this.goDetail(m)}
              />
            ))
          ) : (
            <Empty description={Lang.t('matter.noContentYet')} />
          )}
        </div>
        <Pagination
          className="mt10 pull-right"
          onChange={(page) => this.changePage(page)}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />
      </div>
    );
  }
}
