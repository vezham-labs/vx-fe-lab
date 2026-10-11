export type RQStorage = Record<string, never>

export interface ArchiveItem {
  id: string
  title: string
  url: string
  archivedDate: string
  favicon?: string
}

export interface TrashItem {
  id: string
  title: string
  url: string
  deletedDate: string
  favicon?: string
}

export type StorageResponse = {
  archiveItems: ArchiveItem[]
  trashItems: TrashItem[]
}
