import React from 'react';
import "./TableEmpty.less"
import TankComponent from "../../common/component/TankComponent";
import LogoBluePng from "../../assets/image/logo-blue.png";

interface IProps {
}

interface IState {
}

/**
 * 主站加载控件。
 * 在主站加载过程中或者在工作台加载过程中使用
 * 该控件采用fixed布局，会占据全屏
 */
export default class FrameLoading extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render() {

    let that = this

    return (
      <div className="app-frame-loading">
        <div className="loading-box">
          <div>
            <img alt="加载按钮" className="loading-logo" src={LogoBluePng}/>
          </div>
          <div>
            加载中...
          </div>
        </div>
      </div>
    )
  }
}
