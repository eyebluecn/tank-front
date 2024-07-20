import { Button, Modal, Space } from 'antd'
import Lang from '@/common/model/global/Lang'
import React from 'react'

interface Props {
  onClose: () => void
  onHardDel: () => void
  onSoftDel: () => void
  allowSoftDel: boolean // 是否允许软删除，非空间下 & 开启回收站功能
}

const MatterDeleteModal = ({ onClose, onHardDel, onSoftDel, allowSoftDel }: Props) => {
  return (
    <Modal
      visible
      title={Lang.t('delete')}
      footer={
        <Space>
          <Button className="mr10" onClick={onClose}>
            {Lang.t('cancel')}
          </Button>
          <Button type="primary" danger onClick={onHardDel}>
            {Lang.t('deleteDirectly')}
          </Button>
          {allowSoftDel && (
            <Button type="primary" className="ml10" onClick={onSoftDel}>
              {Lang.t('matter.intoRecycleBin')}
            </Button>
          )}
        </Space>
      }
    >
      <p>{Lang.t('actionDeleteConfirm')}</p>
    </Modal>
  )
}

export default MatterDeleteModal
