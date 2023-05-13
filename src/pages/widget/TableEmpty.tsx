import React from 'react';
import { Empty } from 'antd';
import EmptyImage from '../../assets/image/empty.svg';
import ErrorImage from '../../assets/image/error.png';
import SafeUtil from '../../common/util/SafeUtil';
import './TableEmpty.less';
import Pager from '../../common/model/base/Pager';

interface IProps {
  pager: Pager<any>;
  onRefresh?: () => void;
}

interface IState {}

class TableEmpty extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render() {
    let that = this;

    let pager = this.props.pager;

    let emptyContent = (
      <div className="empty-content">
        <Empty image={EmptyImage} description="暂无数据">
          <span
            className="link"
            onClick={(event) => {
              SafeUtil.safeCallback(that.props.onRefresh)();
            }}
          >
            点击重试
          </span>
        </Empty>
      </div>
    );
    let errorContent = (
      <div className="error-content">
        <Empty image={ErrorImage} description={pager.errorMessage}>
          <span
            className="link"
            onClick={(event) => {
              SafeUtil.safeCallback(that.props.onRefresh)();
            }}
          >
            点击重试
          </span>
        </Empty>
      </div>
    );

    return (
      <div className="widget-table-empty">
        {pager.errorMessage
          ? errorContent
          : pager.data.length
          ? ''
          : emptyContent}
      </div>
    );
  }
}

export default TableEmpty;
