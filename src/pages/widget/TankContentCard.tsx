import React from 'react';
import "./TankContentCard.less"
import TankComponent from '../../common/component/TankComponent';

interface IProps {

}

interface IState {

}

/**
 * 正文样式
 */
export default class TankContentCard extends TankComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

    //刷新一下列表
    let that = this

  }

  render() {

    let that = this
    return (
      <div className="widget-tank-content-card">
        {this.props.children}
      </div>
    );
  }
}
