import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './Index.less';
import TankComponent from '../../common/component/TankComponent';
import Moon from '../../common/model/global/Moon';
import User from '../../common/model/user/User';
import TankTitle from "../widget/TankTitle";

interface IProps extends RouteComponentProps {

}

interface IState {

}


export default class Index extends TankComponent<IProps, IState> {

  user: User = Moon.getSingleton().user;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

    that.updateUI();
  }


  render() {

    let that = this;

    return (
      <div className="page-install-index">

        <TankTitle name={'安装网站'}>

        </TankTitle>

      </div>
    );
  }
}


