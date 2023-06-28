import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import { Button, Col, Modal, Row, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './ShareOperationModal.less';
import Share from '../../../common/model/share/Share';
import {
  ShareExpireOption,
  ShareExpireOptionList,
} from '../../../common/model/share/ShareExpireOption';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  onSuccess: (share: Share) => any;
  onClose: () => any;
}

interface IState {}

export default class ShareOperationModal extends TankComponent<IProps, IState> {
  share = new Share();

  constructor(props: IProps) {
    super(props);
  }

  static open = (confirmCallback: (share: Share) => any) => {
    const modal = Modal.confirm({
      className: 'share-modal custom-handle-modal',
      title: Lang.t('matter.share'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      width: '90vw',
      okCancel: false,
      content: (
        <ShareOperationModal
          onSuccess={(share: Share) => {
            confirmCallback(share);
            modal.destroy();
          }}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  };

  selectChange(value: ShareExpireOption) {
    this.share.expireOption = value;
    this.updateUI();
  }

  render() {
    const { share } = this;
    return (
      <div className="widget-share-modal">
        <Row>
          <Col span={8}>{Lang.t('matter.expire')}</Col>
          <Col span={16}>
            <Select
              className="wp100"
              value={share.expireOption}
              onChange={(e) => this.selectChange(e)}
            >
              {ShareExpireOptionList.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {Lang.t(option.name)}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <div className="mt10 text-right">
          <Button
            type="primary"
            className="mr10"
            onClick={() => this.props.onSuccess(share)}
          >
            {Lang.t('matter.share')}
          </Button>
          <Button onClick={this.props.onClose}>{Lang.t('matter.close')}</Button>
        </div>
      </div>
    );
  }
}
