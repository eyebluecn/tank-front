import React from 'react';
import {Link, RouteComponentProps} from "react-router-dom";
import "./Register.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Col, Form, Input, Row} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import MessageBoxUtil from "../../common/util/MessageBoxUtil";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Register extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  onFinish(values: any) {
    console.log('Success:', values);

    let that = this

    let user = that.user

    user.httpRegister(values["username"], values["password"], function () {
      MessageBoxUtil.success(Moon.t("user.loginSuccess"))

      that.props.history.push('/')

    })

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    return (
      <div className="user-register">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              {Moon.t("user.welcomeRegister")}
            </div>

            <Form
              name="basic"
              initialValues={{remember: true}}
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed.bind(this)}
            >
              <Form.Item
                name="username"
                rules={[{required: true, message: Moon.t("user.enterUsername")}]}
              >
                <Input size="large" placeholder={Moon.t("user.enterUsername")} prefix={<UserOutlined/>}/>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{required: true, message: Moon.t("user.enterPassword")}]}
              >
                <Input.Password size="large" placeholder={Moon.t("user.enterPassword")} prefix={<LockOutlined/>}/>
              </Form.Item>

              <Form.Item
                name="rePassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: Moon.t("user.enterPassword"),
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

                <Input.Password size="large" placeholder={Moon.t("user.confirmPassword")} prefix={<LockOutlined/>}/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<UserOutlined/>} block={true} htmlType="submit">
                  {Moon.t("user.register")}
                </Button>
              </Form.Item>


              <div className="text-right">
                <Link to={"/user/login"}>
                  <span className="link">{Moon.t("user.goToLogin")}</span>
                </Link>
              </div>


            </Form>

          </Col>
        </Row>

      </div>
    );
  }
}


