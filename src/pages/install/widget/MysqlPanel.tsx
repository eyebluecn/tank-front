import React from 'react';
import './MysqlPanel.less';
import {Tabs} from 'antd';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";

const {TabPane} = Tabs;

interface IProps {

  install: Install
}

interface IState {

}

export default class MysqlPanel extends TankComponent<IProps, IState> {


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
      <div className="widget-mysql-panel">




      </div>
    );
  }
}


