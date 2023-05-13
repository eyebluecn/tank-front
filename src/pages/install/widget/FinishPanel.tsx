import React from 'react';
import './FinishPanel.less';
import Install from '../../../common/model/install/Install';
import TankComponent from '../../../common/component/TankComponent';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons/lib';
import Lang from '../../../common/model/global/Lang';

interface IProps {
  install: Install;
}

interface IState {}

export default class FinishPanel extends TankComponent<IProps, IState> {
  loading: boolean = false;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let that = this;

    that.updateUI();
  }

  finish() {
    let that = this;
    let install: Install = this.props.install;

    that.loading = true;
    that.updateUI();

    install.httpFinish(
      function () {
        window.location.href = '/';
      },
      null,
      function () {
        that.loading = false;
        that.updateUI();
      }
    );
  }

  render() {
    let that = this;

    return (
      <div className="widget-finish-panel">
        <Result
          status="success"
          title={Lang.t('install.congratulationInstall')}
          subTitle={Lang.t('install.pressToHome')}
          extra={[
            <Button
              icon={<HomeOutlined />}
              type="primary"
              key="home"
              loading={that.loading}
              onClick={this.finish.bind(this)}
            >
              {Lang.t('install.enterHome')}
            </Button>,
          ]}
        />
      </div>
    );
  }
}
