import React from 'react';

import { DatePicker } from 'antd';
import moment from 'moment';
import DateTimeFilter from '../../../common/model/base/filter/DateTimeFilter';
import SafeUtil from '../../../common/util/SafeUtil';

interface IProps {
  dateTimeFilter: DateTimeFilter;
  onChange?: (value: Date | null) => void;
}

interface IState {}

class DateTimeFilterBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  //改变某个filter的值
  onValueChange(momentTime: moment.Moment | null, dateString: string) {
    let that = this;

    let filter = this.props.dateTimeFilter;

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

    let dateTimeFilter = this.props.dateTimeFilter;

    let value: moment.Moment | undefined = undefined;
    if (dateTimeFilter.value) {
      value = moment(dateTimeFilter.value);
    }

    return (
      <span className="filter-block date-time-filter-box">
        <span className="filter-cell">
          <span className="filter-name">{dateTimeFilter.name}</span>
          <span className="filter-body">
            <DatePicker
              showTime
              format={dateTimeFilter.format}
              value={value}
              placeholder="请选择日期时间"
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

export default DateTimeFilterBox;
