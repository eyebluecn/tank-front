import React, {Children} from "react";
import {RouteComponentProps} from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import Moon from "../../common/model/global/Moon";
import Director from "./widget/Director";
import SortDirection from "../../common/model/base/SortDirection";
import MatterPanel from "./widget/MatterPanel";
import UploadMatterPanel from "./widget/UploadMatterPanel";
import {Breadcrumb, Button, Col, Input, Modal, Pagination, Row, Space, Upload,} from "antd";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import {ExclamationCircleFilled} from "@ant-design/icons";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import Sun from "../../common/model/global/Sun";
import {UserRole} from "../../common/model/user/UserRole";
import StringUtil from "../../common/util/StringUtil";
import MoveBatchModal from "./widget/MoveBatchModal";
import ShareOperationModal from "./widget/ShareOperationModal";
import Share from "../../common/model/share/Share";
import ShareDialogModal from "../share/widget/ShareDialogModal";
import BreadcrumbModel from "../../common/model/base/option/BreadcrumbModel";
import BreadcrumbPanel from "../widget/BreadcrumbPanel";

interface IProps extends RouteComponentProps {
}

interface IState {
}

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
  // 导演
  director = new Director();
  //当前面包屑模型数组。
  breadcrumbModels: BreadcrumbModel[] = []
  // 分享
  share =  new Share();

  newMatterRef = React.createRef<MatterPanel>();

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    //刷新一下列表
    if (this.user.role === UserRole.ADMINISTRATOR) {
      this.pager.getFilter("userUuid")!.visible = true;
    } else {
      this.pager.setFilterValue("userUuid", this.user.uuid);
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

  refresh = () => {
    // 清空暂存区
    this.selectedMatters = [];

    // 初始化matter
    this.matter.uuid = this.pager.getFilterValue("puuid") || Matter.MATTER_ROOT;

    this.prepareRefresh();

    //刷新面包屑
    this.refreshBreadcrumbs()

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
      this.selectedMatters = []
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
      title: "此操作不可撤回, 是否继续?",
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00"/>,
      onOk: () => {
        const uuids = this.selectedMatters.map((i) => i.uuid).toString();
        this.matter.httpDeleteBatch(uuids, () => {
          MessageBoxUtil.success("操作成功");
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
        MessageBoxUtil.success("操作成功");
        this.refresh();
      });
    });
  };

  triggerUpload = (fileObj: any) => {
    const {file} = fileObj;
    if (file) this.launchUpload(file);
  };

  launchUpload = (file: any) => {
    const m = new Matter(this);
    m.dir = false;
    m.puuid = this.matter.uuid!;
    m.userUuid = this.user.uuid!;

    //判断文件大小。
    if (this.user.sizeLimit >= 0) {
      if (file.size > this.user.sizeLimit) {
        MessageBoxUtil.error(
          `文件大小超过了限制 ${StringUtil.humanFileSize(
            file.size
          )}>${StringUtil.humanFileSize(this.user.sizeLimit)}`
        );
      }
    }
    m.file = file;
    m.httpUpload(
      () => this.refresh(),
      () => this.updateUI()
    );

    this.uploadMatters.push(m);
  };

  shareBatch = () => {
    const uuids = this.selectedMatters.map((i) => i.uuid).join(",");
    ShareOperationModal.open((share: Share) => {
      share.httpCreate(uuids, () => {
        ShareDialogModal.open(share)
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
    Sun.navigateQueryTo({path: "/matter/list", query});
    this.refresh();
  };

  //刷新面包屑
  refreshBreadcrumbs = () => {

    //清空暂存区
    this.selectedMatters = []

    let uuid = this.pager.getFilterValue('puuid')

    //根目录简单处理即可。
    if (!uuid || uuid === Matter.MATTER_ROOT) {

      this.matter.uuid = Matter.MATTER_ROOT
      this.breadcrumbModels = []
      this.breadcrumbModels.push({
        name: "所有文件",
        path: "/matter/list",
        query: {},
        displayDirect: true,
      })

    } else {

      this.matter.uuid = uuid
      this.matter.httpDetail(() => {

        let arr = []
        let cur = this.matter.parent
        while (cur) {
          arr.push(cur)
          cur = cur.parent
        }

        this.breadcrumbModels = []

        this.breadcrumbModels.push({
          name: "所有文件",
          path: "/matter/list",
          query: {},
          displayDirect: false,
        })

        for (let i = arr.length - 1; i >= 0; i--) {
          let m = arr[i]
          let query = this.pager.getParams()
          query['puuid'] = m.uuid!

          console.log("当前层的query:", m.name, query)
          this.breadcrumbModels.push({
            name: m.name,
            path: '/matter/list',
            query: query,
            displayDirect: false,
          })
        }

        //第一个文件
        this.breadcrumbModels.push({
          name: this.matter.name,
          displayDirect: true,
          path: '',
          query: {},
        })
      })
    }
  }

  render() {
    const {pager, director, selectedMatters, uploadMatters} = this;
    return (
      <div className="matter-list">

        <BreadcrumbPanel breadcrumbModels={this.breadcrumbModels}/>

        <Row className="mb10 mt15">
          <Col md={16} sm={24}>
            <Space className="buttons">
              {selectedMatters.length !== pager.data.length ? (
                <Button type="primary" className="mb10" onClick={this.checkAll}>
                  全选
                </Button>
              ) : null}
              {pager.data.length &&
              selectedMatters.length === pager.data.length ? (
                <Button
                  type="primary"
                  className="mb10"
                  onClick={this.checkNone}
                >
                  取消
                </Button>
              ) : null}
              {selectedMatters.length ? (
                <>
                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.deleteBatch}
                  >
                    删除
                  </Button>

                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.downloadZip}
                  >
                    下载
                  </Button>

                  <Button
                    type="primary"
                    className="mb10"
                    onClick={this.toggleMoveBatch}
                  >
                    移动
                  </Button>

                  <Button type="primary" className="mb10" onClick={this.shareBatch}>
                    分享
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
                  上传
                </Button>
              </Upload>
              <Button
                type="primary"
                className="mb10"
                onClick={this.createDirectory}
              >
                新建
              </Button>

              <Button type="primary" className="mb10" onClick={this.refresh}>
                刷新
              </Button>
            </Space>
          </Col>
          <Col md={8} sm={24}>
            <Input.Search
              placeholder="搜索文件"
              onSearch={(value) => this.searchFile(value)}
              onChange={this.changeSearch}
              enterButton
            />
          </Col>
        </Row>

        {Children.toArray(
          uploadMatters.map((m) => <UploadMatterPanel matter={m}/>)
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
          {pager.data.map((matter) => (
            <MatterPanel
              key={matter.uuid!}
              director={director}
              matter={matter}
              onGoToDirectory={this.goToDirectory}
              onDeleteSuccess={this.refresh}
              onCheckMatter={this.checkMatter}
              onPreviewImage={this.previewImage}
            />
          ))}
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
