import { Breadcrumb } from 'antd'
import React from 'react'
import { ISpace } from '@/models/Space'
import { Link } from 'react-router-dom'
import { SPACE_PATH } from '@/consts/router.const'
import { Route } from 'antd/lib/breadcrumb/Breadcrumb'

interface Props {
  space?: ISpace
  breadcrumbRoutes: Route[]
}

const MatterListBreadcrumb = ({ space, breadcrumbRoutes }: Props) => {
  return (
    <Breadcrumb separator="">
      {space && (
        <>
          <Breadcrumb.Item>
            <Link to={SPACE_PATH}>{space.name}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>:</Breadcrumb.Separator>
        </>
      )}

      {breadcrumbRoutes.map((route, index) => (
        <>
          <Breadcrumb.Item>{route.path ? <Link to={route.path}>{route.breadcrumbName}</Link> : route.breadcrumbName}</Breadcrumb.Item>
          {index !== breadcrumbRoutes.length - 1 && <Breadcrumb.Separator />}
        </>
      ))}
    </Breadcrumb>
  )
}

export default MatterListBreadcrumb
