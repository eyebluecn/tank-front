import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Empty, Pagination } from 'antd';
import TankTitle from '../widget/TankTitle';
import TankComponent from '../../common/component/TankComponent';
import Pager from '../../common/model/base/Pager';
import Share from '../../common/model/share/Share';
import ShareBar from './widget/ShareBar';

import './List.less';
import Lang from '../../common/model/global/Lang';
import SortDirection from '../../common/model/base/SortDirection';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  pager = new Pager<Share>(this, Share, Pager.MAX_PAGE_SIZE);

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.pager.enableHistory();
    this.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    this.refresh();
  }

  refresh() {
    this.pager.httpList();
  }

  changePage(page: number) {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  }

  render() {
    const { pager } = this;

    return (
      <div className="share-list">
        <TankTitle name={Lang.t('layout.myShare')} />

        {pager.data.map((share) => (
          <ShareBar
            key={share.uuid!}
            share={share}
            onDeleteSuccess={() => this.refresh()}
          />
        ))}

        <Pagination
          className="mt10 pull-right"
          onChange={this.changePage.bind(this)}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />

        {pager.isEmpty() && <Empty description={Lang.t('share.emptyHint')} />}
      </div>
    );
  }
}
