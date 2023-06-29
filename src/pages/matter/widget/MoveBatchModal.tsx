import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import { Button, Modal, Tree } from 'antd';
import Pager from '../../../common/model/base/Pager';
import Matter from '../../../common/model/matter/Matter';
import './MoveBatchModal.less';
import Lang from '../../../common/model/global/Lang';
import {
  ExclamationCircleFilled,
  FolderFilled,
  FolderOpenFilled,
} from '@ant-design/icons';

interface IProps {
  spaceUuid: string;
  onSuccess: (uuid: string) => any;
  onClose: () => any;
}

interface IState {}

export default class MoveBatchModal extends TankComponent<IProps, IState> {
  pager = new Pager<Matter>(this, Matter, 10);
  targetUuid = 'root';
  treeData = [
    {
      title: Lang.t('matter.root'),
      key: 'root',
    },
  ];

  componentDidMount() {
    this.pager.setFilterValue('spaceUuid', this.props.spaceUuid);
    this.pager.setFilterValue('orderCreateTime', 'DESC');
    this.pager.setFilterValue('dir', true);
  }

  static open(spaceUuid: string, onSuccess: (uuid: string) => void) {
    let modal = Modal.confirm({
      className: 'move-modal custom-handle-modal',
      title: Lang.t('matter.moveTo'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      width: '90vw',
      okCancel: false,
      content: (
        <MoveBatchModal
          spaceUuid={spaceUuid}
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

  fetchData(treeNode: any, success: () => any) {
    const { data: origin } = treeNode.props;
    this.pager.setFilterValue('puuid', treeNode.key);
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
  }

  onLoadData(treeNode: any) {
    return new Promise((resolve: any) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.fetchData(treeNode, () => resolve());
    }).then(() => {
      this.treeData = JSON.parse(JSON.stringify(this.treeData));
      this.updateUI();
    });
  }

  onSelect(selectedKeys: any) {
    if (selectedKeys.length) {
      this.targetUuid = selectedKeys[0];
      this.updateUI();
    }
  }

  render() {
    return (
      <div>
        <Tree.DirectoryTree
          className="tree-wrapper"
          treeData={this.treeData}
          defaultExpandedKeys={['root']}
          selectedKeys={[this.targetUuid]}
          loadData={(e) => this.onLoadData(e)}
          onSelect={(e) => this.onSelect(e)}
          icon={(e) =>
            e.expanded ? (
              <FolderOpenFilled className="text-primary f20" />
            ) : (
              <FolderFilled className="text-primary f20" />
            )
          }
        />
        <div className="mt10 text-right">
          <Button className="mr10" onClick={() => this.props.onClose()}>
            {Lang.t('close')}
          </Button>
          <Button
            type="primary"
            onClick={() => this.props.onSuccess(this.targetUuid)}
          >
            {Lang.t('confirm')}
          </Button>
        </div>
      </div>
    );
  }
}
