import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "./List.less";
import TankComponent from "../../common/component/TankComponent";
import Pager from "../../common/model/base/Pager";
import Matter from "../../common/model/matter/Matter";
import TankTitle from "../widget/TankTitle";
import User from "../../common/model/user/User";
import Moon from "../../common/model/global/Moon";
import Preference from "../../common/model/preference/Preference";
import Director from "./widget/Director";
import SortDirection from "../../common/model/base/SortDirection";
import MatterPanel from "./widget/MatterPanel";

interface IProps extends RouteComponentProps {}

interface IState {}

export default class List extends TankComponent<IProps, IState> {
  //当前文件夹信息。
  matter: Matter = new Matter();
  //准备新建的文件。
  newMatter: Matter = new Matter();
  //准备上传的一系列文件
  uploadMatters: Matter[] = [];
  //当前选中的文件
  selectedMatters: Matter[] = [];
  //搜索的文字
  searchText: string | null = null;
  //获取分页的一个帮助器
  pager: Pager<Matter> = new Pager<Matter>(this, Matter, 10);
  //移动的目标文件夹
  targetMatterUuid: string | null = null;
  user: User = Moon.getSingleton().user;
  preference: Preference = Moon.getSingleton().preference;
  director: Director = new Director();

  // todo
  // share: Share =  new Share();

  //分享的弹框
  shareDialogVisible: boolean = false;

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    //刷新一下列表
    this.pager.enableHistory();
    this.refresh();
  }

  refresh() {
    //如果没有任何的排序，默认使用时间倒序
    if (!this.pager.getCurrentSortFilter()) {
      this.pager.setFilterValue("orderCreateTime", SortDirection.DESC);
    }

    this.pager.httpList();
  }

  render() {
    let that = this;
    const { pager, director } = this;

    return (
      <div className="matter-list">
        <TankTitle name={"所有文件"}></TankTitle>

        <div>
          {pager.data.map(matter =>
            <MatterPanel
              key={matter.uuid!}
              director={director}
              matter={matter}
              onCreateDirectorySuccess={this.refresh.bind(this)}
              onDeleteSuccess={this.refresh.bind(this)}
             />
          )}

        </div>
      </div>
    );
  }
}
