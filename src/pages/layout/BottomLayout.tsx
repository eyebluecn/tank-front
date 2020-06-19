import React from 'react';
import "./BottomLayout.less"
import TankComponent from "../../common/component/TankComponent";
import Preference from "../../common/model/preference/Preference";
import Moon from "../../common/model/global/Moon";
import DefaultLogoPng from '../../assets/image/logo.png';

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

  }

  render() {

    let that = this

    let preference: Preference = Moon.getSingleton().preference

    return (
      <div className="layout-bottom">
        <span className="item">
			<span>{preference.copyright}</span>
		</span>
        <span className="item">
			<span>{preference.record}</span>
		</span>
        <span className="item">
			<span onClick={this.changeLang.bind(this)}>
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

