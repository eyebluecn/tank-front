import React from "react";
import TankComponent from "../../common/component/TankComponent";
import TankTitle from "../widget/TankTitle";
import { Button, Col, Empty, Input, Modal, Row, Space } from "antd";
import { RouteComponentProps } from "react-router";
import "./Detail.less";
import Share from "../../common/model/share/Share";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import BrowserUtil from "../../common/util/BrowserUtil";
import SortDirection from "../../common/model/base/SortDirection";
import FrameLoading from "../widget/FrameLoading";
import Moon from "../../common/model/global/Moon";
import Sun from "../../common/model/global/Sun";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import { ExclamationCircleFilled, DownloadOutlined, StopOutlined, LinkOutlined } from "@ant-design/icons";
import ShareDialogModal from "./widget/ShareDialogModal";
import DateUtil from "../../common/util/DateUtil";
import MatterPanel from "../matter/widget/MatterPanel";
import BreadcrumbModel from "../../common/model/base/option/BreadcrumbModel";
import BreadcrumbPanel from "../widget/BreadcrumbPanel";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import Lang from "../../common/model/global/Lang";

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

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {
    this.share.uuid = this.props.match.params.uuid;
    //如果query中有rootUuid那么就更新.
    this.share.rootUuid =
      BrowserUtil.getQueryByName("shareRootUuid") || this.share.rootUuid;

    this.pager.enableHistory();
    this.refresh();
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    if (this.props.location.search !== nextProps.location.search) {
      this.pager.enableHistory();
      this.refresh();
    }
  }

  refresh = () => {
    const puuid = BrowserUtil.getQueryByName("puuid") || Matter.MATTER_ROOT;
    this.share.httpBrowse(puuid, this.share.rootUuid, () => {
      if (puuid === Matter.MATTER_ROOT) {
        this.pager.clear();
        this.pager.totalItems = this.share.matters.length;
        this.pager.data = this.share.matters;
      }

      //刷新面包屑
      this.refreshBreadcrumbs();

      this.needShareCode = false;
      this.updateUI();
    });

    this.refreshMatterPager();
  };

  refreshMatterPager = () => {
    //只有当鉴权通过，并且不是分享根目录时需要才去进行page请求，根目录下matters已经通过browse接口拿到了
    const puuid = BrowserUtil.getQueryByName("puuid");
    if (!this.needShareCode && puuid && puuid !== Matter.MATTER_ROOT) {
      const {
        uuid: shareUuid,
        code: shareCode,
        rootUuid: shareRootUuid,
      } = this.share;
      this.pager.setFilterValues({
        puuid,
        shareUuid,
        shareCode,
        shareRootUuid,
        orderCreateTime: SortDirection.DESC, // 默认以时间降序
        orderDir: SortDirection.DESC, // 默认文件夹排在前面
      });
      this.pager.httpList();
    }
  };

  getFiles = (value: string) => {
    this.share.code = value;
    this.refresh();
  };

  downloadZip = () => {
    const puuid = BrowserUtil.getQueryByName("puuid") || Matter.MATTER_ROOT;
    this.share.downloadZip(puuid);
  };

  cancelShare = () => {
    Modal.confirm({
      title: Lang.t("share.cancelPrompt"),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        this.share.httpDel(() => {
          MessageBoxUtil.success(Lang.t("operationSuccess"));
          Sun.navigateTo("/share/list");
        });
      },
    });
  };

  previewImage = (matter: Matter) => {
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
  };

  goToDirectory = (id?: string) => {
    const paramId = this.props.match.params.uuid;
    if (id) {
      //share.rootUuid 一旦设置好了，只要根文件夹不换，那么就一直不会变。
      const puuid = BrowserUtil.getQueryByName("puuid");
      if (!puuid || puuid === Matter.MATTER_ROOT) {
        this.share.rootUuid = id;
        this.pager.clear();
      }

      this.pager.setFilterValue("puuid", id);
      this.pager.page = 0;
      const query = this.pager.getParams();
      Sun.navigateQueryTo({ path: `/share/detail/${paramId}`, query });
    } else {
      // 回到分享根目录，先将rootUuid交给根目录
      this.share.rootUuid = Matter.MATTER_ROOT;
      this.pager.clear();
      Sun.navigateQueryTo({ path: `/share/detail/${paramId}` });
    }
  };

  refreshBreadcrumbs = () => {
    let that = this;

    //清空
    that.breadcrumbModels = [];

    that.breadcrumbModels.push({
      name: Lang.t("layout.allFiles"),
      path: "/share/detail/" + this.share.uuid,
      query: {},
      displayDirect: false,
    });

    let pMatter = this.share.dirMatter;
    while (pMatter && pMatter.uuid) {
      //插入到最前面
      let query = this.pager.getParams();
      query["puuid"] = pMatter.uuid;
      that.breadcrumbModels.splice(1, 0, {
        name: pMatter.name,
        path: "/share/detail/" + this.share.uuid,
        query: query,
        displayDirect: false,
      });
      pMatter = pMatter.parent!;
    }
  };

  render() {
    const { share, needShareCode, user, pager } = this;
    if (share.detailLoading && needShareCode) return <FrameLoading />;
    return (
      <div className="share-detail">
        <TankTitle name={Lang.t("share.shareDetail")} />
        {needShareCode ? (
          <div>
            <Row>
              <Col span={12} offset={6} className="mt100">
                <Input.Search
                  placeholder={Lang.t("share.enterCode")}
                  enterButton={Lang.t("share.getFiles")}
                  size="large"
                  onSearch={this.getFiles}
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
                        {Lang.t("share.expired")}
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="right-box">
                  <Space>
                    <Button type="primary" onClick={this.downloadZip}>
                      <DownloadOutlined />
                      {Lang.t("download")}
                    </Button>
                    {user.uuid && user.uuid === share.userUuid ? (
                      <>
                        <Button danger onClick={this.cancelShare}>
                          <StopOutlined />
                          {Lang.t("share.cancelShare")}
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => ShareDialogModal.open(share)}
                        >
                          <LinkOutlined />
                          {Lang.t("share.getLink")}
                        </Button>
                      </>
                    ) : null}
                  </Space>
                </div>
              </div>
              <div className="share-info">
                <Space>
                  <span>
                    {Lang.t("share.sharer")}: {share.username}
                  </span>
                  <span>
                    {Lang.t("createTime")}:{" "}
                    {DateUtil.simpleDateHourMinute(share.createTime)}
                  </span>
                  <span>
                    {share.expireInfinity
                      ? Lang.t("share.noExpire")
                      : `${Lang.t(
                          "share.expireTime"
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
                <MatterPanel
                  key={matter.uuid!}
                  matter={matter}
                  shareMode={true}
                  onGoToDirectory={this.goToDirectory}
                  onPreviewImage={this.previewImage}
                />
              ))
            ) : (
              <Empty description={Lang.t("share.noContent")} />
            )}
          </div>
        )}
      </div>
    );
  }
}
