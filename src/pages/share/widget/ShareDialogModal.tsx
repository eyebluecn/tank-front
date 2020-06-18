import React, { Component } from "react";
import TankComponent from "../../../common/component/TankComponent";
import Share from "../../../common/model/share/Share";
import {Modal} from "antd";

interface IProps {
  share: Share,
  showSuccessHint?: boolean,
  onSuccess: () => any,
  onClose: () => any
}

interface IState {}

export class ShareDialogModal extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
  }

  static open = (share: Share) => {
      let modal = Modal.confirm({
        title: "分享详情",
        width: "50vw",
        okCancel: false,
        okButtonProps: {
          className: "display-none"
        },
        content: (
          <ShareDialogModal
            share={share}
            onSuccess={() => {
              modal.destroy();
            }}
            onClose={() => {
              modal.destroy();
            }}
          />
        ),
      })
  };

  render() {
    const { share } = this.props;

    return <div className="widget-share-dialog-panel">
      <div className="share-block">
        <div>
          <img className="share-icon" src={share.getIcon()} />
          <span className="name">{share.name}</span>
        </div>
      </div>

    </div>;
  }
}
