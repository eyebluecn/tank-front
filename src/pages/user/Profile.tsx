import React from 'react';
import "./Profile.less"
import TankComponent from "../../common/component/TankComponent";
import {Button} from 'antd';
import InfoCell from "../widget/InfoCell";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import DateUtil from "../../common/util/DateUtil";
import MessageBoxUtil from "../../common/util/MessageBoxUtil";
import BambooTitle from '../widget/BambooTitle';

interface IProps {
  name: string
  firstSpan?: number
}

interface IState {

}

export default class Profile extends TankComponent <IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {}
  }


  componentDidMount() {

  }

  changePassword() {

  }

  render() {

    let that = this
    let name: string = this.props.name
    let user: User = Moon.getSingleton().user

    return (

      <div className="page-profile">

        <BambooTitle name={'个人资料'}>
          <Button type="primary" icon="plus" onClick={this.changePassword.bind(this)}>
            修改密码
          </Button>
        </BambooTitle>

        <div>
          <InfoCell name="用户名">
            {user.username}
          </InfoCell>

          <InfoCell name="创建时间">
            {DateUtil.simpleDateTime(user.createTime)}
          </InfoCell>

        </div>

      </div>
    )
  }
}

