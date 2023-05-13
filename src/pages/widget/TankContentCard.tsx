import React from 'react';
import './TankContentCard.less';
import TankComponent from '../../common/component/TankComponent';
import { LoadingOutlined } from '@ant-design/icons/lib';

interface IProps {
  loading?: boolean;
}

interface IState {}

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
    let that = this;
  }

  render() {
    let that = this;

    let content: React.ReactNode;

    if (that.props.loading) {
      content = (
        <div className="loading-area">
          <LoadingOutlined className="loading-icon" />
        </div>
      );
    } else {
      content = that.props.children;
    }

    return <div className="widget-tank-content-card">{content}</div>;
  }
}
