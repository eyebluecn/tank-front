import React from 'react';
import './CreateTablePanel.less';
import { Alert, Button, Spin, Tag } from 'antd';
import Install from '../../../common/model/install/Install';
import TankComponent from '../../../common/component/TankComponent';
import Color from '../../../common/model/base/option/Color';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  FormatPainterOutlined,
  SoundOutlined,
  SyncOutlined,
} from '@ant-design/icons/lib';
import MessageBoxUtil from '../../../common/util/MessageBoxUtil';
import Lang from '../../../common/model/global/Lang';
import InstallFieldInfo from '../../../common/model/install/InstallFieldInfo';

interface IProps {
  install: Install;
  onPreStep: () => void;
  onNextStep: () => void;
}

interface IState {}

export default class CreateTablePanel extends TankComponent<IProps, IState> {
  loading: boolean = true;

  createTableLoading: boolean = false;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let that = this;

    this.fetchTableInfoList();
  }

  fetchTableInfoList() {
    let that = this;
    let install: Install = this.props.install;

    this.loading = true;
    this.updateUI();

    install.httpTableInfoList(null, null, function () {
      that.loading = false;
      that.updateUI();
    });
  }

  createTable() {
    //开始建表
    let that = this;
    let install: Install = this.props.install;

    that.createTableLoading = true;
    that.updateUI();

    install.httpCreateTable(
      function () {
        MessageBoxUtil.success(Lang.t('install.createTableSuccess'));
      },
      null,
      function () {
        that.createTableLoading = false;
        that.updateUI();
      }
    );
  }

  goToPrevious() {
    let that = this;

    this.props.onPreStep();
  }

  goToNext() {
    let that = this;
    let install: Install = this.props.install;

    if (install.tableCreated()) {
      this.props.onNextStep();
    } else {
      MessageBoxUtil.error(Lang.t('install.crateTableFirst'));
    }
  }

  render() {
    let that = this;

    let install: Install = this.props.install;

    let tableCreated: boolean = install.tableCreated();

    return (
      <div className="widget-create-panel">
        <Spin spinning={that.loading}>
          {install.tableInfoList.map(function (tableInfo: any, index: number) {
            return (
              <div className="install-block" key={index}>
                <div className="f16">
                  {tableInfo.name}

                  {tableInfo.tableExist &&
                    tableInfo.missingFields.length === 0 && (
                      <Tag className="mh5" color={Color.SUCCESS}>
                        {Lang.t('install.installed')}
                      </Tag>
                    )}

                  {tableInfo.tableExist &&
                    tableInfo.missingFields.length > 0 && (
                      <Tag className="mh5" color={Color.DANGER}>
                        {Lang.t('install.installedButMissing')}
                      </Tag>
                    )}

                  {!tableInfo.tableExist && (
                    <Tag className="mh5" color={Color.WARNING}>
                      {Lang.t('install.toBeInstalled')}
                    </Tag>
                  )}
                </div>

                <div className="mt10">
                  {Lang.t('install.allFields')}:
                  {tableInfo.allFields
                    .filter((field: InstallFieldInfo, index: number) => {
                      return field.name;
                    })
                    .map(function (field: InstallFieldInfo, j: number) {
                      return (
                        <Tag className="mh5 mv5" key={j}>
                          {field.name}
                        </Tag>
                      );
                    })}
                </div>

                {tableInfo.tableExist && tableInfo.missingFields.length > 0 && (
                  <div className="mt10">
                    {Lang.t('install.missingFields')}:
                    {tableInfo.missingFields
                      .filter((field: InstallFieldInfo, index: number) => {
                        return field.name;
                      })
                      .map(function (field: InstallFieldInfo, j: number) {
                        return (
                          <Tag className="mh5 mv5" key={j}>
                            {field.name}
                          </Tag>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <Alert
              message={
                <div>
                  <div>
                    <SoundOutlined /> {Lang.t('install.tableNotice')}
                  </div>
                  <div>
                    <ol>
                      <li> {Lang.t('install.tableNotice1')}</li>
                      <li>{Lang.t('install.tableNotice2')}</li>
                      <li>{Lang.t('install.tableNotice3')}</li>
                      <li>{Lang.t('install.tableNotice4')}</li>
                    </ol>
                  </div>
                </div>
              }
              type="info"
            />
          </div>

          <div className="text-right mt15">
            <Button
              className={'ml10'}
              type={'default'}
              icon={<SyncOutlined />}
              onClick={this.fetchTableInfoList.bind(this)}
            >
              {Lang.t('refresh')}
            </Button>

            <Button
              className={'ml10'}
              type={tableCreated ? 'primary' : 'default'}
              icon={
                tableCreated ? <CheckOutlined /> : <FormatPainterOutlined />
              }
              onClick={this.createTable.bind(this)}
              disabled={tableCreated}
              loading={this.createTableLoading}
            >
              {tableCreated
                ? Lang.t('install.createFinish')
                : Lang.t('install.oneKeyCreate')}
            </Button>

            <Button
              className={'ml10'}
              ghost={true}
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={this.goToPrevious.bind(this)}
            >
              {Lang.t('install.preStep')}
            </Button>
            <Button
              className={'ml10'}
              ghost={true}
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={this.goToNext.bind(this)}
            >
              {Lang.t('install.nextStep')}
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}
