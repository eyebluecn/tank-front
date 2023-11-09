import React from 'react';
import TankComponent from '../../common/component/TankComponent';
import TankTitle from '../widget/TankTitle';
import { Button, Col, Empty, Input, Modal, Row, Space } from 'antd';
import { RouteComponentProps } from 'react-router';
import './Detail.less';
import Share from '../../common/model/share/Share';
import Pager from '../../common/model/base/Pager';
import Matter from '../../common/model/matter/Matter';
import BrowserUtil from '../../common/util/BrowserUtil';
import SortDirection from '../../common/model/base/SortDirection';
import FrameLoading from '../widget/FrameLoading';
import Moon from '../../common/model/global/Moon';
import Sun from '../../common/model/global/Sun';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import {
  DownloadOutlined,
  ExclamationCircleFilled,
  LinkOutlined,
  StopOutlined,
} from '@ant-design/icons';
import ShareDialogModal from './widget/ShareDialogModal';
import DateUtil from '../../common/util/DateUtil';
import ShareMatterPanel from './widget/ShareMatterPanel';
import BreadcrumbModel from '../../common/model/base/option/BreadcrumbModel';
import BreadcrumbPanel from '../widget/BreadcrumbPanel';
import ImagePreviewer from '../widget/previewer/ImagePreviewer';
import Lang from '../../common/model/global/Lang';

interface RouteParam {
  uuid: string;
}

interface IProps extends RouteComponentProps<RouteParam> {}

interface IState {}

export default class Detail extends TankComponent<IProps, IState> {
  // 默认分享详情中分页大小
  static sharePagerSize = 50;

  //当前面包屑模型数组。
  breadcrumbModels: BreadcrumbModel[] = [];

  // 是否需要提取码
  needShareCode = true;

  share = new Share(this);
  pager = new Pager<Matter>(this, Matter, Detail.sharePagerSize);
  user = Moon.getSingleton().user;
  currentShareRootUuid =
    BrowserUtil.getQueryByName('shareRootUuid') || Matter.MATTER_ROOT; // 当前查看的分享的根目录uuid

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {
    this.share.uuid = this.props.match.params.uuid;
    this.pager.urlPage = Share.URL_MATTER_PAGE;

    if (!!BrowserUtil.getQueryByName('code')) {
      this.getFiles(BrowserUtil.getQueryByName('code')!);
      // 去除url中的code query
      window.history.replaceState({}, '', window.location.pathname);
    } else if (this.user.hasLogin()) {
      this.pager.enableHistory();
      this.refresh();
    }
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    if (this.props.location.search !== nextProps.location.search) {
      this.refresh();
    }
  }

  refresh() {
    const puuid = BrowserUtil.getQueryByName('puuid') || Matter.MATTER_ROOT; // 当前目录的puuid

    this.share.httpBrowse(puuid, this.currentShareRootUuid!, () => {
      this.needShareCode = false;

      // 根目录下matters已经通过browse接口拿到了
      if (puuid === Matter.MATTER_ROOT) {
        this.pager.clear();
        this.pager.totalItems = this.share.matters.length;
        this.pager.data = this.share.matters;
      } else {
        this.refreshMatterPager();
      }

      //刷新面包屑，面包屑依赖于这个接口
      this.refreshBreadcrumbs();
      this.updateUI();
    });
  }

  refreshMatterPager() {
    const puuid = BrowserUtil.getQueryByName('puuid');
    const { uuid: shareUuid, code: shareCode } = this.share;
    this.pager.setFilterValues({
      puuid,
      shareUuid,
      shareCode,
      shareRootUuid: this.currentShareRootUuid,
      orderCreateTime: SortDirection.DESC, // 默认以时间降序
      orderDir: SortDirection.DESC, // 默认文件夹排在前面
    });
    this.pager.httpList();
  }

  getFiles(value: string) {
    this.share.code = value;
    this.refresh();
  }

  downloadZip() {
    const puuid = BrowserUtil.getQueryByName('puuid') || Matter.MATTER_ROOT;
    this.share.downloadZip(this.currentShareRootUuid!, puuid);
  }

