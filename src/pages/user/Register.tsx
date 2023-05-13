import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './Register.less';
import TankComponent from '../../common/component/TankComponent';
import { Button, Col, Form, Input, Row } from 'antd';
import User from '../../common/model/user/User';
import Moon from '../../common/model/global/Moon';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Lang from '../../common/model/global/Lang';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class Register extends TankComponent<IProps, IState> {
  user: User = Moon.getSingleton().user;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  onFinish(values: any) {
    let that = this;

    let user = that.user;

    user.httpRegister(values['username'], values['password'], function () {
      MessageBoxUtil.success(Lang.t('user.loginSuccess'));

      that.props.history.push('/');
    });
  }

  onFinishFailed(errorInfo: any) {}

  render() {
    let that = this;

    return (
      <div className="user-register">
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 8, offset: 6 }}>
            <div className="welcome">{Lang.t('user.welcomeRegister')}</div>

            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed.bind(this)}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: Lang.t('user.enterUsername') },
                ]}
              >
                <Input
                  size="large"
                  placeholder={Lang.t('user.enterUsername')}
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: Lang.t('user.enterPassword') },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={Lang.t('user.enterPassword')}
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="rePassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: Lang.t('user.enterPassword'),
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(Lang.t('user.passwordNotSame'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={Lang.t('user.confirmPassword')}
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  block={true}
                  htmlType="submit"
                >
                  {Lang.t('user.register')}
                </Button>
              </Form.Item>

              <div className="text-right">
                <Link to={'/user/login'}>
                  <span className="link">{Lang.t('user.goToLogin')}</span>
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
