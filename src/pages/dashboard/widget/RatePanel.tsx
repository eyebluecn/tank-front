import React from 'react';
import './RatePanel.less';
import TankComponent from '../../../common/component/TankComponent';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons/lib';
import Color from '../../../common/model/base/option/Color';

interface IProps {
  name: string;
  standardValue: number;
  compareValue: number;
}

interface IState {}

export default class RatePanel extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  getValue(): number {
    if (this.props.standardValue === 0) {
      if (this.props.compareValue === 0) {
        return 0;
      } else {
        return 100;
      }
    } else {
      let v1 = this.props.compareValue - this.props.standardValue;
      let v2 = v1 / this.props.standardValue;
      return parseInt((v2 * 100).toFixed(0));
    }
  }

  render() {
    let that = this;
    let name: string = this.props.name;

    let noData: boolean =
      this.props.standardValue === 0 && this.props.compareValue === 0;
    let infinite: boolean =
      this.props.standardValue === 0 && this.props.compareValue > 0;
    let value: number = this.getValue();

    return (
      <span className="widget-rate-panel">
        <span className="name">{name}</span>

        {infinite ? (
          <span className="infinite">∞</span>
        ) : noData ? (
          <span className="no-data"> - </span>
        ) : (
          <span>
            {value > 0 ? '+' : ''}
            {value}%
          </span>
        )}

        {!noData && value < 0 && (
          <ArrowDownOutlined style={{ fontSize: 16, color: Color.SUCCESS }} />
        )}

        {!noData && (infinite || value >= 0) && (
          <ArrowUpOutlined style={{ fontSize: 16, color: Color.DANGER }} />
        )}
      </span>
    );
  }
}
