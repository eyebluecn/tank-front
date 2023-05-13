import React from 'react';
import './FrameLoading.less';
import TankComponent from '../../common/component/TankComponent';
import { LoadingOutlined } from '@ant-design/icons';

interface IProps {}

interface IState {}

/**
 * 主站加载控件。
 * 在主站加载过程中或者在工作台加载过程中使用
 * 该控件采用fixed布局，会占据全屏
 */
export default class FrameLoading extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render() {
    let that = this;

    return (
      <div className="app-frame-loading">
        <div className="loading-box">
          <div>
            <LoadingOutlined className={'loading-icon'} />
          </div>
          <div className={'loading-text'}>加载中...</div>
        </div>
      </div>
    );
  }
}
