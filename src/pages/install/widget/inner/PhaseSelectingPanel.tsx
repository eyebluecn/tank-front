import React from 'react';
import './PhaseSelectingPanel.less';
import TankComponent from "../../../../common/component/TankComponent";
import Install from "../../../../common/model/install/Install";
import User from "../../../../common/model/user/User";
import {Button} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SecurityScanOutlined,
  SyncOutlined,
  UserAddOutlined
} from "@ant-design/icons/lib";
import MessageBoxUtil from "../../../../common/util/MessageBoxUtil";

interface IProps {
  install: Install

  onRefresh: () => void
  onSelectVerify: () => void
  onSelectCreate: () => void
  onPreStep: () => void
  onNextStep: () => void

}

interface IState {

}

export default class PhaseSelectingPanel extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

  }

  render() {

    let that = this;
    let install: Install = this.props.install

    return (
      <div className="widget-phase-selecting-panel">

          <div>
            检测到系统中已经存在有以下管理员：
          </div>
          {
            install.adminList.map(function (admin: User, index: number) {
              return (
                <div className="mv10 bold">
                  {admin.username}
                </div>
              )
            })
          }

          <div>
            你可以使用其中一位管理员的用户名和密码进行验证，或者创建一位新的管理员账户
          </div>

          <div className="text-right mt15">
            <Button className={'ml10'} type={"default"}
                    icon={<SyncOutlined/>}
                    onClick={this.props.onRefresh.bind(this)}
            >
              刷新
            </Button>

            <Button className={'ml10'} type={"default"}
                    icon={<SecurityScanOutlined/>}
                    onClick={this.props.onSelectVerify.bind(this)}
            >
              验证管理员账户
            </Button>

            <Button className={'ml10'} type={"default"}
                    icon={<UserAddOutlined/>}
                    onClick={this.props.onSelectCreate.bind(this)}
            >
              创建管理员账户
            </Button>

            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowLeftOutlined/>}
                    onClick={this.props.onPreStep.bind(this)}>
              上一步
            </Button>
            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowRightOutlined/>}
                    onClick={this.props.onNextStep.bind(this)}>
              下一步
            </Button>

          </div>

      </div>
    );
  }
}


