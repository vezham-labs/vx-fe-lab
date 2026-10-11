import { storageData } from './data'
import type { RQStorage, StorageResponse } from './types'

const Storage = {
  list: async (rq: RQStorage): Promise<StorageResponse> => {
    void rq
    return Promise.resolve(storageData)
  }
}

export { Storage }
