import React from 'react';
import TankComponent from '../../../common/component/TankComponent';
import { Button, Modal } from 'antd';
import Lang from '../../../common/model/global/Lang';
import Moon from '../../../common/model/global/Moon';
import { ExclamationCircleFilled } from '@ant-design/icons';
import './MatterDeleteModal.less';
import Preference from '../../../common/model/preference/Preference';

interface IProps {
  onSoftDel: () => void;
  onHardDel: () => void;
  onClose: () => void;
}

interface IState {}

export default class MatterDeleteModal extends TankComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  static preference: Preference = Moon.getSingleton().preference;

  static open(onSoftDel: () => void, onHardDel: () => void) {
    let modal = Modal.warning({
      className: 'delete-modal custom-handle-modal',
      title: Lang.t('delete'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      okCancel: false,
      content: (
        <MatterDeleteModal
          onSoftDel={() => {
            onSoftDel();
            modal.destroy();
          }}
          onHardDel={() => {
            onHardDel();
            modal.destroy();
          }}
          onClose={() => {
            modal.destroy();
          }}
        />
      ),
    });
  }

  render() {
    return (
      <div className="matter-delete-modal">
        <p>{Lang.t('actionDeleteConfirm')}</p>
        <div className="mt30 text-right">
          <Button className="mr10" onClick={this.props.onClose}>
            {Lang.t('cancel')}
          </Button>
          <Button type="primary" danger onClick={this.props.onHardDel}>
            {Lang.t('deleteDirectly')}
          </Button>
          {MatterDeleteModal.preference.getRecycleBinStatus() && (
            <Button
              type="primary"
              className="ml10"
              onClick={this.props.onSoftDel}
            >
              {Lang.t('matter.intoRecycleBin')}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
