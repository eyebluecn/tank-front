import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FolderOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons'
import { Button, Col, Input, message, Pagination, Row, Skeleton, Space as AntdSpace } from 'antd'
import { useLockFn, usePagination } from 'ahooks'
import MatterItem, { EMatterItemFrom } from './components/MatterItem'
import Matter, { IMatter, IMatterDetail } from '@/models/Matter'
import { Params } from 'ahooks/es/useAntdTable/types'
import { GlobalContext } from '@/contexts/globalContext'
import Lang from '@/common/model/global/Lang'
import { ISpaceMember } from '@/models/SpaceMember'
import MatterCreateItem from '@/pages-hook/matter/components/MatterCreateItem'
import MatterListBreadcrumb from '@/pages-hook/matter/components/MatterListBreadcrumb'
import { ISpace } from '@/models/Space'
import { Route as BreadcrumbRoute } from 'antd/lib/breadcrumb/Breadcrumb'
import useUrlState from '@ahooksjs/use-url-state'
import ImagePreviewer from '@/pages/widget/previewer/ImagePreviewer'
import usePreviewer from '@/hooks/usePreviewer'
import SortDirection from '@/common/model/base/SortDirection'
import EnvUtil from '@/common/util/EnvUtil'
import useModal from '@/hooks/useModal'
import MatterDeleteModal from '@/pages-hook/matter/components/MatterDeleteModal'
import Preference from '@/models/Preference'

import './List.less'
import { SpaceMemberRole } from '@/common/model/space/member/SpaceMemberRole'

interface Props {
  spaceUuid?: string // 是否在空间模式下
}

interface IQuerySearch {
  puuid?: string
  keyword?: string
  orderName?: SortDirection
  orderSize?: SortDirection
  orderUpdateTime?: SortDirection
}

/*
 * 考虑函数式还是面向对象来解决函数封装问题
 * 答：将二者结合起来进行使用
 * */

