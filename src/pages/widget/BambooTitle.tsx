import React from 'react';
import "./BambooTitle.less"
import BambooComponent from '../../common/component/BambooComponent';

interface IProps {
  name: React.ReactNode
}

interface IState {

}

/**
 * 标题导航快捷插件
 */
export default class BambooTitle extends BambooComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

    //刷新一下列表
    let that = this

  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    let that = this
  }

  render() {

    let that = this

    return (
      <div className="widget-bamboo-title">
        <span className="item active">
          {that.props.name}
        </span>
        <span className="tool">
          {that.props.children}
        </span>
      </div>
    );
  }
}
