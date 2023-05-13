import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Edit.less';
import TankComponent from '../../common/component/TankComponent';
import User from '../../common/model/user/User';
import Moon from '../../common/model/global/Moon';
import Lang from '../../common/model/global/Lang';

interface RouteParam {
  authentication: string;
}

interface IProps extends RouteComponentProps<RouteParam> {}

interface IState {}

export default class Authentication extends TankComponent<IProps, IState> {
  //登录的那个用户
  user: User = Moon.getSingleton().user;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    let match = this.props.match;

    this.user.httpAuthenticationLogin(match.params.authentication, function () {
      //转跳到首页
      //Sun.navigateTo("/")
      window.location.href = '/';
    });
  }

  render() {
    let that = this;

    let user: User = this.user;

    return (
      <div className="page-user-authentication">
        {Lang.t('user.redirecting')}
      </div>
    );
  }
}
