import React from 'react';
import Button from 'antd/lib/button';
import { Modal } from 'antd';
import './TransfigurationModal.less';
import User from '../../../common/model/user/User';
import TankComponent from '../../../common/component/TankComponent';
import BrowserUtil from '../../../common/util/BrowserUtil';
import ClipboardUtil from '../../../common/util/ClipboardUtil';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  user: User;
  onClose: () => void;
}

interface IState {}

export default class TransfigurationModal extends TankComponent<
  IProps,
  IState
> {
  authentication: string = '';

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    let that = this;

    this.props.user.httpTransfiguration(function (text: string) {
      that.authentication = text;
      that.updateUI();
    });
  }

  static open(user: User) {
    let modal = Modal.success({
      className: 'custom-handle-modal',
      okCancel: false,
      icon: null,
      content: (
        <TransfigurationModal
          user={user}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  }

  render() {
    let that = this;

    let textToCopy =
      BrowserUtil.fullHost() + '/user/authentication/' + that.authentication;

    return (
      <div className="widget-transfiguration-modal">
        <div className="text-center">
          <h2>{Lang.t('user.transfigurationPromptText')}</h2>
        </div>
        <div>{Lang.t('user.transfigurationPrompt')}</div>
        <div>{textToCopy}</div>

        <div className="text-center mt20">
          <Button
            className="ml20"
            type="default"
            onClick={() => {
              this.props.onClose();
            }}
          >
            {Lang.t('close')}
          </Button>

          <Button
            className="ml20"
            type="primary"
            onClick={() => {
              ClipboardUtil.copy(
                textToCopy,
                function () {
                  MessageBoxUtil.success(Lang.t('copySuccess'));
                  that.props.onClose();
                },
                function () {
                  MessageBoxUtil.error(Lang.t('copyError'));
                }
              );
            }}
          >
            {Lang.t('copy')}
          </Button>
        </div>
      </div>
    );
  }
}
