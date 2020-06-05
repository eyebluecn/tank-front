import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Index.less';
import BambooComponent from '../../common/component/BambooComponent';
import Moon from '../../common/model/global/Moon';
import User from '../../common/model/user/User';

interface IProps extends RouteComponentProps {

}

interface IState {

}


export default class Index extends BambooComponent<IProps, IState> {

  user: User = Moon.getSingleton().user;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    let that = this;

    //假装获取一下详情
    this.user.httpInfo(function() {
      that.updateUI();
    });

  }


  render() {

    let that = this;

    return (
      <div className="index-page">

        <h1>欢迎来到蓝眼博客，这里是首页，内容正在开发中。</h1>

      </div>
    );
  }
}


