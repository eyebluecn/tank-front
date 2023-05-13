import React from 'react';

import { Radio, Select } from 'antd';
import SelectionFilter from '../../../common/model/base/filter/SelectionFilter';
import SafeUtil from '../../../common/util/SafeUtil';
import SelectionOption from '../../../common/model/base/option/SelectionOption';
import SelectionFilterType from '../../../common/model/base/filter/SelectionFilterType';

const Option = Select.Option;

interface IProps {
  selectionFilter: SelectionFilter;
  onChange?: (value: string) => void;
}

interface IState {}

export default class SelectionFilterBox extends React.Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange = (value: any) => {
    let that = this;

    let selectionFilter = this.props.selectionFilter;

    selectionFilter.value = value;

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)();

    //更新UI
    that.setState({});
  };

  render() {
    let that = this;

    let selectionFilter = this.props.selectionFilter;

    if (selectionFilter.selectionType === SelectionFilterType.COMBOBOX) {
      return (
        <span className="filter-block selection-combobox-filter-box">
          <span className="filter-cell">
            <span className="filter-name">{selectionFilter.name}</span>
            <Select
              value={selectionFilter.value}
              style={{ minWidth: 120 }}
              onChange={this.onValueChange}
            >
              <Option key={-1} value={''}>
                全部
              </Option>
              {selectionFilter.options.map(
                (item: SelectionOption, index: number) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.name}
                    </Option>
                  );
                }
              )}
            </Select>
          </span>
        </span>
      );
    } else {
      return (
        <span className="filter-block selection-button-filter-box">
          <span className="filter-cell">
            <span className="filter-name">{selectionFilter.name}</span>
            <Radio.Group
              onChange={(e) => {
                this.onValueChange(e.target.value);
              }}
              //不希望对"全部"进行回填。
              value={
                selectionFilter.value === '' ? undefined : selectionFilter.value
              }
            >
              <Radio.Button value={''}>全部</Radio.Button>
              {selectionFilter.options
                ? selectionFilter.options.map(
                    (item: SelectionOption, index: number) => {
                      return (
                        <Radio.Button key={index} value={item.value}>
                          {item.name}
                        </Radio.Button>
                      );
                    }
                  )
                : null}
            </Radio.Group>
          </span>
        </span>
      );
    }
  }
}
