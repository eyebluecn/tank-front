import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import './MatterItem.less'
import { Checkbox, Dropdown, Input, InputRef, Menu, message, Modal, Space, Tooltip } from 'antd'
import Lang from '@/common/model/global/Lang'
import { EllipsisOutlined, ExclamationCircleFilled, UnlockOutlined } from '@ant-design/icons'
import { stopPropagation } from '@/utils/dom.util'
import Matter, { IMatter } from '@/models/Matter'
import { ISpaceMember } from '@/models/SpaceMember'
import Expanding from '@/pages/widget/Expanding'
import { getMatterItemHandles } from '@/hooks/useMatterItemHandles'
import StringUtil from '@/common/util/StringUtil'
import DateUtil from '@/common/util/DateUtil'
import { SpaceMemberRole } from '@/common/model/space/member/SpaceMemberRole'
import copy from 'copy-to-clipboard'
import ImageUtil from '@/common/util/ImageUtil'
import { IShare } from '@/models/Share'
import useModal from '@/hooks/useModal'
import MatterDeleteModal from '@/pages-hook/matter/components/MatterDeleteModal'
import { GlobalContext } from '@/contexts/globalContext'
import Preference from '@/models/Preference'
import { useHistory } from 'react-router'
import { getMatterDetailPath } from '@/utils/link.util'

export enum EMatterItemFrom {
  Default = 'default', // 文件列表
  Space = 'space', // 空间文件列表
  Bin = 'bin', // 回收站
  Shared = 'shared', // 分享
}

interface IBaseProps {
  from: EMatterItemFrom
  matter: IMatter
  onClickRow: () => void
}

interface IDefaultProps extends IBaseProps {
  from: EMatterItemFrom.Default
  selected: boolean
  onToggleSelect: () => void
  onTogglePrivacy: () => void
  onDelete: () => void
  onSaveName: (name: string) => void
}

interface ISpaceProps extends Omit<IDefaultProps, 'from'> {
  from: EMatterItemFrom.Space
  spaceMember: ISpaceMember
}

interface ISharedProps extends IBaseProps {
  from: EMatterItemFrom.Shared
  share: IShare
  currentShareRootUuid: string
  onGoToDirectory: () => void
}

interface IBinProps extends IBaseProps {
  from: EMatterItemFrom.Bin
  selected: boolean
  onToggleSelect: () => void
  onDeleted: () => void
  onRecovered: () => void
}

type Props = IDefaultProps | ISpaceProps | ISharedProps | IBinProps

