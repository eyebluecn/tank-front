import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import "./Index.less"
import TankComponent from "../../common/component/TankComponent";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import TankTitle from "../widget/TankTitle";
import {Button} from "antd";
import {EditOutlined} from '@ant-design/icons';
import InfoCell from "../widget/InfoCell";
import Preference from "../../common/model/preference/Preference";


interface IProps extends RouteComponentProps {

}

interface IState {

}

export default class Index extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user

  preference: Preference = Moon.getSingleton().preference

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  //refresh preference.
  refresh() {
    let that = this

    that.preference.httpFetch(function () {
      that.updateUI()

    })
  }

  render() {

    let that = this

    return (
      <div className="page-preference-index">

        <TankTitle name={'网站偏好'}>
          <Button type={"primary"} icon={<EditOutlined/>}>编辑</Button>
        </TankTitle>

        <InfoCell name={'网站名称'}>
          {this.preference.name}
        </InfoCell>

      </div>
    );
  }
}


