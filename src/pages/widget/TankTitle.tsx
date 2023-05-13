import React from 'react';
import './TankTitle.less';
import TankComponent from '../../common/component/TankComponent';

interface IProps {
  name: React.ReactNode;
}

interface IState {}

/**
 * 标题导航快捷插件
 */
export default class TankTitle extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="widget-tank-title">
        <span className="item active">{this.props.name}</span>
        <span className="tool">{this.props.children}</span>
      </div>
    );
  }
}
