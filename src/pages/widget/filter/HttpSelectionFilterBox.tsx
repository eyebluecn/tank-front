import React from 'react';

import { Radio, Select } from 'antd';
import HttpUtil from '../../../common/util/HttpUtil';
import SafeUtil from '../../../common/util/SafeUtil';
import SelectionOption from '../../../common/model/base/option/SelectionOption';
import HttpSelectionFilter from '../../../common/model/base/filter/HttpSelectionFilter';
import SelectionFilterType from '../../../common/model/base/filter/SelectionFilterType';
import TankComponent from '../../../common/component/TankComponent';

const Option = Select.Option;

interface IProps {
  httpSelectionFilter: HttpSelectionFilter;
  onChange?: (value: string) => void;
}

interface IState {}

export default class HttpSelectionFilterBox extends TankComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    //刷新一下列表
    let that = this;

    let filter = this.props.httpSelectionFilter;

    let url = filter.url;

    HttpUtil.httpGet(url, {}, function (response: any) {
      //尝试一次回填。因为这个时候才知道之前那个值是否有效。
      filter.options = response.data.data;
      filter.strictPutValue(filter.value);

      that.updateUI();
    });
  }

  //改变某个filter的值
  onValueChange = (value: any) => {
    let that = this;

    let filter = this.props.httpSelectionFilter;

    filter.value = value;

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(filter.value);

    //更新UI
    that.updateUI();
  };

  render() {
    let that = this;

    let filter = this.props.httpSelectionFilter;

    let selectionOptions = filter.options;

    if (filter.selectionType === SelectionFilterType.COMBOBOX) {
      return (
        <span className="filter-block http-selection-combobox-filter-box">
          <span className="filter-cell">
            <span className="filter-name">{filter.name}</span>
            <Select
              value={filter.value}
              style={{ minWidth: 180 }}
              onChange={this.onValueChange}
            >
              <Option key={-1} value={''}>
                全部
              </Option>
              {selectionOptions.map((item: SelectionOption, index: number) => {
                return (
                  <Option title={item.name} key={index} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </span>
        </span>
      );
    } else {
      return (
        <span className="filter-block http-selection-button-filter-box">
          <span className="filter-cell">
            <span className="filter-name">{filter.name}</span>
            <Radio.Group
              onChange={(e) => {
                this.onValueChange(e.target.value);
              }}
              //不希望对"全部"进行回填。
              value={filter.value === '' ? undefined : filter.value}
            >
              <Radio.Button value={''}>全部</Radio.Button>
              {selectionOptions.map((item: SelectionOption, index: number) => {
                return (
                  <Radio.Button key={index} value={item.value}>
                    {item.name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </span>
        </span>
      );
    }
  }
}
