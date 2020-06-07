import React from 'react';
import './FinishPanel.less';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";

interface IProps {

  install: Install
}

interface IState {

}

export default class FinishPanel extends TankComponent<IProps, IState> {


  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

    that.updateUI();
  }


  render() {

    let that = this;

    return (
      <div className="widget-finish-panel">
        完成面板
      </div>
    );
  }
}


