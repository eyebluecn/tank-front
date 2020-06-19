import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import { Modal, Button, Col, Row, Select } from "antd";
import "./ShareOperationModal.less";
import Share from "../../../common/model/share/Share";
import { ShareExpireOptionList } from "../../../common/model/share/ShareExpireOption";

interface IProps {
  onSuccess: () => any;
  onClose: () => any;
}

interface IState {}

export default class ShareOperationModal extends TankComponent<IProps, IState> {
  share = new Share();

  constructor(props: IProps) {
    super(props);
  }

  static open = (confirmCallback: () => any) => {
    const modal = Modal.confirm({
      className: "share-modal",
      title: "分享",
      width: "90vw",
      okCancel: false,
      okButtonProps: {
        className: "display-none",
      },
      content: (
        <ShareOperationModal
          onSuccess={() => {
            confirmCallback();
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
    return (
      <div className="widget-share-modal">
        <Row>
          <Col span={8}>有效期</Col>
          <Col span={16}>
            <Select>
              {ShareExpireOptionList.map((option) => (
                <Select.Option value={option.value} onChange={() => {}}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }
}
