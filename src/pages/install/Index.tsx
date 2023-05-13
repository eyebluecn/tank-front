import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Index.less';
import TankComponent from '../../common/component/TankComponent';
import Moon from '../../common/model/global/Moon';
import User from '../../common/model/user/User';
import TankTitle from '../widget/TankTitle';
import { Tabs } from 'antd';
import TankContentCard from '../widget/TankContentCard';
import Install from '../../common/model/install/Install';
import MysqlPanel from './widget/MysqlPanel';
import CreateTablePanel from './widget/CreateTablePanel';
import SetAdminPanel from './widget/SetAdminPanel';
import FinishPanel from './widget/FinishPanel';
import Lang from '../../common/model/global/Lang';

const { TabPane } = Tabs;

interface IProps extends RouteComponentProps {}

interface IState {}

export default class Index extends TankComponent<IProps, IState> {
  user: User = Moon.getSingleton().user;

  install: Install = new Install();

  //当前高亮的tab
  activeName: string = 'first';

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

    let install: Install = this.install;

    return (
      <div className="page-install-index">
        <TankTitle name={Lang.t('layout.install')}></TankTitle>

        <TankContentCard>
          <Tabs
            activeKey={this.activeName}
            onTabClick={(activeKey: string) => {
              this.activeName = activeKey;
              this.updateUI();
            }}
          >
            <TabPane tab={Lang.t('install.configMysql')} key="first">
              <MysqlPanel
                install={install}
                onNextStep={() => {
                  this.activeName = 'second';
                  this.updateUI();
                }}
              />
            </TabPane>
            <TabPane
              tab={Lang.t('install.createTable')}
              disabled={!install.verified}
              key="second"
            >
              <CreateTablePanel
                install={install}
                onPreStep={() => {
                  this.activeName = 'first';
                  this.updateUI();
                }}
                onNextStep={() => {
                  this.activeName = 'third';
                  this.updateUI();
                }}
              />
            </TabPane>
            <TabPane
              tab={Lang.t('install.setAdministrator')}
              disabled={!install.tableCreated()}
              key="third"
            >
              <SetAdminPanel
                install={install}
                onPreStep={() => {
                  this.activeName = 'second';
                  this.updateUI();
                }}
                onNextStep={() => {
                  this.activeName = 'forth';
                  this.updateUI();
                }}
              />
            </TabPane>
            <TabPane
              tab={Lang.t('install.finish')}
              disabled={!install.adminConfigured}
              key="forth"
            >
              <FinishPanel install={install} />
            </TabPane>
          </Tabs>
        </TankContentCard>
      </div>
    );
  }
}
