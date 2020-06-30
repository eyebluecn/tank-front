import React, { Children } from "react";
import { RouteComponentProps } from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import Moon from "../../common/model/global/Moon";
import Director from "./widget/Director";
import SortDirection from "../../common/model/base/SortDirection";
import MatterPanel from "./widget/MatterPanel";
import UploadMatterPanel from "./widget/UploadMatterPanel";
import {
  Button,
  Col,
  Empty,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Upload,
} from "antd";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import {
  ExclamationCircleFilled,
  CloudUploadOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  FolderOutlined,
  SyncOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DragOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import Sun from "../../common/model/global/Sun";
import { UserRole } from "../../common/model/user/UserRole";
import StringUtil from "../../common/util/StringUtil";
import MoveBatchModal from "./widget/MoveBatchModal";
import ShareOperationModal from "./widget/ShareOperationModal";
import Share from "../../common/model/share/Share";
import ShareDialogModal from "../share/widget/ShareDialogModal";
import BreadcrumbModel from "../../common/model/base/option/BreadcrumbModel";
import BreadcrumbPanel from "../widget/BreadcrumbPanel";
import Lang from "../../common/model/global/Lang";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  //当前文件夹信息。
  matter = new Matter();
  //准备新建的文件。
  newMatter = new Matter();
  //准备上传的一系列文件
  uploadMatters: Matter[] = [];
  //当前选中的文件
  selectedMatters: Matter[] = [];
  //搜索的文字
  searchText: string | null = null;
  //获取分页的一个帮助器
  pager = new Pager<Matter>(this, Matter, 100);
  user = Moon.getSingleton().user;
  preference = Moon.getSingleton().preference;
  //导演
  director = new Director();
  //当前面包屑模型数组。
  breadcrumbModels: BreadcrumbModel[] = [];
  //分享
  share = new Share();

  newMatterRef = React.createRef<MatterPanel>();
  //用来判断是否展示遮罩层
  dragEnterCount = 0;

  constructor(props: IProps) {
    super(props);
  }

  //拖拽上传
  drag = {
    dragEnterListener: (e: DragEvent) => {
      e.preventDefault();
      this.dragEnterCount++;
      if (this.dragEnterCount > 0) this.updateUI();
    },
    dragleaveListener: (e: DragEvent) => {
      e.preventDefault();
      this.dragEnterCount--;
      if (this.dragEnterCount <= 0) this.updateUI();
    },
    dragoverListener: (e: DragEvent) => {
      e.preventDefault();
    },
    dropListener: (e: DragEvent) => {
      e.preventDefault();
      this.dragEnterCount = 0;
      this.launchUpload(e.dataTransfer!.files);
      this.updateUI();
    },
    register: () => {
      const {
        dragEnterListener,
        dragleaveListener,
        dragoverListener,
        dropListener,
      } = this.drag;
      const el = document.getElementById("layout-content")!;
      el.addEventListener("dragenter", dragEnterListener);
      el.addEventListener("dragleave", dragleaveListener);
      el.addEventListener("dragover", dragoverListener);
      el.addEventListener("drop", dropListener);
    },
    remove: () => {
      const {
        dragEnterListener,
        dragleaveListener,
        dragoverListener,
        dropListener,
      } = this.drag;
      const el = document.getElementById("layout-content")!;
      el.removeEventListener("dragenter", dragEnterListener);
      el.removeEventListener("dragleave", dragleaveListener);
      el.removeEventListener("dragover", dragoverListener);
      el.removeEventListener("drop", dropListener);
    },
  };

  componentDidMount() {
    //刷新一下列表
    if (this.user.role === UserRole.ADMINISTRATOR) {
      this.pager.getFilter("userUuid")!.visible = true;
    } else {
      this.pager.setFilterValue("userUuid", this.user.uuid);
    }
    this.pager.enableHistory();
    this.refresh();
    this.drag.register();
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    if (this.props.location.search !== nextProps.location.search) {
      this.pager.enableHistory();
      this.refresh();
    }
  }
  componentWillUnmount() {
    this.drag.remove();
  }

  refresh = () => {
    // 清空暂存区
    this.selectedMatters = [];

    // 初始化matter
    this.matter.uuid = this.pager.getFilterValue("puuid") || Matter.MATTER_ROOT;

    this.prepareRefresh();

    //刷新面包屑
    this.refreshBreadcrumbs();

    this.pager.httpList();
  };

  prepareRefresh = () => {
    this.pager.setFilterValue("puuid", this.matter.uuid);

    //如果没有任何的排序，默认使用时间倒序和文件夹在顶部
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
      this.pager.setFilterValue("orderDir", SortDirection.DESC);
    }

    //如果没有设置用户的话，那么默认显示当前登录用户的资料
    if (!this.pager.getFilterValue("userUuid")) {
      this.pager.setFilterValue("userUuid", this.user.uuid);
    }
  };

  checkMatter = (matter?: Matter) => {
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
  };

  checkAll = () => {
    this.pager.data.forEach(function (i, index) {
      i.check = true;
    });
    this.checkMatter();
  };

  checkNone = () => {
    this.pager.data.forEach(function (i, index) {
      i.check = false;
    });
    this.checkMatter();
  };

  deleteBatch = () => {
    Modal.confirm({
      title: Lang.t("actionCanNotRevertConfirm"),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedMatters.map((i) => i.uuid).toString();
        this.matter.httpDeleteBatch(uuids, () => {
          MessageBoxUtil.success(Lang.t("operationSuccess"));
          this.refresh();
        });
      },
    });
  };

  downloadZip = () => {
    const uuids = this.selectedMatters.map((i) => i.uuid).toString();
    this.matter.downloadZip(uuids);
  };

  toggleMoveBatch = () => {
    MoveBatchModal.open((targetUuid) => {
      const uuids = this.selectedMatters.map((i) => i.uuid).join(",");
      this.matter.httpMove(uuids, targetUuid, () => {
        MessageBoxUtil.success(Lang.t("operationSuccess"));
        this.refresh();
      });
    });
  };

  triggerUpload = (fileObj: any) => {
    const { file } = fileObj;
    if (file) this.launchUpload([file]);
  };

  launchUpload = (files: FileList | [File]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const m = new Matter(this);
      m.dir = false;
      m.puuid = this.matter.uuid!;
      m.userUuid = this.user.uuid!;

      //判断文件大小。
      if (this.user.sizeLimit >= 0) {
        if (file.size > this.user.sizeLimit) {
          MessageBoxUtil.error(
            Lang.t(
              "matter.sizeExceedLimit",
              StringUtil.humanFileSize(file.size),
              StringUtil.humanFileSize(this.user.sizeLimit)
            )
          );
        }
      }
      m.file = file;
      m.httpUpload(
        () => this.refresh(),
        () => this.updateUI()
      );

      this.uploadMatters.push(m);
    }
  };

  shareBatch = () => {
    const uuids = this.selectedMatters.map((i) => i.uuid).join(",");
    ShareOperationModal.open((share: Share) => {
      share.httpCreate(uuids, () => {
        ShareDialogModal.open(share);
      });
    });
  };

  searchFile = (value?: string) => {
    this.pager.resetFilter();
    if (value) {
      this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
      this.pager.setFilterValue("orderDir", SortDirection.DESC);
      this.pager.setFilterValue("name", value);
      this.pager.httpList();
    } else {
      this.refresh();
    }
  };

  changeSearch = (e: any) => {
    if (!e.currentTarget.value) this.searchFile();
  };

  changePage = (page: number) => {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  };

  createDirectory = () => {
    this.newMatter.name = "matter.allFiles";
    this.newMatter.dir = true;
    this.newMatter.editMode = true;
    this.newMatter.puuid = this.matter.uuid || "root";
    this.newMatter.userUuid = this.user.uuid!;
    this.director.createMode = true;

    this.updateUI();
    setTimeout(() => this.newMatterRef.current!.highLight());
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

  goToDirectory = (id: string) => {
    this.searchText = null;
    this.pager.setFilterValue("puuid", id);
    this.pager.page = 0;
    const query = this.pager.getParams();
    Sun.navigateQueryTo({ path: "/matter/list", query });
    this.refresh();
  };

  //刷新面包屑
  refreshBreadcrumbs = () => {
    const uuid = this.pager.getFilterValue("puuid") || Matter.MATTER_ROOT;

    //根目录简单处理即可。
    if (uuid === Matter.MATTER_ROOT) {
      this.matter.uuid = Matter.MATTER_ROOT;
      this.breadcrumbModels = [
        {
          name: Lang.t("matter.allFiles"),
          path: "/matter/list",
          query: {},
          displayDirect: true,
        },
      ];
    } else {
      this.matter.uuid = uuid;
      this.matter.httpDetail(() => {
        const arr = [];
        let cur: Matter | null = this.matter;
        do {
          arr.push(cur);
          cur = cur.parent;
        } while (cur);

        this.breadcrumbModels = arr.reduceRight(
          (t: any, item: Matter, i: number) => {
            const query = this.pager.getParams();
            query["puuid"] = item.uuid!;
            t.push({
              name: item.name,
              path: "/matter/list",
              query: query,
              displayDirect: !i, // 当前目录不需要导航
            });
            return t;
          },
          [
            {
              name: Lang.t("matter.allFiles"),
              path: "/matter/list",
              query: {},
              displayDirect: false,
            },
          ]
        );
        this.updateUI();
      });
    }
  };

  render() {
    const {
      pager,
      director,
      selectedMatters,
      uploadMatters,
      dragEnterCount,
    } = this;
    return (
      <div className="matter-list">
        {dragEnterCount > 0 ? (
          <div className="obscure">
            <CloudUploadOutlined className="white f50" />
          </div>
        ) : null}
        <BreadcrumbPanel breadcrumbModels={this.breadcrumbModels} />

        <Row className="mb10 mt15">
          <Col xs={24} sm={24} md={14} lg={16}>
            <Space className="buttons">
              {selectedMatters.length !== pager.data.length ? (
                <Button type="primary" className="mb10" onClick={this.checkAll}>
                  <PlusSquareOutlined />
                  {Lang.t("selectAll")}
                </Button>
              ) : null}
              {pager.data.length &&
              selectedMatters.length === pager.data.length ? (
                <Button
                  type="primary"
                  className="mb10"
                  onClick={this.checkNone}
                >
                  <MinusSquareOutlined />
                  {Lang.t("cancel")}
                </Button>
              ) : null}
              {selectedMatters.length ? (
                <>
                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.deleteBatch}
                  >
                    <DeleteOutlined />
                    {Lang.t("delete")}
                  </Button>

                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.downloadZip}
                  >
                    <DownloadOutlined />
                    {Lang.t("download")}
                  </Button>

                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.toggleMoveBatch}
                  >
                    <DragOutlined />
                    {Lang.t("matter.move")}
                  </Button>

                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.shareBatch}
                  >
                    <ShareAltOutlined />
                    {Lang.t("matter.share")}
                  </Button>
                </>
              ) : null}

              <Upload
                className="ant-upload"
                customRequest={this.triggerUpload}
                showUploadList={false}
                multiple
              >
                <Button type="primary" className="mb10">
                  <CloudUploadOutlined />
                  {Lang.t("matter.upload")}
                </Button>
              </Upload>
              <Button
                type="primary"
                className="mb10"
                onClick={this.createDirectory}
              >
                <FolderOutlined />
                {Lang.t("matter.create")}
              </Button>

              <Button type="primary" className="mb10" onClick={this.refresh}>
                <SyncOutlined />
                {Lang.t("refresh")}
              </Button>
            </Space>
          </Col>
          <Col xs={24} sm={24} md={10} lg={8}>
            <Input.Search
              placeholder={Lang.t("matter.searchFile")}
              onSearch={(value) => this.searchFile(value)}
              onChange={this.changeSearch}
              enterButton
            />
          </Col>
        </Row>

        {Children.toArray(
          uploadMatters.map((m) => <UploadMatterPanel matter={m} />)
        )}

        {director.createMode ? (
          <MatterPanel
            ref={this.newMatterRef}
            matter={this.newMatter}
            director={director}
            onCreateDirectoryCallback={this.refresh}
          />
        ) : null}
        <div>
          {pager.loading || pager.data.length ? (
            pager.data.map((matter) => (
              <MatterPanel
                key={matter.uuid!}
                director={director}
                matter={matter}
                onGoToDirectory={this.goToDirectory}
                onDeleteSuccess={this.refresh}
                onCheckMatter={this.checkMatter}
                onPreviewImage={this.previewImage}
              />
            ))
          ) : (
            <Empty description={Lang.t("matter.noContentYet")} />
          )}
        </div>
        <Pagination
          className="mt10 pull-right"
          onChange={this.changePage}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />
      </div>
    );
  }
}
