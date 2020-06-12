import React from "react";
import Pager from "../../../common/model/base/Pager";
import Matter from "../../../common/model/matter/Matter";
import TankComponent from "../../../common/component/TankComponent";
import {Tree} from "antd";

interface IProps {
}

interface IState {}

export default class UploadMatterPanel extends TankComponent<IProps, IState> {

  pager = new Pager<Matter>(this, Matter, 10);
  targetMatter = new Matter();
  treeData = [];

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.listDir();
  }

  fetchData() {
    this.pager.httpList((response: any) => {
      const {data, page, totalPages} = response.data.data;
      // todo do something
      if(page + 1 < totalPages) {
        this.pager.page++;
        this.fetchData();
      }
    })
  }

  listDir = (pMatter?: Matter) => {
    if(pMatter) {
      this.pager.setFilterValue('puuid', pMatter.uuid);
    } else {
      this.pager.setFilterValue('puuid', 'root');
    }
    this.pager.setFilterValue('dir', true);
    this.fetchData();
  };

  // treeData = [
  //   {
  //     title: 'parent 0',
  //     key: '0-0',
  //     children: [
  //       { title: 'leaf 0-0', key: '0-0-0' },
  //       { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
  //     ],
  //   },
  //   {
  //     title: 'parent 1',
  //     key: '0-1',
  //     children: [
  //       { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
  //       { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
  //     ],
  //   },
  // ];

  onSelect = (keys: any, event: any) => {
    console.log('Trigger Select', keys, event);
  };

  render() {
    return (
      <Tree.DirectoryTree treeData={this.treeData} onSelect={this.onSelect}/>
    )
  }
}
