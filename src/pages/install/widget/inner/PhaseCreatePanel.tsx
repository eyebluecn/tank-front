import React from 'react';
import './PhaseCreatePanel.less';
import TankComponent from '../../../../common/component/TankComponent';
import Install from '../../../../common/model/install/Install';
import MessageBoxUtil from '../../../../common/util/MessageBoxUtil';
import { Button, Form, Input } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons/lib';
import Lang from '../../../../common/model/global/Lang';

interface IProps {
  install: Install;

  onSuccess: () => void;
  onPreStep: () => void;
}

interface IState {}

export default class PhaseCreatePanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let that = this;
  }

  onFinish(values: any) {
    let that = this;
    let install: Install = this.props.install;

    install.adminUsername = values['adminUsername'];
    install.adminPassword = values['adminPassword'];
    install.adminRepassword = values['adminRepassword'];

    install.httpCreateAdmin(function () {
      MessageBoxUtil.success(Lang.t('install.createAdminSuccess'));
      that.props.onSuccess();
    });
  }

  onFinishFailed(errorInfo: any) {}

  render() {
    let that = this;
    let install: Install = this.props.install;

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className="widget-phase-verify-panel">
        <div className="text-center">
          <h2>{Lang.t('install.createAdministrator')}</h2>
        </div>

        <Form
          {...layout}
          name="basic"
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed.bind(this)}
          onValuesChange={() => {
            that.updateUI();
          }}
        >
          <Form.Item
            label={Lang.t('install.administratorUsername')}
            name="adminUsername"
            rules={[{ required: true, message: Lang.t('inputRequired') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={Lang.t('install.administratorPassword')}
            name="adminPassword"
            rules={[{ required: true, message: Lang.t('inputRequired') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="adminRepassword"
            label={Lang.t('install.administratorRePassword')}
            dependencies={['adminPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: Lang.t('inputRequired'),
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('adminPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Lang.t('user.passwordNotSame'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="text-right mt15">
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
              type={'primary'}
              icon={<SendOutlined />}
              htmlType="submit"
            >
              {Lang.t('submit')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
