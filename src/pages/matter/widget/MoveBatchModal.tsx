import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import { Modal, Tree } from "antd";
import Pager from "../../../common/model/base/Pager";
import Matter from "../../../common/model/matter/Matter";

interface IProps {
  onSuccess: () => any;
  onClose: () => any;
}

interface IState {}

export default class MoveBatchModal extends TankComponent<IProps, IState> {
  pager = new Pager<Matter>(this, Matter, 10);
  targetUuid = "root";
  treeData = [
    {
      title: "根目录",
      key: "root",
    },
  ];

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.pager.setFilterValue("orderCreateTime", "DESC");
    this.pager.setFilterValue("dir", true);
  }

  static open(onSuccess: () => void) {
    let modal = Modal.confirm({
      title: "移动到",
      width: "50vw",
      content: (
        <MoveBatchModal
          onSuccess={() => {
            modal.destroy();
            onSuccess();
          }}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  }

  fetchData = (treeNode: any, success: () => any) => {
    const { data: origin } = treeNode.props;
    this.pager.setFilterValue("puuid", treeNode.key);
    this.pager.httpList((response: any) => {
      const { data, page, totalPages } = response.data.data;
      origin.children = (origin.children || []).concat(
        data.map((matter: Matter) => ({
          title: matter.name,
          key: matter.uuid,
        }))
      );
      if (page + 1 < totalPages) {
        this.pager.page++;
        this.fetchData(treeNode, success);
      } else {
        this.pager.page = 0;
        success();
      }
    });
  };

  onLoadData = (treeNode: any) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.fetchData(treeNode, () => resolve());
    }).then(() => {
      this.treeData = JSON.parse(JSON.stringify(this.treeData));
      this.updateUI();
    });
  };

  onSelect = (selectedKeys: any) => {
      if(selectedKeys.length) {
        this.targetUuid = selectedKeys[0];
        this.updateUI();
      }
  };

  render() {
    return (
      <Tree.DirectoryTree treeData={this.treeData} selectedKeys={[this.targetUuid]} loadData={this.onLoadData} onSelect={this.onSelect} />
    );
  }
}
