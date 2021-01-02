import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import { Modal, Button } from "antd";
import Lang from "../../../common/model/global/Lang";
import {
  ExclamationCircleFilled,
} from "@ant-design/icons";
import "./MatterDeleteModal.less";

interface IProps {
  onSoftDel: () => void;
  onHardDel: () => void;
  onClose: () => void;
}

interface IState {}

export default class MatterDeleteModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  static open(onSoftDel: () => void, onHardDel: () => void) {
    let modal = Modal.warning({
      className: "delete-modal",
      title: Lang.t("delete"),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      okCancel: false,
      okButtonProps: {
        className: "display-none",
      },
      content: (
        <MatterDeleteModal
          onSoftDel={() => {
            onSoftDel();
            modal.destroy();
          }}
          onHardDel={() => {
            onHardDel();
            modal.destroy();
          }}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  }

  render() {
    return (
      <div className="matter-delete-modal">
        <p>{Lang.t("actionDeleteConfirm")}</p>
        <div className="mt30 text-right">
          <Button className="mr10" onClick={this.props.onClose}>
            {Lang.t("cancel")}
          </Button>
          <Button type="primary" className="mr10" onClick={this.props.onSoftDel}>
            {Lang.t("matter.intoRecycleBin")}
          </Button>
          <Button type="primary" danger onClick={this.props.onHardDel}>
            {Lang.t("delete")}
          </Button>
        </div>
      </div>
    );
  }
}
