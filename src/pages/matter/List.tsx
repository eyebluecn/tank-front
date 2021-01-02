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
import FileUtil from "../../common/util/FileUtil";
import SafeUtil from "../../common/util/SafeUtil";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  //当前文件夹信息。
  matter = new Matter();
  //准备新建的文件。
  newMatter = new Matter();
  //准备上传的一系列文件
  uploadMatters = Moon.getSingleton().uploadMatters;
  //当前选中的文件
  selectedMatters: Matter[] = [];
  //搜索的文字
  searchText: string | null = null;
  //获取分页的一个帮助器
  pager = new Pager<Matter>(this, Matter, Pager.MAX_PAGE_SIZE);
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

  //临时文件list，用于上传文件夹功能
  tempUploadList: File[] = [];

  //上传错误日志
  uploadErrorLogs: [string, string, string][] = [];

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
    // 刷新文件列表
    this.refreshPager();
    // 刷新面包屑
    this.refreshBreadcrumbs();
  };

  refreshPager = () => {
    // 初始化当前matter uuid
    if (this.matter.uuid !== this.pager.getFilterValue("puuid")) {
      this.matter.uuid =
        this.pager.getFilterValue("puuid") || Matter.MATTER_ROOT;
    }

    this.pager.setFilterValue("puuid", this.matter.uuid);

    //如果没有任何的排序，默认使用时间倒序和文件夹在顶部
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
      this.pager.setFilterValue("orderDir", SortDirection.DESC);
    }

    // 过滤掉被软删除的文件
    this.pager.setFilterValue("deleted", false);

    this.pager.httpList();
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
    this.pager.data.forEach((i) => {
      i.check = true;
    });
    this.checkMatter();
  };

  checkNone = () => {
    this.pager.data.forEach((i) => {
      i.check = false;
    });
    this.checkMatter();
  };

  deleteBatch = () => {
    Modal.confirm({
      title: Lang.t("actionDeleteConfirm"),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: () => {
        const uuids = this.selectedMatters.map((i) => i.uuid).toString();
        this.matter.httpSoftDeleteBatch(uuids, () => {
          MessageBoxUtil.success(Lang.t("operationSuccess"));
          this.refresh();
        });
      },
    });
  };

  downloadZip = () => {
    const uuids = this.selectedMatters.map((i) => i.uuid).toString();
    Matter.downloadZip(uuids);
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
    if (file) this.launchUpload(file);
  };

  debounce = (func: Function, wait: number) => {
    let timer: any = null;
    return (fileObj: any) => {
      const { file } = fileObj;
      this.tempUploadList.push(file);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(func, wait);
    };
  };

  triggerUploadDir = this.debounce(async () => {
    await this.uploadDirectory();
    if (!this.uploadErrorLogs.length) {
      MessageBoxUtil.success(Lang.t("matter.uploaded"));
    } else {
      // 上传错误弹出提示框
      const url = FileUtil.getErrorLogsToCSVUrl(this.uploadErrorLogs);
      Modal.confirm({
        title: Lang.t("matter.uploadInfo"),
        icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
        content: Lang.t("matter.uploadErrorInfo"),
        okText: Lang.t("matter.exportCSV"),
        onOk: () => {
          if (url) {
            window.open(url);
          } else {
            MessageBoxUtil.warn(Lang.t("matter.unCompatibleBrowser"));
          }
        },
      });
    }
    this.tempUploadList = [];
    this.uploadErrorLogs = [];
    this.refresh();
  }, 0);

  uploadDirectory = async () => {
    const dirPathUuidMap: any = {}; // 存储已经创建好的文件夹map
    for (let i = 0; i < this.tempUploadList.length; i++) {
      const file: File = this.tempUploadList[i];
      const paths = file.webkitRelativePath.split("/");
      const pPaths = paths.slice(0, paths.length - 1);
      const pPathStr = pPaths.join("/");
      if (!dirPathUuidMap[pPathStr]) {
        // 递归创建其父文件夹
        for (let j = 1; j <= pPaths.length; j++) {
          const midPaths = pPaths.slice(0, j);
          const midPathStr = midPaths.join("/");
          if (!dirPathUuidMap[midPathStr]) {
            const m = new Matter(this);
            m.name = midPaths[midPaths.length - 1];
            m.puuid =
              j > 1
                ? dirPathUuidMap[midPaths.slice(0, j - 1).join("/")]
                : this.matter.uuid!;
            m.userUuid = this.user.uuid!;
            await m.httpCreateDirectory(
              () => {
                dirPathUuidMap[midPathStr] = m.uuid;
              },
              (msg: string) => {
                this.uploadErrorLogs.push([
                  file.name,
                  file.webkitRelativePath,
                  msg,
                ]);
              }
            );
          }
        }
      }
      if (dirPathUuidMap[pPathStr]) {
        this.launchUpload(file, dirPathUuidMap[pPathStr], (msg?: string) => {
          this.uploadErrorLogs.push([
            file.name,
            file.webkitRelativePath,
            `${msg}`,
          ]);
        });
      }
    }
  };

  launchUpload = (
    f: File | FileList,
    puuid = this.matter.uuid!,
    errHandle = () => {}
  ) => {
    const files = f instanceof FileList ? f : [f];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const m = new Matter(this);
      m.dir = false;
      m.puuid = puuid;
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
        (msg: string) => {
          this.updateUI();
          SafeUtil.safeCallback(errHandle)(msg);
        }
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

        <Row className="mt10">
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
              <Upload
                className="ant-upload"
                customRequest={this.triggerUploadDir}
                showUploadList={false}
                directory
              >
                <Button type="primary" className="mb10">
                  <CloudUploadOutlined />
                  {Lang.t("matter.uploadDir")}
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
              className="mb10"
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
