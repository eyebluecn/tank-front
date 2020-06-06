import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import './List.less';
import TankComponent from '../../common/component/TankComponent';
import Pager from '../../common/model/base/Pager';
import Matter from '../../common/model/matter/Matter';
import TankTitle from '../widget/TankTitle';


interface IProps extends RouteComponentProps {

}

interface IState {

}


export default class List extends TankComponent<IProps, IState> {

  //获取分页的一个帮助器
  pager: Pager<Matter> = new Pager<Matter>(this, Matter, 10);

  constructor(props: IProps) {
    super(props);


    this.state = {};
  }


  componentDidMount() {

    //刷新一下列表
    let that = this;

    that.pager.enableHistory();
  }

  render() {

    let that = this;

    return (
      <div className="matter-list">
        <TankTitle name={'所有文件'}>

        </TankTitle>

      </div>
    );
  }
}


