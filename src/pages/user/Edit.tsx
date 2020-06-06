import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import {message as MessageBox} from 'antd';
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import Sun from "../../common/model/global/Sun";
import TankTitle from "../widget/TankTitle";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Login extends TankComponent<IProps, IState> {

  createMode: boolean = false

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

    //进入登录页面，默认退出一次
    this.logout()

  }

  //退出登录
  logout() {

    let that = this

    this.user.httpLogout(function () {
      //刷新整个网站
      Sun.updateFrame()
    })

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

      <div className="page-user-edit">

        <TankTitle name={this.createMode ? '创建用户' : '编辑用户'}>

        </TankTitle>


      </div>
    );
  }
}


