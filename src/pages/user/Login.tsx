import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Login.less"
import TankComponent from "../../common/component/TankComponent";
import {Button, Col, Form, Input, message as MessageBox, Row} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import {LockOutlined, UserOutlined} from '@ant-design/icons';


interface IProps extends RouteComponentProps {

}

interface IState {

}

class RawLogin extends TankComponent<IProps, IState> {

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

    user.httpLogin(values["username"], values["password"], function () {
      MessageBox.success("登录成功！")

      that.props.history.push('/')

    })

  };

  onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo);
  };


  render() {

    let that = this

    return (
      <div className="user-login">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              欢迎登录
            </div>

            <Form
              name="basic"
              initialValues={{remember: true}}
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed.bind(this)}
            >
              <Form.Item
                name="username"
                rules={[{required: true, message: 'Please input your username!'}]}
              >
                <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined/>}/>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
              >
                <Input.Password size="large" placeholder="请输入密码" prefix={<LockOutlined/>}/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon={<UserOutlined/>} block={true} htmlType="submit">
                  登录
                </Button>
              </Form.Item>

            </Form>

          </Col>
        </Row>

      </div>
    );
  }
}


export default RawLogin;
