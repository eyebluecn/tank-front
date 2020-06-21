import React from "react";
import "./PreviewEngineCell.less";
import TankComponent from "../../../common/component/TankComponent";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";
import { DeleteOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Switch, Badge, Tooltip } from "antd";
import Lang from "../../../common/model/global/Lang";

interface IProps {
  previewEngine: PreviewEngine;
  index: number;
  onDelete: () => void;
}

interface IState {}

export default class PreviewEngineCell extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { previewEngine } = this.props;

    return (
      <div className="widget-preview-engine-cell">
        <div className="engine-title">
          <span>{Lang.t("preference.engine", this.props.index + 1)}</span>
          <span>
            <DeleteOutlined
              className="btn-action text-danger"
              onClick={() => {
                this.props.onDelete();
              }}
            />
          </span>
        </div>
        <div className="engine-content">
          <Form.Item
            label={
              <Tooltip title={Lang.t("preference.engineRegHelper")}>
                <Badge dot>{Lang.t("preference.engineReg")}</Badge>
              </Tooltip>
            }
            rules={[
              { required: true, message: Lang.t("preference.engineRegHelper") },
            ]}
          >
            <Input
              value={previewEngine.url}
              placeholder={Lang.t("preference.engineRegPlaceHolder")}
              onChange={(e) => {
                previewEngine.url = e.target.value;
                this.updateUI();
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip title={Lang.t("preference.engineSuffixPlaceHolder")}>
                <Badge dot>{Lang.t("preference.engineSuffix")}</Badge>
              </Tooltip>
            }
            rules={[
              {
                required: true,
                message: Lang.t("preference.engineSuffixPlaceHolder"),
              },
            ]}
          >
            <Input
              value={previewEngine.extensions}
              placeholder={Lang.t("preference.engineSuffixPlaceHolder")}
              onChange={(e) => {
                previewEngine.extensions = e.target.value;
                this.updateUI();
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Tooltip title={`${Lang.t("preference.previewCurrent")} or ${Lang.t("preference.previewOpen")}`}>
                <Badge dot>{Lang.t("preference.previewCurrent")}</Badge>
              </Tooltip>
            }
          >
            <Switch
              checked={previewEngine.previewInSite}
              onChange={(val) => {
                previewEngine.previewInSite = val;
                this.updateUI();
              }}
            />
          </Form.Item>
        </div>
      </div>
    );
  }
}
