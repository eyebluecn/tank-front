import React from 'react';

/**
 * 带有挂载状态的自定义组件
 */
export default class TankComponent<P, S> extends React.Component<P, S> {
  //是否处于挂载的状态。
  mounted: boolean = false;

  componentWillUnmount() {
    let that = this;
    that.mounted = false;
  }

  componentWillMount() {
    let that = this;
    that.mounted = true;
  }

  //更新当前视图。
  updateUI() {
    let that = this;
    if (that.mounted) {
      that.setState({});
    } else {
      console.info(this.constructor.name + '已经脱离挂载，不再刷新视图。');
    }
  }

  //获取当前组件的唯一标识
  getIdentifier() {
    return this.constructor.name;
  }
}
