import React from 'react';

import { Select } from 'antd';
import SafeUtil from '../../../common/util/SafeUtil';
import SortFilter from '../../../common/model/base/filter/SortFilter';
import SortDirection from '../../../common/model/base/SortDirection';

const Option = Select.Option;

interface IProps {
  sortFilter: SortFilter;
  onChange?: (value: SortDirection | null) => void;
}

interface IState {}

export default class SortFilterBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange = (value: string) => {
    let that = this;

    let sortFilter = this.props.sortFilter;

    sortFilter.putValue(value);

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(sortFilter.value);

    //更新UI
    that.setState({});
  };

  render() {
    let that = this;

    let sortFilter = this.props.sortFilter;

    return (
      <span className="filter-block sort-filter-box">
        <span className="filter-cell">
          <span className="filter-name">{sortFilter.name}</span>

          <Select
            value={sortFilter.getValueString()}
            style={{ minWidth: 120 }}
            onChange={this.onValueChange}
          >
            <Option key={0} value={''}>
              全部
            </Option>
            <Option key={1} value={SortDirection.DESC}>
              倒序排列
            </Option>
            <Option key={2} value={SortDirection.ASC}>
              顺序排列
            </Option>
          </Select>
        </span>
      </span>
    );
  }
}