  cancelShare() {
    Modal.confirm({
      title: Lang.t('share.cancelPrompt'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.share.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          Sun.navigateTo('/share/list');
        });
      },
    });
  }

  previewImage(matter: Matter) {
    let imageArray: string[] = [];
    let startIndex = -1;
    const { share } = this;
    this.pager.data.forEach((item) => {
      if (item.isImage()) {
        imageArray.push(
          item.getSharePreviewUrl(
            share.uuid!,
            share.code!,
            this.currentShareRootUuid!
          )
        );
        if (item.uuid === matter.uuid) {
          startIndex = imageArray.length - 1;
        }
      }
    });

    ImagePreviewer.showMultiPhoto(imageArray, startIndex);
  }

  goToDirectory(matterUuid: string) {
    const paramId = this.props.match.params.uuid;

    // currentShareRootUuid 一旦设置好了，只要根文件夹不换，那么就一直不会变。
    const puuid = BrowserUtil.getQueryByName('puuid');
    if (!puuid || puuid === Matter.MATTER_ROOT) {
      this.currentShareRootUuid = matterUuid;
      this.pager.clear();
    }

    this.pager.setFilterValue('puuid', matterUuid);
    this.pager.page = 0;
    const query = this.pager.getParams();
    Sun.navigateQueryTo({ path: `/share/detail/${paramId}`, query });
  }

  refreshBreadcrumbs() {
    let that = this;

    //清空
    that.breadcrumbModels = [];

    that.breadcrumbModels.push({
      name: Lang.t('layout.allFiles'),
      path: '/share/detail/' + this.share.uuid,
      query: {},
      displayDirect: false,
      onClick: () => {
        Sun.navigateQueryTo({
          path: `/share/detail/${this.share.uuid}`,
          query: {},
        });
        this.currentShareRootUuid = Matter.MATTER_ROOT;
        this.updateUI();
      },
    });

    let pMatter = this.share.dirMatter;
    while (pMatter && pMatter.uuid) {
      //插入到最前面
      let query = this.pager.getParams();
      query['puuid'] = pMatter.uuid;
      that.breadcrumbModels.splice(1, 0, {
        name: pMatter.name,
        path: '/share/detail/' + this.share.uuid,
        query: query,
        displayDirect: false,
      });
      pMatter = pMatter.parent!;
    }
  }

  render() {
    const { share, needShareCode, user, pager } = this;

    if (share.detailLoading && needShareCode) return <FrameLoading />;
    return (
      <div className="share-detail">
        <TankTitle name={Lang.t('share.shareDetail')} />
        {needShareCode ? (
          <div>
            <Row>
              <Col xs={20} sm={20} md={16} lg={10} className="share-code">
                <Input.Search
                  placeholder={Lang.t('share.enterCode')}
                  enterButton={Lang.t('share.getFiles')}
                  size="large"
                  onSearch={this.getFiles.bind(this)}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <div className="share-block">
              <div className="upper">
                <div className="left-box">
                  <img className="share-icon" src={share.getIcon()} />
                  <span className="name">
                    {share.name}
                    {share.hasExpired() ? (
                      <span className="text-danger">
                        {Lang.t('share.expired')}
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="right-box">
                  <Space>
                    <Button type="primary" onClick={() => this.downloadZip()}>
                      <DownloadOutlined />
                      {Lang.t('download')}
                    </Button>
                    {user.uuid && user.uuid === share.userUuid ? (
                      <>
                        <Button danger onClick={() => this.cancelShare()}>
                          <StopOutlined />
                          {Lang.t('share.cancelShare')}
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => ShareDialogModal.open(share)}
                        >
                          <LinkOutlined />
                          {Lang.t('share.getLink')}
                        </Button>
                      </>
                    ) : null}
                  </Space>
                </div>
              </div>
              <div className="share-info">
                <Space>
                  <span>
                    {Lang.t('share.sharer')}: {share.username}
                  </span>
                  <span>
                    {Lang.t('createTime')}:{' '}
                    {DateUtil.simpleDateHourMinute(share.createTime)}
                  </span>
                  <span>
                    {share.expireInfinity
                      ? Lang.t('share.noExpire')
                      : `${Lang.t(
                          'share.expireTime'
                        )}：${DateUtil.simpleDateHourMinute(share.expireTime)}`}
                  </span>
                </Space>
              </div>
            </div>

            <div className="breadcrumb-area">
              <BreadcrumbPanel breadcrumbModels={this.breadcrumbModels} />
            </div>

            {pager.data.length ? (
              pager.data.map((matter) => (
                <ShareMatterPanel
                  key={matter.uuid!}
                  matter={matter}
                  share={share}
                  currentShareRootUuid={this.currentShareRootUuid!}
                  onGoToDirectory={this.goToDirectory.bind(this)}
                  onPreviewImage={this.previewImage.bind(this)}
                />
              ))
            ) : (
              <Empty description={Lang.t('share.noContent')} />
            )}
          </div>
        )}
      </div>
    );
  }
}
