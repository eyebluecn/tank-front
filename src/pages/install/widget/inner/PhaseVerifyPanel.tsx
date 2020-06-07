import React from 'react';
import './PhaseVerifyPanel.less';
import TankComponent from "../../../../common/component/TankComponent";
import Install from "../../../../common/model/install/Install";

interface IProps {

  install: Install
}

interface IState {

}

export default class PhaseVerifyPanel extends TankComponent<IProps, IState> {


  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

  }


  render() {

    let that = this;

    return (
      <div className="widget-phase-verify-panel">


      </div>
    );
  }
}