const List = ({ spaceUuid }: Props) => {
  const { user, preference, updateCapacity } = useContext(GlobalContext)
  const p = new Preference(preference)
  const isInSpace = !!spaceUuid // 是否在共享空间下
  const matterListPath = isInSpace ? `/space/${spaceUuid}/matter/list` : '/new/matter/list' // todo 链接替换
  const matterSpaceUuid = isInSpace ? spaceUuid : user?.spaceUuid! // 非空间模式下，使用用户个人的spaceUuid
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [dragEnterCount, setDragEnterCount] = useState(0) // todo change
  const [space, setSpace] = useState<ISpace | undefined>(undefined) // 当前共享空间
  const [spaceMember, setSpaceMember] = useState<ISpaceMember | undefined>(undefined)
  const [isCreateDir, setIsCreateDir] = useState(false)
  const [currentDir, setCurrentDir] = useState<IMatterDetail | null>(null) // 当前目录文件夹
  const [selectedMatterUuids, setSelectedMatterUuids] = useState<string[]>([])

  const { previewFile } = usePreviewer()
  const { openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal(MatterDeleteModal)
  const [urlQuery, setUrlQuery] = useUrlState<IQuerySearch>({
    puuid: Matter.MATTER_ROOT,
  })

  const fetchData = async ({
    current,
    pageSize,
  }: Params[0]): Promise<{
    list: IMatter[]
    total: number
  }> => {
    // search query
    // fetch data

    const { puuid, orderName, orderSize, orderUpdateTime, keyword } = urlQuery
    const res = await Matter.httpList({
      page: current - 1,
      pageSize,
      puuid,
      orderName,
      orderSize,
      orderUpdateTime,
      name: keyword,
    })
    console.log('res', res)

    return {
      list: res.data,
      total: res.totalItems,
    }
  }

  const { data, loading, refresh, mutate } = usePagination(fetchData, {
    refreshDeps: [urlQuery],
  })

  // 局部更新，不更新列表，提高性能
  const partialUpdate = (matter: IMatter, field: keyof IMatter, updateValue: any) => {
    mutate((oldData) => {
      const index = oldData?.list.findIndex((item) => item.uuid === matter.uuid) ?? -1
      if (index !== -1) {
        oldData!.list[index][field] = updateValue as never
      }
      return oldData
    })
  }

  const handleMatterTogglePrivacy = useLockFn(async (matter: IMatter) => {
    await new Matter(matter).httpTogglePrivacy()
    partialUpdate(matter, 'privacy', !matter.privacy)
    message.success(Lang.t('operationSuccess'))
  })

  const handleMatterRename = useLockFn(async (matter: IMatter, name: string) => {
    await new Matter(matter).httpRename(name)
    partialUpdate(matter, 'name', name)
    message.success(Lang.t('operationSuccess'))
  })

  const refreshAndUpdateCapacity = () => {
    refresh()
    updateCapacity()
  }

  const handleClickCreateDir = () => {
    if (isCreateDir) return
    setIsCreateDir(true)
  }

  const handleCreateDir = async (name: string) => {
    try {
      await Matter.httpCreateDirectory({ spaceUuid: matterSpaceUuid, puuid: urlQuery.puuid, name })
      refreshAndUpdateCapacity()
    } finally {
      setIsCreateDir(false)
    }
  }

  // 如果在空间下，有些操作权限只对管理员和读写成员开放
  const checkHandlePermission = () => {
    if (isInSpace) {
      if (!spaceMember) return false
      return [SpaceMemberRole.ADMIN, SpaceMemberRole.READ_WRITE].includes(spaceMember.role)
    }
    return true
  }

  const handleDeleteBatch = () => {}

  const getBreadcrumbs = useMemo((): BreadcrumbRoute[] => {
    const breadcrumbs: BreadcrumbRoute[] = []

    // 递归遍历父级，直到根目录parent = null
    let parent: IMatterDetail | null = currentDir
    while (parent) {
      breadcrumbs.unshift({
        breadcrumbName: parent.name,
        path: parent.uuid === currentDir?.uuid ? '' : `${matterListPath}?puuid=${parent.uuid}`,
      })
      parent = parent.parent
    }

    breadcrumbs.unshift({
      breadcrumbName: Lang.t('matter.allFiles'),
      path: currentDir ? matterListPath : '',
    })

    return breadcrumbs
  }, [currentDir])

  const handleMatterClickRow = (matter: IMatter) => {
    const m = new Matter(matter)
    if (matter.dir) {
      // 进入文件夹
      setUrlQuery({ puuid: matter.uuid })
    } else if (m.isImage()) {
      // 预览图片
      const imageMatters = data?.list.filter((item) => new Matter(item).isImage()) || []
      const startIndex = imageMatters.findIndex((item) => item.uuid === matter.uuid)
      const imageMatterUrls = imageMatters.map((item) => new Matter(item).getPreviewUrl())
      ImagePreviewer.showMultiPhoto(imageMatterUrls, startIndex)
    } else {
      previewFile({
        name: matter.name,
        size: matter.size,
        url: m.getPreviewUrl(),
      })
    }
  }

  const handleMatterToggleSelect = (matter: IMatter) => {
    const index = selectedMatterUuids.findIndex((uuid) => uuid === matter.uuid)
    if (index === -1) {
      setSelectedMatterUuids(selectedMatterUuids.concat(matter.uuid))
    } else {
      selectedMatterUuids.splice(index, 1)
      setSelectedMatterUuids([...selectedMatterUuids])
    }
  }

  const handleMatterDelete = (matter: IMatter) => {
    const m = new Matter(matter)
    openDeleteModal({
      onClose: closeDeleteModal,
      onSoftDel: async () => {
        await m.httpSoftDelete()
        closeDeleteModal()
        message.success(Lang.t('operationSuccess'))
        refreshAndUpdateCapacity()
      },
      onHardDel: async () => {
        await m.httpHardDelete()
        closeDeleteModal()
        message.success(Lang.t('operationSuccess'))
        refreshAndUpdateCapacity()
      },
      allowSoftDel: !isInSpace && p.getRecycleBinStatus(),
    })
  }

  const handleChangeSortFilter = (field: keyof Pick<IQuerySearch, 'orderName' | 'orderSize' | 'orderUpdateTime'>) => {
    const sortAutomaton = [SortDirection.ASC, SortDirection.DESC, undefined] // 排序状态自动机：ASC -> DESC -> null -> ASC...
    const index = sortAutomaton.findIndex((item) => item === urlQuery[field])
    const nextIndex = (index + 1) % sortAutomaton.length
    setUrlQuery({
      [field]: sortAutomaton[nextIndex],
    })
  }

  const refreshCurrentDirDetail = async (dirUuid: string) => {
    if (dirUuid === Matter.MATTER_ROOT) {
      setCurrentDir(null)
      return
    }
    const res = await Matter.httpDetail(matterSpaceUuid, dirUuid)
    console.log('detail', res)
    setCurrentDir(res)
  }

  const handleDownloadZip = () => {
    window.open(`${EnvUtil.currentHost()}${Matter.URL_MATTER_ZIP}?uuids=${selectedMatterUuids}&spaceUuid=${spaceUuid}`)
  }

  useEffect(() => {
    refreshCurrentDirDetail(urlQuery.puuid) // 重新获取当前文件夹信息
    setSelectedMatterUuids([]) // 清空选择项
  }, [urlQuery.puuid])

  if (isInSpace && !space && !spaceMember) return <Skeleton active />

  // FIXME 用usecallback包裹是否会有性能提升
  const renderSortIcon = (order?: SortDirection) => {
    if (!order) return null
    return order === SortDirection.ASC ? <ArrowUpOutlined className="ml5 f10" /> : <ArrowDownOutlined className="ml5 f10" />
  }

  return (
    <div className="matter-list" ref={wrapperRef}>
      {/*todo drag file*/}
      {/*{dragEnterCount > 0 ? (
        <div className="obscure">
          <CloudUploadOutlined className="white f50" />
        </div>
      ) : null}*/}

      <MatterListBreadcrumb space={space} breadcrumbRoutes={getBreadcrumbs} />

      {/*handle context*/}
      <Row>
        <Col xs={24} sm={24} md={14} lg={16} className="mt10">
          <AntdSpace>
            {selectedMatterUuids.length !== data?.list.length && (
              <Button type="primary" className="mb10" onClick={() => setSelectedMatterUuids((data?.list || []).map((item) => item.uuid))}>
                <PlusSquareOutlined />
                {Lang.t('selectAll')}
              </Button>
            )}

            {!!data?.list.length && selectedMatterUuids.length === data.list.length && (
              <Button type="primary" className="mb10" onClick={() => setSelectedMatterUuids([])}>
                <MinusSquareOutlined />
                {Lang.t('cancel')}
              </Button>
            )}

            {selectedMatterUuids.length > 0 && (
              <>
                <Button type="primary" className="mb10" onClick={handleDownloadZip}>
                  <DownloadOutlined />
                  {Lang.t('download')}
                </Button>
                {checkHandlePermission() && (
                  <Button type="primary" className="mb10" onClick={handleDeleteBatch}>
                    <DeleteOutlined />
                    {Lang.t('delete')}
                  </Button>
                )}
              </>
            )}

            <Button type="primary" className="mb10" onClick={handleClickCreateDir}>
              <FolderOutlined />
              {Lang.t('matter.create')}
            </Button>
          </AntdSpace>
        </Col>

        <Col xs={24} sm={24} md={10} lg={8} className="mt10">
          <Input.Search
            enterButton
            className="mb10"
            placeholder={Lang.t('matter.searchFile')}
            onSearch={refresh}
            onChange={(e) =>
              setUrlQuery({
                keyword: e.target.value,
                // todo 考虑非第一页的情况会不会自动跳转到第一页
              })
            }
          />
        </Col>
      </Row>

      {/*uploader context*/}

      <div className="widget-matter-list-header">
        <div className="sort-part sort-part-name" onClick={() => handleChangeSortFilter('orderName')}>
          {Lang.t('matter.fileName')}
          {renderSortIcon(urlQuery.orderName)}
        </div>
        <div className="visible-pc-flex sort-part sort-part-size" onClick={() => handleChangeSortFilter('orderSize')}>
          {Lang.t('matter.size')}
          {renderSortIcon(urlQuery.orderSize)}
        </div>
        <div className="visible-pc-flex sort-part sort-part-date" onClick={() => handleChangeSortFilter('orderUpdateTime')}>
          {Lang.t('matter.updateDate')}
          {renderSortIcon(urlQuery.orderUpdateTime)}
        </div>
      </div>

      <div>
        {isCreateDir && <MatterCreateItem onBlurInput={(name) => handleCreateDir(name)} />}
        {data?.list.map((matter) => (
          <MatterItem
            {...(isInSpace ? { from: EMatterItemFrom.Space, spaceMember: spaceMember! } : { from: EMatterItemFrom.Default })}
            key={matter.uuid}
            matter={matter}
            selected={selectedMatterUuids.includes(matter.uuid)}
            onToggleSelect={() => handleMatterToggleSelect(matter)}
            onTogglePrivacy={() => handleMatterTogglePrivacy(matter)}
            onDelete={() => handleMatterDelete(matter)}
            onSaveName={(name) => handleMatterRename(matter, name)}
            onClickRow={() => handleMatterClickRow(matter)}
          />
        ))}
      </div>

      <Pagination className="pull-right mt20" />
    </div>
  )
}

export default List
