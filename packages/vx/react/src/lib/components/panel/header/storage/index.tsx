import { forwardRef, useState } from 'react'

import {
  Archive as ArchiveIcon,
  TrashBinTrash as TrashBinTrashIcon
} from '@vezham/icons-react'
import { Tabs, Tooltip } from '@vezham/react-v3'

import { useStorage } from '../../../../store/useStorage'
import { ShortcutTooltipLabel } from '../../../shortcut-key'
import { InfoPanelDefinition, useInfoPanel } from '../../info-panel'
import { Archive } from './archive'
import { Trash } from './trash'
import { ArchiveItem, Props, TrashItem, useProps } from './types'

const StorageContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const storageProps = useProps({ ...props, ref })
  const { Component } = storageProps

  const storageQuery = useStorage.list({})
  const [activeTab, setActiveTab] = useState<string>('archive')
  const [archiveSearch, setArchiveSearch] = useState('')
  const [trashSearch, setTrashSearch] = useState('')
  const [internalArchiveItems, setInternalArchiveItems] = useState<
    ArchiveItem[]
  >(() => storageQuery.data?.archiveItems ?? [])
  const [internalTrashItems, setInternalTrashItems] = useState<TrashItem[]>(
    () => storageQuery.data?.trashItems ?? []
  )

  const archiveItems = storageProps.externalArchiveItems || internalArchiveItems
  const trashItems = storageProps.externalTrashItems || internalTrashItems

  return (
    <Component className="h-full">
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <div className="shrink-0 px-1 pb-3">
          <Tabs
            variant="primary"
            {...storageProps.getTabsProps()}
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(key as string)}>
            <Tabs.ListContainer {...storageProps.getTabsListContainerProps()}>
              <Tabs.List {...storageProps.getTabsListProps()}>
                <Tabs.Tab {...storageProps.getTabArchiveProps()}>
                  <ArchiveIcon size={18} className="mr-2" aria-hidden="true" />
                  Archive
                  <Tabs.Indicator {...storageProps.getTabIndicatorProps()} />
                </Tabs.Tab>
                <Tabs.Tab {...storageProps.getTabTrashProps()}>
                  <TrashBinTrashIcon
                    size={18}
                    className="mr-2"
                    aria-hidden="true"
                  />
                  Trash
                  <Tabs.Indicator {...storageProps.getTabIndicatorProps()} />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {activeTab === 'archive' ? (
            <Archive
              {...storageProps}
              archiveItems={archiveItems}
              archiveSearch={archiveSearch}
              setArchiveSearch={setArchiveSearch}
              setInternalArchiveItems={setInternalArchiveItems}
            />
          ) : (
            <Trash
              {...storageProps}
              trashItems={trashItems}
              trashSearch={trashSearch}
              setTrashSearch={setTrashSearch}
              setInternalTrashItems={setInternalTrashItems}

              getDeletePermanentButtonProps={
                storageProps.getDeletePermanentButtonProps
              }
            />
          )}
        </div>
      </div>
    </Component>
  )
})

StorageContent.displayName = 'StorageContent'

const StorageTrigger = () => {
  const { activeInfoPanel, toggleInfoPanel } = useInfoPanel()
  const isActive = activeInfoPanel === 'storage'

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <span aria-label="Storage">
          <ArchiveIcon
            className={isActive ? 'text-muted' : ''}
            weight={isActive ? 'filled' : 'outline'}
            size={20}
            onClick={() => toggleInfoPanel('storage')}
            aria-hidden="true"
          />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right">
        <ShortcutTooltipLabel label="Storage" shortcut="Mod ⇧ S" />
      </Tooltip.Content>
    </Tooltip>
  )
}

const StoragePanelContent = () => {
  return <StorageContent />
}

const storagePanel: InfoPanelDefinition = {
  title: 'Storage',
  scrollable: false,
  content: <StoragePanelContent />
}

export { storagePanel, StorageTrigger }
