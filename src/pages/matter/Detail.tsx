import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./Detail.less";
import TankComponent from "../../common/component/TankComponent";
import Matter from "../../common/model/matter/Matter";
import { Spin, Space } from "antd";
import StringUtil from "../../common/util/StringUtil";
import TankTitle from "../widget/TankTitle";
import DownloadToken from "../../common/model/download/token/DownloadToken";
import DateUtil from "../../common/util/DateUtil";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import ImageCacheList from "./widget/imageCache/ImageCacheList";
import ClipboardUtil from "../../common/util/ClipboardUtil";

interface RouteParam {
  uuid: string;
}

interface IProps extends RouteComponentProps<RouteParam> {}

interface IState {}

export default class Detail extends TankComponent<IProps, IState> {
  matter = new Matter();
  downloadToken = new DownloadToken();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { uuid } = this.props.match.params;
    this.matter.uuid = uuid;
    let that = this;
    this.matter.httpDetail((response: any) => {
      that.updateUI();
      if (!response.data.data.dir) {
        that.downloadToken.httpFetchDownloadToken(that.matter.uuid!);
      }
    });
  }

  copyLink = () => {
    const { privacy } = this.matter;
    const textToCopy = this.matter.getDownloadUrl(
      privacy ? this.downloadToken.uuid! : undefined
    );
    ClipboardUtil.copy(textToCopy, () => {
      MessageBoxUtil.success("操作成功");
    })
  };

  render() {
    const { matter } = this;
    return (
      <Spin tip="加载中" spinning={matter.detailLoading}>
        <div className="matter-detail">
          <TankTitle name={"文件详情"}></TankTitle>

          <div className="info">
            <p>
              <span>文件基本信息：</span>
              <span>{matter.name}</span>
            </p>
            <p>
              {/*todo move to breadhead, linkable path*/}
              <span>路径：</span>
              <span>{matter.path}</span>
            </p>
            <p>
              <span>创建日期：</span>
              <span>{DateUtil.simpleDateTime(matter.createTime)}</span>
            </p>
            <p>
              <span>修改日期：</span>
              <span>{DateUtil.simpleDateTime(matter.updateTime)}</span>
            </p>
            {!matter.dir ? (
              <>
                <p>
                  <span>大小：</span>
                  <span>{StringUtil.humanFileSize(matter.size)}</span>
                </p>
                <p>
                  <span>文件公开性：</span>
                  <span>
                    {matter.privacy
                      ? "私有文件，只有自己或者授权的用户可以下载"
                      : "公有文件，任何人可以通过链接下载"}
                  </span>
                </p>
                <p>
                  <span>下载次数：</span>
                  <span>{matter.times}</span>
                </p>
                <div>
                  <span>操作：</span>
                  <Space>
                    <a onClick={() => matter.download()}>下载</a>
                    <a onClick={() => matter.preview()}>预览</a>
                    <a onClick={this.copyLink}>
                      {matter.privacy ? "一次性链接" : "复制链接"}
                    </a>
                  </Space>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {!matter.dir && matter.uuid && matter.isImage() ? (
          <div className="matter-detail">
            <ImageCacheList initFilter={{ matterUuid: matter.uuid }} />
          </div>
        ) : null}
      </Spin>
    );
  }
}
