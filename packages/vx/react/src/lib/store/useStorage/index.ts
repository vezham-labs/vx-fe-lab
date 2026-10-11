import { useQuery } from '@tanstack/react-query'

import { Storage } from './action'
import { storageData } from './data'
import type { RQStorage } from './types'

export * from './data'
export * from './types'

const CK_STORAGE = 'storage'

const useStorageList = (rq: RQStorage = {}) =>
  useQuery({
    queryKey: [CK_STORAGE, rq],
    queryFn: () => Storage.list(rq),
    initialData: storageData
  })

export const useStorage = {
  list: useStorageList
}
