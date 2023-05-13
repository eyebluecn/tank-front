import React from 'react';

import { Input } from 'antd';
import InputFilter from '../../../common/model/base/filter/InputFilter';
import SafeUtil from '../../../common/util/SafeUtil';

interface IProps {
  inputFilter: InputFilter;
  onChange?: (value: string | null) => void;
}

interface IState {}

export default class InputFilterBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange(event: any) {
    let that = this;

    let inputFilter: InputFilter = this.props.inputFilter;

    inputFilter.value = event.target.value;

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(inputFilter.value);

    //更新UI
    that.setState({});
  }

  render() {
    let that = this;

    let inputFilter: InputFilter = this.props.inputFilter;

    return (
      <span className="filter-block input-filter-box">
        <span className="filter-cell">
          <span className="filter-name">{inputFilter.name}</span>
          <span className="filter-body">
            <Input
              placeholder={inputFilter.placeholder}
              value={inputFilter.value}
              onChange={this.onValueChange.bind(this)}
            />
          </span>
        </span>
      </span>
    );
  }
}
