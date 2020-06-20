import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import Matter from "../../../common/model/matter/Matter";
import StringUtil from "../../../common/util/StringUtil";
import { Progress } from "antd";
import "./UploadMatterPanel.less";
import Lang from "../../../common/model/global/Lang";

interface IProps {
  matter: Matter;
}

interface IState {}

export default class UploadMatterPanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  format = (percent: number) => {
    return `${percent.toFixed(1)}%`
  };

  render() {
    const { matter } = this.props;
    return (
      <div className="upload-matter-panel">
        {matter.loading ? (
          <div className="huge-block clearfix">
            <div className="media">
              <div className="media-body">{matter.file!.name}</div>
            </div>
            <Progress
              className="progress"
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
              format={() => this.format(matter.progress * 100)}
              percent={matter.progress * 100}
              status="active"
            />
            <div>
              {`${Lang.t("matter.uploaded")}: ${StringUtil.humanFileSize(
                matter.file!.size * matter.progress
              )}/${StringUtil.humanFileSize(
                matter.file!.size
              )} ${Lang.t("matter.speed")}:${StringUtil.humanFileSize(matter.speed)}s`}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
