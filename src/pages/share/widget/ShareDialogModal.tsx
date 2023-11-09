import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import Share from '../../../common/model/share/Share';
import { Button, Modal } from 'antd';
import { CopyOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import DateUtil from '../../../common/util/DateUtil';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import './ShareDialogModal.less';
import ClipboardUtil from '../../../common/util/ClipboardUtil';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  share: Share;
  onSuccess: () => any;
  onClose: () => any;
}

interface IState {}

export default class ShareDialogModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  clipboard(text: string) {
    ClipboardUtil.copy(text, () => {
      MessageBoxUtil.success(Lang.t('copySuccess'));
    });
  }

  copyAll() {
    const { share } = this.props;
    const url = `${share.getLink()}?code=${share.code}`;
    this.clipboard(url);
  }

  static open = (share: Share) => {
    let modal = Modal.confirm({
      className: 'share-modal custom-handle-modal',
      title: Lang.t('share.shareDetail'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      width: '90vw',
      okCancel: false,
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
    const { share } = this.props;

    return (
      <div className="widget-share-dialog-panel">
        <div className="share-block">
          <div>
            <img className="share-icon" src={share.getIcon()} />
            <span className="name">{share.name}</span>
          </div>
          <div className="mt15">
            <span className="inline-block mr10">
              {Lang.t('share.sharer')}：{share.username}
            </span>
            <span className="inline-block mr10">
              {share.expireInfinity
                ? Lang.t('share.noExpire')
                : `${Lang.t(
                    'share.expireTime'
                  )}：${DateUtil.simpleDateHourMinute(share.expireTime)}`}
            </span>
          </div>
          <div className="mt15">
            {Lang.t('share.link')}：{share.getLink()}
            <CopyOutlined
              className="text-primary"
              onClick={() => this.clipboard(share.getLink())}
            />
          </div>
          <div className="mt15">
            {Lang.t('share.code')}：{share.code}
            <CopyOutlined
              className="text-primary"
              onClick={() => this.clipboard(share.code!)}
            />
          </div>
        </div>
        <div className="mt10 text-right">
          <Button className="mr10" onClick={() => this.props.onClose()}>
            {Lang.t('close')}
          </Button>
          <Button type="primary" onClick={() => this.copyAll()}>
            {Lang.t('matter.copyLinkAndCode')}
          </Button>
        </div>
      </div>
    );
  }
}
