import { IMatter } from '@/models/Matter'

/**
 * 获取空间详情路径，todo check 都传空间uuid是否可行
 * */
export const getMatterDetailPath = (matter: IMatter) => {
  return `/space/${matter.spaceUuid}/matter/detail/${matter.uuid}`
}
