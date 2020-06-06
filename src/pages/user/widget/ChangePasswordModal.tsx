import React from 'react';
import Button from 'antd/lib/button';
import {Form, Input, Modal} from "antd"
import TankComponent from "../../../common/component/TankComponent";
import User from "../../../common/model/user/User";

interface IProps {
  user: User
  onSuccess: () => void
  onClose: () => void
}

interface IState {

}

export default class ChangePasswordModal extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  static open(user: User, onSuccess: () => void) {

    let modal = Modal.success({
      okCancel: false,
      okButtonProps: {
        className: "display-none"
      },
      icon: null,
      content: <ChangePasswordModal
        user={user}
        onSuccess={() => {
          modal.destroy()
          onSuccess()
        }}
        onClose={() => {
          modal.destroy()
        }}/>,
    })

  }


  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let currentUser: User = this.props.user

    currentUser.httpChangePassword(values["oldPassword"], values["repeatPassword"], function () {


      that.props.onSuccess()

    })

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    const layout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const tailLayout = {
      wrapperCol: {offset: 8, span: 16},
    };

    return (
      <div className="widget-single-text-modal">

        <div className="text-center">
          <h2>
            修改{that.props.user.username}的密码
          </h2>
        </div>

        <Form
          {...layout}
          name="basic"
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed.bind(this)}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{required: true, message: '请输入原密码'}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            label="新密码"
            name="password"
            rules={[{required: true, message: '请输入新密码'}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            name="repeatPassword"
            label="确认密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请确认密码!',
              },
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入密码不匹配!');
                },
              }),
            ]}
          >
            <Input.Password/>
          </Form.Item>


          <Form.Item {...tailLayout}>

            <Button className="ml20" type="default" onClick={() => {
              this.props.onClose()
            }}>关闭</Button>

            <Button className="ml20"
                    type="primary" htmlType="submit">提交</Button>

          </Form.Item>

        </Form>


      </div>
    );
  }
}




