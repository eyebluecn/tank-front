import React from 'react';
import './PhaseVerifyPanel.less';
import TankComponent from "../../../../common/component/TankComponent";
import Install from "../../../../common/model/install/Install";
import {Button, Form, Input} from "antd";
import {ArrowLeftOutlined, SendOutlined} from "@ant-design/icons/lib";
import MessageBoxUtil from "../../../../common/util/MessageBoxUtil";

interface IProps {

  install: Install


  onSuccess: () => void
  onPreStep: () => void

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


  onFinish(values: any) {
    console.log('Success:', values);

    let that = this;
    let install: Install = this.props.install

    install.adminUsername = values["adminUsername"]
    install.adminPassword = values["adminPassword"]

    install.httpValidateAdmin(function () {
      MessageBoxUtil.success("管理员验证成功!")

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


