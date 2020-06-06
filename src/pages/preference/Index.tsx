import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Index.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import {Button} from "antd";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Index extends TankComponent<IProps, IState> {

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
      <div className="page-preference-index">

        <TankTitle name={'网站偏好'}>
          <Button>编辑</Button>
        </TankTitle>

      </div>
    );
  }
}


