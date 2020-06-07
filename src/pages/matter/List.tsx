import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import TankTitle from "../widget/TankTitle";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import Preference from "../../common/model/preference/Preference";
import Director from "./widget/Director";
import SortDirection from "../../common/model/base/SortDirection";
import MatterPanel from "./widget/MatterPanel";
import { Row, Col, Modal } from "antd";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ImagePreviewer from '../widget/previewer/ImagePreviewer';
import Sun from "../../common/model/global/Sun";

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
    this.pager.enableHistory();
    this.refresh();
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any) {
    if(this.props.location.search !== nextProps.location.search) {
      this.pager.enableHistory();
      this.refresh();
    }
  }

  refresh = () => {
    //如果没有任何的排序，默认使用时间倒序
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
    }

    this.pager.httpList();
  };

  checkMatter = () => {
    // todo 可以做优化，并不必要每次都把数组清空然后重新填充，这样效率比较低
    //统计所有的勾选
    this.selectedMatters.splice(0, this.selectedMatters.length);
    this.pager.data.forEach((matter) => {
      if (matter.check) {
        this.selectedMatters.push(matter);
      }
    });
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

  triggerUpload = () => {
    console.log("triggerUpload");
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
    this.pager.data.forEach(item => {
      if (item.isImage()) {
        imageArray.push(item.getPreviewUrl());
        if (item.uuid === matter.uuid) {
          startIndex = imageArray.length - 1
        }
      }
    });

    ImagePreviewer.showMultiPhoto(imageArray, startIndex)
  };

  goToDirectory = (id: string) => {
    this.searchText = null;
    this.pager.setFilterValue('puuid', id);
    this.pager.page = 0;
    const query = this.pager.getParams();
    Sun.navigateQueryTo({path: '/matter/list', query});
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

            <button
              className="btn btn-primary btn-sm mr5 mb5"
              onClick={this.triggerUpload}
            >
              上传
            </button>

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
