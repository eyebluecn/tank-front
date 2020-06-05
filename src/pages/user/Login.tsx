import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Login.less"
import BambooComponent from "../../common/component/BambooComponent";
import {Button, Col, Form, Input, message as MessageBox, Row} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";

interface IProps extends RouteComponentProps {

}

interface IState {

}

class RawLogin extends BambooComponent<IProps, IState> {

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

    const layout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const tailLayout = {
      wrapperCol: {offset: 8, span: 16},
    };

    return (
      <div className="user-login">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              欢迎登录
            </div>

            <Form
              {...layout}
              name="basic"
              initialValues={{remember: true}}
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed.bind(this)}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{required: true, message: 'Please input your username!'}]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
              >
                <Input.Password/>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
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
