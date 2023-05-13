import React from 'react';
import './PhaseSelectingPanel.less';
import TankComponent from '../../../../common/component/TankComponent';
import Install from '../../../../common/model/install/Install';
import User from '../../../../common/model/user/User';
import { Button } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SecurityScanOutlined,
  SyncOutlined,
  UserAddOutlined,
} from '@ant-design/icons/lib';
import Lang from '../../../../common/model/global/Lang';

interface IProps {
  install: Install;

  onRefresh: () => void;
  onSelectVerify: () => void;
  onSelectCreate: () => void;
  onPreStep: () => void;
  onNextStep: () => void;
}

interface IState {}

export default class PhaseSelectingPanel extends TankComponent<IProps, IState> {
  loadingAdminList: boolean = false;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let that = this;

    this.refreshAdminList();
  }

  refreshAdminList() {
    //开始创建管理员
    let that = this;
    let install: Install = this.props.install;

    that.loadingAdminList = true;
    that.updateUI();

    install.httpAdminList(null, null, function () {
      that.loadingAdminList = false;
      that.updateUI();
      that.props.onRefresh();
    });
  }

  render() {
    let that = this;
    let install: Install = this.props.install;

    return (
      <div className="widget-phase-selecting-panel">
        <div>{Lang.t('install.detectAdministrator')}:</div>
        {install.adminList.map(function (admin: User, index: number) {
          return (
            <div key={index} className="mv10 bold">
              {admin.username}
            </div>
          );
        })}

        <div>{Lang.t('install.useOrCreateAdministrator')}</div>

        <div className="text-right mt15">
          <Button
            className={'ml10'}
            type={'default'}
            icon={<SyncOutlined />}
            onClick={this.refreshAdminList.bind(this)}
            loading={this.loadingAdminList}
          >
            {Lang.t('refresh')}
          </Button>

          <Button
            className={'ml10'}
            type={'default'}
            icon={<SecurityScanOutlined />}
            onClick={this.props.onSelectVerify.bind(this)}
          >
            {Lang.t('install.validateAdministrator')}
          </Button>

          <Button
            className={'ml10'}
            type={'default'}
            icon={<UserAddOutlined />}
            onClick={this.props.onSelectCreate.bind(this)}
          >
            {Lang.t('install.createAdministrator')}
          </Button>

          <Button
            className={'ml10'}
            ghost={true}
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={this.props.onPreStep.bind(this)}
          >
            {Lang.t('install.preStep')}
          </Button>
          <Button
            className={'ml10'}
            ghost={true}
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={this.props.onNextStep.bind(this)}
          >
            {Lang.t('install.nextStep')}
          </Button>
        </div>
      </div>
    );
  }
}
