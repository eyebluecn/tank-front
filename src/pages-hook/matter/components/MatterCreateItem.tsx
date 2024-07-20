import { Checkbox } from 'antd'
import React from 'react'
import FileUtil from '@/common/util/FileUtil'
import Lang from '@/common/model/global/Lang'
import './MatterCreateItem.less'

interface Props {
  onBlurInput: (name: string) => void
}

const MatterCreateItem = ({ onBlurInput }: Props) => {
  return (
    <div className="widget-matter-create-item">
      <div className="checkbox-wrapper">
        <Checkbox checked={false} />
      </div>

      <div className="icon-wrapper">
        <img src={FileUtil.getIcon(null, true)} alt={'dir'} />
      </div>
      <div className="name-wrapper">
        <input
          className="name-input"
          placeholder={Lang.t('matter.enterName')}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              e.currentTarget.blur()
            }
          }}
          onBlur={(e) => onBlurInput(e.target.value.trim())}
        />
      </div>
    </div>
  )
}

export default MatterCreateItem
