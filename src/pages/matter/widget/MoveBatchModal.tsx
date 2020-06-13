import React from "react";
import TankComponent from "../../../common/component/TankComponent";
import { Modal, Tree, Button } from "antd";
import Pager from "../../../common/model/base/Pager";
import Matter from "../../../common/model/matter/Matter";
import "./MoveBatchModal.less";

interface IProps {
  onSuccess: (uuid: string) => any;
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

  static open(onSuccess: (uuid: string) => void) {
    let modal = Modal.confirm({
      title: "移动到",
      width: "50vw",
      okCancel: false,
      okButtonProps: {
        className: "display-none"
      },
      content: (
        <MoveBatchModal
          onSuccess={(uuid: string) => {
            modal.destroy();
            onSuccess(uuid);
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
      <div>
        <Tree.DirectoryTree className="tree-wrapper" treeData={this.treeData} defaultExpandedKeys={['root']} selectedKeys={[this.targetUuid]} loadData={this.onLoadData} onSelect={this.onSelect} />
        <div className="mt10 text-right">
          <Button className="mr10" onClick={() => this.props.onClose()}>关闭</Button>
          <Button type="primary" onClick={() => this.props.onSuccess(this.targetUuid)}>确定</Button>
        </div>
      </div>
    );
  }
}
