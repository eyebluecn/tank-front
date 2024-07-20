import { axios } from '@/setupAxios'

export const generateCRUDApi = <
  T extends {
    filters?: Record<string, unknown>
    listResponse?: any // list接口返回值
  },
>(
  apiPrefix: string,
) => {
  return {
    list: (filters?: T['filters']): Promise<T['listResponse']> => {
      return axios.get(`${apiPrefix}/page`)
    },
    get: () => {},
    save: () => {},
    delete: () => {},
  }
}
