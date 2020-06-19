import React from 'react';
import "./TankLayout.less"
import TankComponent from "../../common/component/TankComponent";
import Preference from "../../common/model/preference/Preference";
import Moon from "../../common/model/global/Moon";
import DefaultLogoPng from '../../assets/image/logo.png';

interface IProps {

}

interface IState {

}

/**
 * 这里是页面总布局。
 * 只负责大块布局，不负责块中具体内容。
 */
export default class TankLayout extends TankComponent <IProps, IState> {

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
      <div className="tank-layout">

        <div>

        </div>


      </div>
    )
  }
}

