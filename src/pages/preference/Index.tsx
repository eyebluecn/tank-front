import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import "./Index.less";
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import { Button, Tooltip, Tag } from "antd";
import { EditOutlined, ThunderboltOutlined } from "@ant-design/icons";
import InfoCell from "../widget/InfoCell";
import Preference from "../../common/model/preference/Preference";
import TankContentCard from "../widget/TankContentCard";
import FileUtil from "../../common/util/FileUtil";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";
import Lang from "../../common/model/global/Lang";
import SingleTextModal from "../widget/SingleTextModal";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class Index extends TankComponent<IProps, IState> {
  user: User = Moon.getSingleton().user;

  preference: Preference = Moon.getSingleton().preference;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.refresh();
  }

  //refresh preference.
  refresh() {
    let that = this;

    that.preference.httpFetch(function () {
      that.updateUI();
    });
  }

  cleanup() {
    let that = this;
    let preference = this.preference;

    SingleTextModal.open(
      Lang.t("preference.systemCleanupPrompt"),
      "",
      function (text: string) {
        preference.httpSystemCleanup(text, function () {
          MessageBoxUtil.success(Lang.t("operationSuccess"));
        });
      }
    );
  }

  render() {

    return (
      <div className="page-preference-index">
        <TankTitle name={Lang.t("layout.setting")}>
          <Link to={"/preference/edit"}>
            <Button type={"primary"} icon={<EditOutlined />}>
              {Lang.t("edit")}
            </Button>
          </Link>

          <Button
            className={"ml10"}
            type={"primary"}
            danger={true}
            onClick={this.cleanup.bind(this)}
            icon={<ThunderboltOutlined />}
          >
            {Lang.t("preference.systemCleanup")}
          </Button>
        </TankTitle>

        <TankContentCard>
          <InfoCell name={Lang.t("preference.websiteName")}>
            {this.preference.name}
          </InfoCell>

          <InfoCell name={Lang.t("preference.logo")}>
            {this.preference.logoUrl && (
              <img
                src={this.preference.logoUrl}
                alt="logo"
                className="img-logo"
                onClick={() => {
                  ImagePreviewer.showSinglePhoto(this.preference.logoUrl!);
                }}
              />
            )}
          </InfoCell>

          <InfoCell name={"favicon"}>
            {this.preference.faviconUrl && (
              <img
                src={this.preference.faviconUrl}
                alt="logo"
                className="img-favicon"
                onClick={() => {
                  ImagePreviewer.showSinglePhoto(this.preference.faviconUrl!);
                }}
              />
            )}
          </InfoCell>

          <InfoCell name={Lang.t("preference.copyright")}>
            <span
              dangerouslySetInnerHTML={{ __html: this.preference.copyright }}
            />
          </InfoCell>

          <InfoCell name={Lang.t("preference.extraInfo")}>
            <span
              dangerouslySetInnerHTML={{ __html: this.preference.record }}
            />
          </InfoCell>

          <InfoCell name={Lang.t("preference.zipMaxNumLimit")}>
            {this.preference.downloadDirMaxNum === -1
              ? Lang.t("preference.noLimit")
              : this.preference.downloadDirMaxNum}
          </InfoCell>

          <InfoCell name={Lang.t("preference.zipMaxSizeLimit")}>
            {FileUtil.humanFileSize(this.preference.downloadDirMaxSize)}
          </InfoCell>

          <InfoCell name={Lang.t("preference.userDefaultSizeLimit")}>
            {FileUtil.humanFileSize(this.preference.defaultTotalSizeLimit)}
          </InfoCell>

          <InfoCell name={Lang.t("preference.allowRegister")}>
            {this.preference.allowRegister ? Lang.t("yes") : Lang.t("no")}
          </InfoCell>

          <InfoCell name={Lang.t("preference.docLink")}>
            <a href={"https://tank-doc.eyeblue.cn/zh"} target="_blank">
              https://tank-doc.eyeblue.cn/zh
            </a>
          </InfoCell>
          <InfoCell name={Lang.t("preference.previewConfig")}>
            {this.preference.previewConfig.previewEngines.map((engines, index) => (
              <div key={index} className="relative mb10 box">
                <TankContentCard>
                  <Tooltip title={Lang.t("preference.enginePreview")}>
                    {engines.previewInSite ? (
                      <Tag className="preview-tip" color="warning">
                        {Lang.t("preference.previewCurrent")}
                      </Tag>
                    ) : (
                      <Tag className="preview-tip" color="success">
                        {Lang.t("preference.previewOpen")}
                      </Tag>
                    )}
                  </Tooltip>
                  <InfoCell name={Lang.t("preference.engineReg")}>
                    {engines.url}
                  </InfoCell>
                  <InfoCell name={Lang.t("preference.engineSuffix")}>
                    {engines.extensions}
                  </InfoCell>
                </TankContentCard>
              </div>
            ))}
          </InfoCell>
        </TankContentCard>

      </div>
    );
  }
}
