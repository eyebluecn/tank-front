import './MatterSortPanel.less';
import React from 'react';
import Matter from '../../../common/model/matter/Matter';
import TankComponent from '../../../common/component/TankComponent';
import SortDirection from '../../../common/model/base/SortDirection';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Pager from '../../../common/model/base/Pager';

interface IProps {
  pager: Pager<Matter>;
  refresh: () => any;
  disabled?: boolean;
}

interface IState {}

export default class MatterSortPanel extends TankComponent<IProps, IState> {
  static sortAutomaton = [SortDirection.ASC, SortDirection.DESC, null]; // 排序状态自动机：ASC -> DESC -> null -> ASC...

  changeFilterOrder(orderName: string) {
    const { pager } = this.props;
    ['orderName', 'orderSize', 'orderUpdateTime']
      .filter((name) => name !== orderName)
      .forEach((key) => {
        pager.setFilterValue(key, null);
      });
    const filter = pager.getFilterValue(orderName);
    const nextSortIndex =
      (MatterSortPanel.sortAutomaton.findIndex((key) => key === filter) + 1) %
      3;

    pager.resetSortFilters();
    pager.setFilterValue('orderDir', SortDirection.DESC);
    pager.setFilterValue(
      orderName,
      MatterSortPanel.sortAutomaton[nextSortIndex]
    );
    this.props.refresh();
  }

  render() {
    const { pager, disabled } = this.props;

    return (
      <div
        className={`matter-sort-panel ${
          disabled ? 'matter-sort-panel-disabled' : ''
        }`}
      >
        <div
          className="sort-part sort-part-name"
          onClick={() => this.changeFilterOrder('orderName')}
        >
          文件名
          {pager.getFilterValue('orderName') ? (
            pager.getFilterValue('orderName') === SortDirection.ASC ? (
              <ArrowUpOutlined className="ml5 f10" />
            ) : (
              <ArrowDownOutlined className="ml5 f10" />
            )
          ) : null}
        </div>
        <div
          className="sort-part sort-part-size"
          onClick={() => this.changeFilterOrder('orderSize')}
        >
          大小
          {pager.getFilterValue('orderSize') ? (
            pager.getFilterValue('orderSize') === SortDirection.ASC ? (
              <ArrowUpOutlined className="ml5 f10" />
            ) : (
              <ArrowDownOutlined className="ml5 f10" />
            )
          ) : null}
        </div>
        <div
          className="sort-part sort-part-date"
          onClick={() => this.changeFilterOrder('orderUpdateTime')}
        >
          修改日期
          {pager.getFilterValue('orderUpdateTime') ? (
            pager.getFilterValue('orderUpdateTime') === SortDirection.ASC ? (
              <ArrowUpOutlined className="ml5 f10" />
            ) : (
              <ArrowDownOutlined className="ml5 f10" />
            )
          ) : null}
        </div>
      </div>
    );
  }
}
