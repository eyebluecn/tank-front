import React from "react";
import {RouteComponentProps} from "react-router-dom";
import "./Detail.less";
import TankComponent from "../../common/component/TankComponent";
import Matter from "../../common/model/matter/Matter";
import {Space, Spin, Tag} from "antd";
import StringUtil from "../../common/util/StringUtil";
import TankTitle from "../widget/TankTitle";
import DownloadToken from "../../common/model/download/token/DownloadToken";
import DateUtil from "../../common/util/DateUtil";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import ImageCacheList from "./widget/imageCache/ImageCacheList";
import ClipboardUtil from "../../common/util/ClipboardUtil";
import Lang from "../../common/model/global/Lang";
import InfoCell from "../widget/InfoCell";
import TankContentCard from "../widget/TankContentCard";
import Color from "../../common/model/base/option/Color";

interface RouteParam {
  uuid: string;
}

interface IProps extends RouteComponentProps<RouteParam> {
}

interface IState {
}

export default class Detail extends TankComponent<IProps, IState> {
  matter = new Matter();
  downloadToken = new DownloadToken();

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {uuid} = this.props.match.params;
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
    const {privacy} = this.matter;
    const textToCopy = this.matter.getDownloadUrl(
      privacy ? this.downloadToken.uuid! : undefined
    );
    ClipboardUtil.copy(textToCopy, () => {
      MessageBoxUtil.success(Lang.t("copySuccess"));
    })
  };

  render() {
    const {matter} = this;
    return (
      <Spin tip={Lang.t("loading")} spinning={matter.detailLoading}>
        <div className="page-matter-detail">
          <TankTitle name={Lang.t("matter.fileDetail")}/>

          <TankContentCard>
            <div className="info">
              <InfoCell name={Lang.t("matter.fileInfo")}>
                {matter.name} <Tag color={Color.DANGER}>{Lang.t("matter.deleted")}</Tag>
              </InfoCell>
              <InfoCell name={Lang.t("matter.path")}>
                {matter.path}
              </InfoCell>
              <InfoCell name={Lang.t("matter.createTime")}>
                {DateUtil.simpleDateTime(matter.createTime)}
              </InfoCell>
              <InfoCell name={Lang.t("matter.updateTime")}>
                {DateUtil.simpleDateTime(matter.updateTime)}
              </InfoCell>
              {
                matter.deleted && (
                  <InfoCell name={Lang.t("matter.deleteTime")}>
                    {DateUtil.simpleDateTime(matter.deleteTime)}
                  </InfoCell>
                )
              }
              {!matter.dir ? (
                <>
                  <InfoCell name={Lang.t("matter.size")}>
                    {StringUtil.humanFileSize(matter.size)}
                  </InfoCell>
                  <InfoCell name={Lang.t("matter.publicOrPrivate")}>
                    {matter.privacy
                      ? Lang.t("matter.privateInfo")
                      : Lang.t("matter.publicInfo")}
                  </InfoCell>
                  <InfoCell name={Lang.t("matter.downloadTimes")}>
                    {matter.times}
                  </InfoCell>
                  <InfoCell name={Lang.t("matter.operations")}>
                    <Space>
                      <a onClick={() => matter.download()}>{Lang.t("matter.download")}</a>
                      <a onClick={() => matter.preview()}>{Lang.t("matter.preview")}</a>
                      <a onClick={this.copyLink}>
                        {matter.privacy ? Lang.t("matter.oneTimeLink") : Lang.t("matter.copyPath")}
                      </a>
                    </Space>
                  </InfoCell>
                </>
              ) : null}
            </div>
          </TankContentCard>

        </div>

        {!matter.dir && matter.uuid && matter.isImage() ? (
          <ImageCacheList initFilter={{matterUuid: matter.uuid}}/>
        ) : null}
      </Spin>
    );
  }
}
