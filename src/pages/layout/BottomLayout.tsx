import React from 'react';
import "./BottomLayout.less"
import TankComponent from "../../common/component/TankComponent";
import Preference from "../../common/model/preference/Preference";
import Moon from "../../common/model/global/Moon";
import DefaultLogoPng from '../../assets/image/logo.png';
import Cookies from "js-cookie";

interface IProps {

}

interface IState {

}

export default class BottomLayout extends TankComponent <IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  changeLang() {

    if (Moon.getSingleton().lang === 'zh') {
      Moon.getSingleton().lang = 'en'
    } else {
      Moon.getSingleton().lang = 'zh'
    }
    Cookies.set('_lang', Moon.getSingleton().lang);

    this.updateUI()
  }

  render() {

    let that = this

    let preference: Preference = Moon.getSingleton().preference

    return (
      <div className="layout-bottom">
        <span className="item">
          <span dangerouslySetInnerHTML={{__html: preference.copyright}}/>
		</span>
        <span className="item">
          <span dangerouslySetInnerHTML={{__html: preference.record}}/>
		</span>
        <span className="item">
			<span className="link" onClick={this.changeLang.bind(this)}>
        {Moon.getSingleton().lang === 'zh' ? 'English' : '中文'}
      </span>
      </span>

        {/*开源不易，请不要移除掉这里的代码，蓝眼云盘谢谢您 ^_^*/}
        <span className="brand">
			Powered by <a target="_blank" href="https://github.com/eyebluecn/tank">
      <img alt="logo" className="w30" src={DefaultLogoPng}/>
          蓝眼云盘</a>
		</span>
      </div>
    )
  }
}

