import React from "react";
import "./PreviewEngineEditCell.less";
import TankComponent from "../../../common/component/TankComponent";
import PreviewEngine from "../../../common/model/preference/model/PreviewEngine";
import { DeleteOutlined } from "@ant-design/icons";
import { Form, Input, Switch } from "antd";
import Lang from "../../../common/model/global/Lang";

interface IProps {
  previewEngine: PreviewEngine;
  index: number;
  onDelete: () => void;
}

interface IState {}

export default class PreviewEngineEditCell extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
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
            label={Lang.t("preference.engineReg")}
            tooltip={Lang.t("preference.engineRegHelper")}
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
            label={Lang.t("preference.engineSuffix")}
            tooltip={Lang.t("preference.engineSuffixPlaceHolder")}
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
            label={Lang.t("preference.previewCurrent")}
            tooltip={`${Lang.t("preference.previewCurrent")} or ${Lang.t(
              "preference.previewOpen"
            )}`}
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
