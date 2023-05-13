import React from 'react';

import { DatePicker } from 'antd';
import moment from 'moment';
import { default as DateFilter } from '../../../common/model/base/filter/DateFilter';
import SafeUtil from '../../../common/util/SafeUtil';

interface IProps {
  dateFilter: DateFilter;
  onChange?: (value: Date | null) => void;
}

interface IState {}

class DateFilterBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange(momentTime: moment.Moment | null, dateString: string) {
    let that = this;

    let filter = this.props.dateFilter;

    if (momentTime) {
      filter.value = momentTime.toDate();
    } else {
      filter.value = null;
    }

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(filter.value);

    //更新UI
    that.setState({});
  }

  render() {
    let that = this;

    let dateFilter = this.props.dateFilter;

    let value: moment.Moment | undefined = undefined;
    if (dateFilter.value) {
      value = moment(dateFilter.value);
    }

    return (
      <span className="filter-block date-time-filter-box">
        <span className="filter-cell">
          <span className="filter-name">{dateFilter.name}</span>
          <span className="filter-body">
            <DatePicker
              showTime
              format={dateFilter.format}
              value={value}
              placeholder="请选择日期"
              onChange={(date: moment.Moment | null, dateString: string) => {
                that.onValueChange(date, dateString);
              }}
            />
          </span>
        </span>
      </span>
    );
  }
}

export default DateFilterBox;
