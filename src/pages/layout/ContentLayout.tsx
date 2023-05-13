import React from 'react';
import './ContentLayout.less';
import TankComponent from '../../common/component/TankComponent';

interface IProps {}

interface IState {}

export default class ContentLayout extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let that = this;

    return (
      <div id="layout-content" className="layout-content">
        {this.props.children}
      </div>
    );
  }
}
