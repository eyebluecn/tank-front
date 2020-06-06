import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Edit.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Edit extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {

    let that = this

    return (
      <div className="page-preference-edit">
        欢迎来到偏好设置页面
      </div>
    );
  }
}


