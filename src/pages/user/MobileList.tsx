import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import './MobileList.less';
import SortDirection from '../../common/model/base/SortDirection';
import Pager from '../../common/model/base/Pager';
import User from '../../common/model/user/User';
import TankComponent from '../../common/component/TankComponent';
import TankTitle from '../widget/TankTitle';
import { Button, Input, Modal, Pagination } from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import MessageBoxUtil from '../../common/util/MessageBoxUtil';
import Color from '../../common/model/base/option/Color';
import TransfigurationModal from './widget/TransfigurationModal';
import Lang from '../../common/model/global/Lang';
import Moon from '../../common/model/global/Moon';
import MobileUserPanel from './widget/MobileUserPanel';

interface IProps extends RouteComponentProps {}

interface IState {}

export default class MobileList extends TankComponent<IProps, IState> {
  //获取分页的一个帮助器
  pager: Pager<User> = new Pager<User>(this, User, 10);

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount(): void {
    this.pager.enableHistory();
    this.refresh();
  }

  search() {
    this.pager.page = 0;
    this.refresh();
  }

  refresh() {
    //如果没有任何的排序，默认使用时间倒序
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    }
    this.pager.httpList();
  }

  toggleStatus(user: User) {
    user.httpToggleStatus(() => {
      MessageBoxUtil.success(Lang.t('operationSuccess'));
      this.updateUI();
    });
  }

  delete(user: User) {
    Modal.confirm({
      title: Lang.t('user.deleteHint', user.username),
      icon: <ExclamationCircleFilled twoToneColor={Color.WARNING} />,
      onOk: () => {
        user.httpDel(() => {
          MessageBoxUtil.success(Lang.t('operationSuccess'));
          this.refresh();
        });
      },
    });
  }

  transfiguration(user: User) {
    TransfigurationModal.open(user);
  }

  searchFile(value?: string) {
    this.pager.resetFilter();
    if (value) {
      this.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
      this.pager.setFilterValue('username', value);
      this.pager.httpList();
    } else {
      this.refresh();
    }
  }

  changeSearch(e: any) {
    if (!e.currentTarget.value) this.searchFile();
  }

  changePage(page: number) {
    this.pager.page = page - 1; // page的页数0基
    this.pager.httpList();
    this.updateUI();
  }

  render() {
    const { pager } = this;
    const currentUser = Moon.getSingleton().user;
    return (
      <div className="page-user-list-mobile">
        <TankTitle name={Lang.t('layout.users')}>
          <Link to={'/user/create'}>
            <Button type={'primary'} icon={<PlusOutlined />}>
              {Lang.t('user.createUser')}
            </Button>
          </Link>
        </TankTitle>

        <div>
          <Input.Search
            className="mb10"
            placeholder={Lang.t('user.searchUser')}
            onSearch={(value) => this.searchFile(value)}
            onChange={this.changeSearch.bind(this)}
            enterButton
          />
        </div>

        <div>
          {pager.data.map((user) => (
            <MobileUserPanel
              key={user.uuid!}
              user={user}
              isCurrentUser={currentUser.uuid === user.uuid}
              onToggleStatus={this.toggleStatus.bind(this)}
              onDelete={this.delete.bind(this)}
              onTransfiguration={this.transfiguration.bind(this)}
            />
          ))}
        </div>
        <Pagination
          className="mt10 pull-right"
          onChange={this.changePage.bind(this)}
          current={pager.page + 1}
          total={pager.totalItems}
          pageSize={pager.pageSize}
          hideOnSinglePage
        />
      </div>
    );
  }
}
