import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Login.less"
import BambooComponent from "../../common/component/BambooComponent";
import {Col, message as MessageBox, Row} from 'antd';
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


    //立即退出
    this.logout()
  }

  //退出登录
  logout() {

    this.user.httpLogout()

  }


  handleSubmit(e: any) {
    e.preventDefault();

    let that = this

    let user = that.user

    user.httpLogin("xx", "xx", function () {
      MessageBox.success("登录成功！")

      that.props.history.push('/')

    })
  };

  render() {

    let that = this

    //router中传入的路由相关对象
    let match = this.props.match;
    let location = this.props.location;
    let history = this.props.history;

    return (
      <div className="user-login">

        <Row>
          <Col span={8} offset={8}>

            <div className="welcome">
              欢迎登录
            </div>


          </Col>
        </Row>

      </div>
    );
  }
}


export default RawLogin;
