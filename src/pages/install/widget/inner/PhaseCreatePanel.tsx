import React from 'react';
import './PhaseCreatePanel.less';
import TankComponent from "../../../../common/component/TankComponent";
import Install from "../../../../common/model/install/Install";
import MessageBoxUtil from "../../../../common/util/MessageBoxUtil";
import {Button, Form, Input} from "antd";
import {ArrowLeftOutlined, SendOutlined} from "@ant-design/icons/lib";

interface IProps {

  install: Install

  onSuccess: () => void
  onPreStep: () => void

}

interface IState {

}

export default class PhaseCreatePanel extends TankComponent<IProps, IState> {


  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

  }

  onFinish(values: any) {
    console.log('Success:', values);

    let that = this;
    let install: Install = this.props.install

    install.adminUsername = values["adminUsername"]
    install.adminPassword = values["adminPassword"]
    install.adminRepassword = values["adminRepassword"]

    install.httpCreateAdmin(function () {
      MessageBoxUtil.success("管理员创建成功!")
      that.props.onSuccess()
    })
  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };

  render() {

    let that = this;
    let install: Install = this.props.install

    const layout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };


    return (
      <div className="widget-phase-verify-panel">

        <div className="text-center">
          <h2>创建新管理员账户</h2>
        </div>

        <Form
          {...layout}
          name="basic"
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed.bind(this)}
          onValuesChange={() => {
            that.updateUI()
          }}
        >
          <Form.Item
            label="管理员用户名"
            name="adminUsername"
            rules={[{required: true, message: '请输入管理员用户名!'}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="管理员密码"
            name="adminPassword"
            rules={[{required: true, message: '请输入管理员密码!'}]}
          >
            <Input.Password/>
          </Form.Item>


          <Form.Item
            name="adminRepassword"
            label="确认密码"
            dependencies={['adminPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入确认密码!',
              },
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('adminPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入密码不匹配!');
                },
              }),
            ]}
          >
            <Input.Password/>
          </Form.Item>

          <div className="text-right mt15">

            <Button className={'ml10'} ghost={true} type="primary" icon={<ArrowLeftOutlined/>}
                    onClick={this.props.onPreStep.bind(this)}>
              上一步
            </Button>

            <Button className={'ml10'} type={"primary"}
                    icon={<SendOutlined/>}
                    htmlType="submit"
            >
              提交
            </Button>

          </div>
        </Form>

      </div>
    );
  }
}


