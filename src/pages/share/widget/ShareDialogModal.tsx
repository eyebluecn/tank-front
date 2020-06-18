import React from "react";
import copy from "copy-to-clipboard";
import TankComponent from "../../../common/component/TankComponent";
import Share from "../../../common/model/share/Share";
import {Button, Modal} from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import DateUtil from "../../../common/util/DateUtil";
import MessageBoxUtil from "../../../common/util/MessageBoxUtil";
import './ShareDialogModal.less';

interface IProps {
  share: Share;
  showSuccessHint?: boolean;
  onSuccess: () => any;
  onClose: () => any;
}

interface IState {}

export default class ShareDialogModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  clipboard = (text: string) => {
    copy(text);
    MessageBoxUtil.success("复制成功");
  };

  copyAll = () => {
    const { share } = this.props;
    const text = `链接：${share.getLink()} 提取码：${share.code}`;
    this.clipboard(text);
  };

  static open = (share: Share) => {
    let modal = Modal.confirm({
      className: "share-modal",
      title: "分享详情",
      width: "90vw",
      okCancel: false,
      okButtonProps: {
        className: "display-none",
      },
      maskClosable: true,
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
    });
  };

  render() {
    const { share, showSuccessHint } = this.props;

    return (
      <div className="widget-share-dialog-panel">
        <div className="share-block">
          <div>
            <img className="share-icon" src={share.getIcon()} />
            <span className="name">{share.name}</span>
            {showSuccessHint ? (
              <span className="italic">
                分享成功
                <CheckOutlined className="text-success" />
              </span>
            ) : null}
          </div>
          <div className="mt15">
            <span className="inline-block mr10">分享者：{share.username}</span>
            <span className="inline-block mr10">
              {share.expireInfinity
                ? "永久有效"
                : `失效时间：${DateUtil.simpleDateHourMinute(
                    share.expireTime
                  )}`}
            </span>
          </div>
          <div className="mt15">
            链接：{share.getLink()}
            <CopyOutlined
              className="text-primary"
              onClick={() => this.clipboard(share.getLink())}
            />
          </div>
          <div className="mt15">
            提取码：{share.code}
            <CopyOutlined
              className="text-primary"
              onClick={() => this.clipboard(share.code!)}
            />
          </div>
        </div>
        <div className="mt10 text-right">
          <Button className="mr10" onClick={() => this.props.onClose()}>关闭</Button>
          <Button type="primary" onClick={this.copyAll}>复制链接+提取码</Button>
        </div>
      </div>
    );
  }
}
