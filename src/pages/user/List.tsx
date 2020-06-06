import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import './List.less';
import SortDirection from '../../common/model/base/SortDirection';
import Pager from '../../common/model/base/Pager';
import Table, {ColumnProps} from 'antd/lib/table';
import StringUtil from '../../common/util/StringUtil';
import FileUtil from '../../common/util/FileUtil';
import DateUtil from '../../common/util/DateUtil';
import FilterPanel from '../widget/filter/FilterPanel';
import TableEmpty from '../widget/TableEmpty';
import Sun from '../../common/model/global/Sun';
import User from "../../common/model/user/User";
import TankComponent from "../../common/component/TankComponent";
import TankTitle from "../widget/TankTitle";
import {Avatar, Button, Tag} from "antd";
import {PlusOutlined} from '@ant-design/icons';
import {UserRoleMap} from "../../common/model/user/UserRole";
import {UserStatusMap} from "../../common/model/user/UserStatus";
import ImagePreviewer from "../widget/previewer/ImagePreviewer";


interface IProps extends RouteComponentProps {

}

interface IState {

}


export default class List extends TankComponent<IProps, IState> {

  //获取分页的一个帮助器
  pager: Pager<User> = new Pager<User>(this, User, 10);

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  componentDidMount() {

    //刷新一下列表
    let that = this;

    that.pager.enableHistory();

    that.refresh();
  }

  search() {
    let that = this;
    that.pager.page = 0;
    that.refresh();
  }

  refresh() {

    let that = this;

    //如果没有任何的排序，默认使用时间倒序
    if (!that.pager.getCurrentSortFilter()) {
      that.pager.setFilterValue('orderCreateTime', SortDirection.DESC);
    }

    that.pager.httpList();
  }

  createUser() {

    let that = this;


    //router中传入的路由相关对象
    let match = this.props.match;


    let url: string = StringUtil.prePath(match.path) + `/create`;

    Sun.navigateTo(url);
  }

  render() {

    let that = this;

    //router中传入的路由相关对象
    let match = this.props.match;

    //pager对象
    let pager = this.pager;

    const columns: ColumnProps<User>[] = [{
      title: '头像',
      dataIndex: 'avatarUrl',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <Link to={StringUtil.prePath(match.path) + '/detail/' + record.uuid}>
          <img alt="avatar" className='avatar-small cursor' src={record.getAvatarUrl()}/>
        </Link>
      ),
    }, {
      title: '用户名',
      dataIndex: 'username',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <Link to={StringUtil.prePath(match.path) + '/detail/' + record.uuid}>{record.username}</Link>
      ),
    }, {
      title: '角色',
      dataIndex: 'role',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <Tag color={UserRoleMap[record.role].color}>{UserRoleMap[record.role].name}</Tag>
      ),
    }, {
      title: '单文件限制',
      dataIndex: 'sizeLimit',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <span>{FileUtil.humanFileSize(record.sizeLimit)}</span>
      ),
    }, {
      title: '已使用空间',
      dataIndex: 'totalSize',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <span>{FileUtil.humanFileSize(record.totalSize)}</span>
      ),
    }, {
      title: '空间限制',
      dataIndex: 'totalSizeLimit',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <span>{FileUtil.humanFileSize(record.totalSizeLimit)}</span>
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text: any, record: User, index: number): React.ReactNode => (
        <Tag color={UserStatusMap[record.status].color}>{UserStatusMap[record.status].name}</Tag>
      ),
    }, {
      title: '上次ip',
      dataIndex: 'lastIp',
    }, {
      title: '上次登录',
      dataIndex: 'lastTime',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      sortOrder: pager.getDefaultSortOrder('createTime'),
      sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
      render: (text: any, record: User, index: number): React.ReactNode => (
        DateUtil.simpleDateTime(text)
      ),
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text: any, record: User) => (
        <span>

          <Link title="编辑"
                to={StringUtil.prePath(match.path) + '/edit/' + record.uuid}>
            <span>编辑</span>
          </Link>

        </span>
      ),
    }];

    return (
      <div className="page-user-list">

        <TankTitle name={'用户管理'}>
          <Link to={'/user/create'}>
            <Button type={"primary"} icon={<PlusOutlined/>}>创建用户</Button>
          </Link>
        </TankTitle>

        <div>
          <FilterPanel filters={pager.filters} onChange={this.search.bind(this)}/>
        </div>
        <Table
          rowKey="uuid"
          loading={pager.loading}
          dataSource={pager.data}
          columns={columns}
          pagination={pager.getPagination()}
          onChange={pager.tableOnChange.bind(pager)}
          locale={{emptyText: (<TableEmpty pager={pager} onRefresh={this.refresh.bind(this)}/>)}}
        />
      </div>
    );
  }
}


