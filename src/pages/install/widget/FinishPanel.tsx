import React from 'react';
import './FinishPanel.less';
import Install from "../../../common/model/install/Install";
import TankComponent from "../../../common/component/TankComponent";
import {Button, Result} from "antd";
import {HomeOutlined} from "@ant-design/icons/lib";

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
        <Result
          status="success"
          title="安装信息配置完毕!"
          subTitle="点击下方按钮来完成安装过程并进入首页。"
          extra={[
            <Button icon={<HomeOutlined/>} type="primary" key="home">
              完成，并进入首页
            </Button>
          ]}
        />

      </div>
    );
  }
}


