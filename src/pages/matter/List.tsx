import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import TankTitle from "../widget/TankTitle";
import Moon from "../../common/model/global/Moon";
import Director from "./widget/Director";
import SortDirection from "../../common/model/base/SortDirection";
import MatterPanel from "./widget/MatterPanel";
import { Col, Modal, Row, Upload } from "antd";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import Sun from "../../common/model/global/Sun";
import { UserRole } from "../../common/model/user/UserRole";
import {RcFile} from "antd/lib/upload";
import StringUtil from "../../common/util/StringUtil";

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
  pager = new Pager<Matter>(this, Matter, 10);
  //移动的目标文件夹
  targetMatterUuid: string | null = null;
  user = Moon.getSingleton().user;
  preference = Moon.getSingleton().preference;
  director = new Director();

  // todo
  // share: Share =  new Share();

  //分享的弹框
  shareDialogVisible = false;
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
    this.matter.uuid = this.pager.getFilterValue("puuid") || "root";
    if (this.matter.uuid !== "root") this.matter.httpDetail();

    this.prepareRefresh();
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
      this.selectedMatters.splice(0, this.selectedMatters.length);
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
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
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

  moveBatch = () => {
    console.log("moveBatch");
  };

  triggerUpload = (fileObj: any) => {
    const { file } = fileObj;
    if(file) this.launchUpload(file);
  };

  launchUpload = (file: any) => {
    const m = new Matter();
    m.dir = false;
    m.puuid = this.matter.uuid!;
    m.userUuid = this.user.uuid!;

    //判断文件大小。
    if (this.user.sizeLimit >= 0) {
      if (file.size > this.user.sizeLimit) {
        MessageBoxUtil.error(`文件大小超过了限制 ${StringUtil.humanFileSize(file.size)}>${StringUtil.humanFileSize(this.user.sizeLimit)}`);
      }
    }
    m.file = file;

    // todo 上传有问题
    m.httpUpload();
    this.uploadMatters.push(m);
  };

  share = () => {
    console.log("share");
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

  render() {
    const { pager, director, selectedMatters } = this;

    return (
      <div className="matter-list">
        <TankTitle name={"所有文件"}></TankTitle>

        <Row className="mb10">
          <Col md={16}>
            {selectedMatters.length !== pager.data.length ? (
              <button
                className="btn btn-primary btn-sm mr5 mb5"
                onClick={this.checkAll}
              >
                全选
              </button>
            ) : null}
            {pager.data.length &&
            selectedMatters.length === pager.data.length ? (
              <button
                className="btn btn-primary btn-sm mr5 mb5"
                onClick={this.checkNone}
              >
                取消
              </button>
            ) : null}
            {selectedMatters.length ? (
              <>
                <button
                  className="btn btn-primary btn-sm mr5 mb5"
                  onClick={this.deleteBatch}
                >
                  删除
                </button>

                <button
                  className="btn btn-primary btn-sm mr5 mb5"
                  onClick={this.downloadZip}
                >
                  下载
                </button>

                <button
                  className="btn btn-primary btn-sm mr5 mb5"
                  onClick={this.moveBatch}
                >
                  移动
                </button>

                <button
                  className="btn btn-primary btn-sm mr5 mb5"
                  onClick={this.share}
                >
                  分享
                </button>
              </>
            ) : null}

            <Upload className="ant-upload" customRequest={this.triggerUpload} showUploadList={false} multiple>
              <button className="btn btn-primary btn-sm mr5 mb5">上传</button>
            </Upload>

            <button
              className="btn btn-primary btn-sm mr5 mb5"
              onClick={this.createDirectory}
            >
              新建
            </button>

            <button
              className="btn btn-primary btn-sm mr5 mb5"
              onClick={this.refresh}
            >
              刷新
            </button>
          </Col>
          <Col md={8}></Col>
        </Row>

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
      </div>
    );
  }
}
