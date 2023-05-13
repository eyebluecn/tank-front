import React from 'react';
import { Modal } from 'antd';
import TankComponent from '../../../common/component/TankComponent';
import Lang from '../../../common/model/global/Lang';
import BottomLayout from '../BottomLayout';
import DefaultLogoPng from '../../../assets/image/logo.png';
import './AboutModal.less';
import Moon from '../../../common/model/global/Moon';

interface IProps {
  onSuccess: () => any;
  onClose: () => any;
}

interface IState {}

export default class AboutModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  static open = () => {
    const modal = Modal.confirm({
      className: 'about-modal',
      title: Lang.t('layout.about'),
      width: '90vw',
      okCancel: false,
      okText: Lang.t('confirm'),
      maskClosable: true,
      content: (
        <AboutModal
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

  changeLang() {
    BottomLayout.changeLang();
    this.updateUI();
  }

  render() {
    const { preference } = Moon.getSingleton();
    return (
      <div className="about-modal-box">
        <span className="item">
          <span dangerouslySetInnerHTML={{ __html: preference.copyright }} />
        </span>
        <span className="item">
          <span dangerouslySetInnerHTML={{ __html: preference.record }} />
        </span>
        <p className="item" onClick={() => this.changeLang()}>
          {Lang.getSingleton().lang === 'zh' ? 'English' : '中文'}
        </p>
        <p className="brand">
          Powered by{' '}
          <a target="_blank" href="https://github.com/eyebluecn/tank">
            <img alt="logo" className="w30" src={DefaultLogoPng} />
            {Lang.t('eyeblueTank')}
          </a>
        </p>
      </div>
    );
  }
}
