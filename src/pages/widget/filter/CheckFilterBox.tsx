import React from 'react';

import { Select } from 'antd';
import SafeUtil from '../../../common/util/SafeUtil';
import CheckFilter from '../../../common/model/base/filter/CheckFilter';

const Option = Select.Option;

interface IProps {
  checkFilter: CheckFilter;
  onChange?: (value: boolean | null) => void;
}

interface IState {}

export default class CheckFilterBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange = (value: string) => {
    let that = this;

    let checkFilter = this.props.checkFilter;

    checkFilter.putValue(value);

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(checkFilter.value);

    //更新UI
    that.setState({});
  };

  render() {
    let that = this;

    let checkFilter = this.props.checkFilter;

    //用于回填的值
    let backValue = checkFilter.getValueString();

    return (
      <span className="filter-block check-filter-box">
        <span className="filter-cell">
          <span className="filter-name">{checkFilter.name}</span>

          <Select
            value={backValue}
            style={{ minWidth: 120 }}
            onChange={this.onValueChange}
          >
            <Option key={0} value={''}>
              全部
            </Option>
            <Option key={1} value={'true'}>
              是
            </Option>
            <Option key={2} value={'false'}>
              否
            </Option>
          </Select>
        </span>
      </span>
    );
  }
}
