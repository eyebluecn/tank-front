import { IMatter } from '@/models/Matter'
import { EMatterItemFrom } from '@/pages-hook/matter/components/MatterItem'
import { SpaceMemberRole } from '@/common/model/space/member/SpaceMemberRole'
import { ISpaceMember } from '@/models/SpaceMember'
import Lang from '@/common/model/global/Lang'
import { DownloadOutlined, InfoCircleOutlined, LinkOutlined, LockOutlined, RedoOutlined, UnlockOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons/lib'
import { stopPropagation } from '@/utils/dom.util'

interface Props {
  from: EMatterItemFrom
  matter: IMatter
  spaceMember?: ISpaceMember // from === EMatterItemFrom.Space 时会传入
}
const useMatterItemHandles = ({ from, matter, spaceMember }: Props) => {
  // 空间内文件的部分操作需要权限
  const hasHigherSpacePermission =
    from === EMatterItemFrom.Space && !!spaceMember && [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(spaceMember.role)

  /*
   * 操作项
   * 默认/空间下：设置公私有（空间下校验权限）、文件详情、重命名（空间下校验权限）、复制路径、下载、删除（空间下校验权限）、文件大小、修改时间
   * 分享：下载、文件大小、修改时间
   * 回收站：恢复、文件详情、硬删除、文件大小、软删除时间
   * */
  return {
    canSetPrivacy: (from === EMatterItemFrom.Default || hasHigherSpacePermission) && !matter.dir,
    canRecover: from === EMatterItemFrom.Bin,
    canGoDetail: [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Bin].includes(from),
    canRename: from === EMatterItemFrom.Default || hasHigherSpacePermission,
    canCopyPath: [EMatterItemFrom.Default, EMatterItemFrom.Space].includes(from) && !matter.dir, // 文件夹不支持复制路径 安全问题
    canDownload: [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Shared].includes(from),
    canDelete: from === EMatterItemFrom.Default || hasHigherSpacePermission,
    canHardDelete: from === EMatterItemFrom.Bin,
    canViewUpdateTime: [EMatterItemFrom.Default, EMatterItemFrom.Space, EMatterItemFrom.Shared].includes(from),
    canViewDeleteTime: from === EMatterItemFrom.Bin,
  }
}

export default useMatterItemHandles

interface IMatterItemHandleProps {
  onClick: () => void
}

export const getMatterItemHandles = (platform: 'pc' | 'mobile') => {
  const isPc = platform === 'pc'
  const renderHandle = (Icon: React.ForwardRefExoticComponent<any>, title: string, onClick: () => void) => {
    return isPc ? (
      <Tooltip title={title}>
        <Icon className="btn-action" onClick={stopPropagation(onClick)} />
      </Tooltip>
    ) : (
      <div className="operation-item" onClick={stopPropagation(onClick)}>
        <Icon className="mr5" />
        <span className="ml5">{title}</span>
      </div>
    )
  }

  const renderDangerHandle = (Icon: React.ForwardRefExoticComponent<any>, title: string, onClick: () => void) => {
    return isPc ? (
      <Tooltip title={title}>
        <Icon className="btn-action text-danger" onClick={stopPropagation(onClick)} />
      </Tooltip>
    ) : (
      <div className="operation-item text-danger" onClick={stopPropagation(onClick)}>
        <Icon className="mr5" />
        <span className="ml5">{title}</span>
      </div>
    )
  }

  return {
    SetPrivacy: (props: IMatterItemHandleProps) => renderHandle(LockOutlined, Lang.t('matter.setPrivate'), props.onClick),
    SetUnPrivacy: (props: IMatterItemHandleProps) => renderHandle(UnlockOutlined, Lang.t('matter.setPublic'), props.onClick),
    Recover: (props: IMatterItemHandleProps) => renderHandle(RedoOutlined, Lang.t('matter.recovery'), props.onClick),
    GoDetail: (props: IMatterItemHandleProps) => renderHandle(InfoCircleOutlined, Lang.t('matter.fileDetail'), props.onClick),
    Rename: (props: IMatterItemHandleProps) => renderHandle(EditOutlined, Lang.t('matter.rename'), props.onClick),
    CopyPath: (props: IMatterItemHandleProps) => renderHandle(LinkOutlined, Lang.t('matter.copyPath'), props.onClick),
    Download: (props: IMatterItemHandleProps) => renderHandle(DownloadOutlined, Lang.t('matter.download'), props.onClick),
    Delete: (props: IMatterItemHandleProps) => renderDangerHandle(DeleteOutlined, Lang.t('matter.delete'), props.onClick),
    HardDelete: (props: IMatterItemHandleProps) => renderDangerHandle(DeleteOutlined, Lang.t('matter.hardDelete'), props.onClick),
  }
}
