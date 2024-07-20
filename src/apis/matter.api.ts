import { generateCRUDApi } from './util'
import { IMatter } from '@/models/Matter'
import { axios } from '@/setupAxios'

const API_PREFIX = 'matter'

export const matterCRUDApi = generateCRUDApi<{
  listResponse: {
    data: IMatter[]
    total: number
  }
}>(API_PREFIX)

export const updateMatterPrivacy = (body: { spaceUuid: string; uuid: string; privacy: boolean }) => {
  return axios.post(`${API_PREFIX}/change/privacy`, body)
}