const MatterItem = (props: Props) => {
  const { preference } = useContext(GlobalContext)
  const history = useHistory()
  const { from, matter, onClickRow } = props
  const m = new Matter(matter) // matter对象，包含一些方法以及封装的属性
  const p = new Preference(preference)
  const [inputMode, setInputMode] = useState(false) // 是否是输入态
  const [expand, setExpand] = useState(false)

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return
    node.value = matter.name
    node.focus()
    const dotIndex = matter.name.lastIndexOf('.')
    node.setSelectionRange(0, dotIndex === -1 ? matter.name.length : dotIndex)
  }, [])

  // 空间内文件的部分操作需要权限
  const hasHigherSpacePermission =
    from === EMatterItemFrom.Space && [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(props.spaceMember.role)

  /*
   * 操作项
   * 默认/空间下：设置公私有（空间下校验权限）、文件详情、重命名（空间下校验权限）、复制路径、下载、删除（空间下校验权限）、文件大小、修改时间
   * 分享：下载、文件大小、修改时间
   * 回收站：恢复、文件详情、硬删除、文件大小、软删除时间
   * */
  const canSetPrivacy = (from === EMatterItemFrom.Default || hasHigherSpacePermission) && !matter.dir
  const canRecover = from === EMatterItemFrom.Bin
  const canGoDetail = [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Bin].includes(from)
  const canRename = from === EMatterItemFrom.Default || hasHigherSpacePermission
  const canCopyPath = [EMatterItemFrom.Default, EMatterItemFrom.Space].includes(from) && !matter.dir // 文件夹不支持复制路径 安全问题
  const canDownload = [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Shared].includes(from)
  const canDelete = from === EMatterItemFrom.Default || hasHigherSpacePermission
  const canHardDelete = from === EMatterItemFrom.Bin
  const canViewUpdateTime = [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Shared].includes(from)
  const canViewDeleteTime = from === EMatterItemFrom.Bin

  const handleGoDetail = () => {
    history.push(getMatterDetailPath(matter))
  }

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    if (from !== EMatterItemFrom.Default && from !== EMatterItemFrom.Space) return
    const name = e.target.value.trim()
    props.onSaveName(name)
    setInputMode(false)
  }

  /*
   * 个人空间/团队空间：文件预览/进入文件夹
   * 分享：文件预览/进入文件夹
   * 回收站：文件预览
   * */
  // const handleClickRow = () => {
  //   if (matter.dir) {
  //     if (from === EMatterItemFrom.Default || from === EMatterItemFrom.Space || from === EMatterItemFrom.Shared) {
  //       props.onGoToDirectory()
  //     }
  //     return
  //   } else {
  //     //  文件预览
  //     if (m.isImage()) {
  //     } else {
  //     }
  //   }
  // }

  const handleCopy = () => {
    if (copy(m.getDownloadUrl())) {
      message.success(Lang.t('copySuccess'))
    } else {
      message.error(Lang.t('copyError'))
    }
  }

  const handleDownload = () => {
    if ([EMatterItemFrom.Default, EMatterItemFrom.Space].includes(from)) return window.open(m.getDownloadUrl())
    if (from === EMatterItemFrom.Shared) return window.open(m.getShareDownloadUrl(props.share.uuid, props.share.code, props.currentShareRootUuid))
  }

  // todo 移到外层去
  const handleHardDelete = () => {
    Modal.confirm({
      title: Lang.t('actionCanNotRevertConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: async () => {
        await m.httpHardDelete()
        message.success(Lang.t('operationSuccess'))
        from === EMatterItemFrom.Bin && props.onDeleted()
      },
    })
  }

  // todo 移到外层去
  const handleRecover = () => {
    Modal.confirm({
      title: Lang.t('actionRecoveryConfirm'),
      icon: <ExclamationCircleFilled twoToneColor="#FFDC00" />,
      onOk: async () => {
        await m.httpRecover()
        message.success(Lang.t('operationSuccess'))
        from === EMatterItemFrom.Bin && props.onRecovered()
      },
    })
  }

  // todo 是否可以用useCallback对其进行优化
  const getOperations = (platform: 'pc' | 'mobile') => {
    const Handles = getMatterItemHandles(platform)
    const operations: JSX.Element[] = []
    if (canSetPrivacy) {
      operations.push(
        matter.privacy ? <Handles.SetUnPrivacy onClick={props.onTogglePrivacy} /> : <Handles.SetPrivacy onClick={props.onTogglePrivacy} />,
      )
    }

    if (canRecover) operations.push(<Handles.Recover onClick={handleRecover} />)
    if (canGoDetail) operations.push(<Handles.GoDetail onClick={handleGoDetail} />)
    if (canRename) operations.push(<Handles.Rename onClick={() => setInputMode(true)} />)
    if (canCopyPath) operations.push(<Handles.CopyPath onClick={handleCopy} />)
    if (canDownload) operations.push(<Handles.Download onClick={handleDownload} />)
    if (canDelete) operations.push(<Handles.Delete onClick={props.onDelete} />)
    if (canHardDelete) operations.push(<Handles.HardDelete onClick={handleHardDelete} />)
    return operations
  }

  const renderPcOperations = (
    <div className="pc-operations">
      <Space className="operations text-theme" size={3}>
        {getOperations('pc')}
      </Space>

      <Tooltip title={Lang.t('matter.size')}>
        <div className="size">{StringUtil.humanFileSize(matter.size)}</div>
      </Tooltip>
      {canViewUpdateTime && (
        <Tooltip title={Lang.t('matter.updateTime')}>
          <div className="date">{DateUtil.simpleDateHourMinute(matter.updateTime)}</div>
        </Tooltip>
      )}
      {canViewDeleteTime && (
        <Tooltip title={Lang.t('matter.deleteTime')}>
          <div className="date">{DateUtil.simpleDateHourMinute(matter.deleteTime)}</div>
        </Tooltip>
      )}
    </div>
  )

  const renderMobileOperations = (
    <div className="mobile-operations">
      <div className="operation-item">
        <Space>
          {canViewUpdateTime && DateUtil.simpleDateHourMinute(matter.updateTime)}
          {canViewDeleteTime && DateUtil.simpleDateHourMinute(matter.deleteTime)}
          {StringUtil.humanFileSize(matter.size)}
        </Space>
      </div>
      {getOperations('mobile')}
    </div>
  )

  const getIcon = () => {
    if (from === EMatterItemFrom.Shared && m.isImage())
      return ImageUtil.handleImageUrl(m.getSharePreviewUrl(props.share.uuid, props.share.code, props.currentShareRootUuid), false, 100, 100)
    return m.getIcon()
  }

  const dropdownMenu = (
    <Menu>
      {getOperations('mobile').map((item, i) => (
        <Menu.Item key={i}>{item}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={dropdownMenu} trigger={['contextMenu']}>
      <div className="widget-matter-item">
        <div className="matter-item" onClick={onClickRow}>
          {(from === EMatterItemFrom.Default || from === EMatterItemFrom.Space || from === EMatterItemFrom.Bin) && (
            <div className="checkbox-wrapper" onClick={stopPropagation(props.onToggleSelect)}>
              <Checkbox checked={props.selected} />
            </div>
          )}

          <div className="icon-wrapper">
            <img src={getIcon()} alt={matter.name} />
          </div>

          <div className="name-wrapper">
            {inputMode ? (
              <input
                ref={inputRef}
                className="name-input"
                placeholder={Lang.t('matter.enterName')}
                onKeyDown={(e) => {
                  if (e.key.toLowerCase() === 'enter') {
                    e.currentTarget.blur()
                  }
                }}
                onClick={stopPropagation(() => {})}
                onBlur={handleBlurInput}
              />
            ) : (
              <div className="name-info">
                {matter.name}
                {!matter.dir && !matter.privacy && (
                  <Tooltip title={Lang.t('matter.publicFileEveryoneCanVisit')}>
                    <UnlockOutlined className="icon" />
                  </Tooltip>
                )}
              </div>
            )}
          </div>

          {/*大屏幕下的操作栏*/}
          <div className="visible-pc handles">{renderPcOperations}</div>

          {/*小屏幕下的操作栏*/}
          <div className="visible-mobile handles">
            <EllipsisOutlined className="btn-action hot-area navy f18" onClick={stopPropagation(() => setExpand(!expand))} />
          </div>
        </div>
        <Expanding>{expand ? renderMobileOperations : null}</Expanding>
      </div>
    </Dropdown>
  )
}

export default MatterItem
