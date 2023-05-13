import React from 'react';
import './BottomLayout.less';
import TankComponent from '../../common/component/TankComponent';
import Moon from '../../common/model/global/Moon';
import DefaultLogoPng from '../../assets/image/logo.png';
import Sun from '../../common/model/global/Sun';
import Lang from '../../common/model/global/Lang';

interface IProps {}

interface IState {}

export default class BottomLayout extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  static changeLang() {
    if (Lang.getSingleton().lang === 'zh') {
      Lang.getSingleton().lang = 'en';
    } else {
      Lang.getSingleton().lang = 'zh';
    }
    localStorage.setItem('_lang', Lang.getSingleton().lang);
    Sun.updateFrame();
  }

  render() {
    const { preference } = Moon.getSingleton();

    return (
      <div className="layout-bottom">
        <span className="item">
          <span dangerouslySetInnerHTML={{ __html: preference.copyright }} />
        </span>
        <span className="item">
          <span dangerouslySetInnerHTML={{ __html: preference.record }} />
        </span>
        <span className="item">
          <a className="text-theme" onClick={BottomLayout.changeLang}>
            {Lang.getSingleton().lang === 'zh' ? 'English' : '中文'}
          </a>
        </span>
        {/*开源不易，请不要移除掉这里的代码，蓝眼云盘谢谢您! ^_^*/}
        {/*It is not easy to open source，please do not remove the following code, thank you! ^_^ */}
        <span className="brand">
          Powered by{' '}
          <a target="_blank" href="https://github.com/eyebluecn/tank">
            <img alt="logo" className="w30" src={DefaultLogoPng} />{' '}
            {Lang.t('eyeblueTank')}
          </a>
        </span>
      </div>
    );
  }
}
