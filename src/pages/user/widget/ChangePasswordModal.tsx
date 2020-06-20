import React from 'react';
import Button from 'antd/lib/button';
import {Form, Input, Modal} from "antd"
import TankComponent from "../../../common/component/TankComponent";
import User from "../../../common/model/user/User";
import Moon from "../../../common/model/global/Moon";

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
            {Moon.t("user.editSomebodyPassword", that.props.user.username)}
          </h2>
        </div>

        <Form
          {...layout}
          name="basic"
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed.bind(this)}
        >
          <Form.Item
            label={Moon.t("user.oldPassword")}
            name="oldPassword"
            rules={[{required: true, message: Moon.t("user.enterPassword")}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            label={Moon.t("user.newPassword")}
            name="password"
            rules={[{required: true, message: Moon.t("user.enterNewPassword")}]}
          >
            <Input.Password/>
          </Form.Item>

          <Form.Item
            name="repeatPassword"
            label={Moon.t("user.confirmPassword")}
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: Moon.t("user.enterNewPassword"),
              },
              ({getFieldValue}) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Moon.t("user.passwordNotSame"));
                },
              }),
            ]}
          >
            <Input.Password/>
          </Form.Item>


          <Form.Item {...tailLayout}>

            <Button className="ml20" type="default" onClick={() => {
              this.props.onClose()
            }}>{Moon.t("close")}</Button>

            <Button className="ml20"
                    type="primary" htmlType="submit">{Moon.t("submit")}</Button>

          </Form.Item>

        </Form>


      </div>
    );
  }
}




