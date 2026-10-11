import { ContextMenu } from '@vezham/react-pro-v3'
import { Label } from '@vezham/react-v3'

import { AppIcon } from '../../../../app-icon'
import { ShortcutKey } from '../../../../shortcut-key'
import { panelContextMenuClass } from '../../../info-panel/styles'
import { type BookmarkTreeItem } from '../types'
import { type BookmarkContextMenuItemsProps } from './types'

const renderContextMenuLabel = (icon: string, label: string) => (
  <Label className="flex w-full items-center gap-2">
    <AppIcon icon={icon} size={16} aria-hidden="true" />
    <span>{label}</span>
  </Label>
)

const FolderMenuItems = ({
  item,
  onFolderEdit,
  onFolderDelete,
  onNewFolder
}: {
  item?: BookmarkTreeItem
  onFolderEdit: (item: BookmarkTreeItem) => void
  onFolderDelete: (id: string) => void
  onNewFolder: (parentId?: string) => void
}) => (
  <>
    <ContextMenu.Item
      id="create-folder"
      textValue="Create Folder"
      onPress={() => onNewFolder(item?.id)}>
      {renderContextMenuLabel('vx:folder-add', 'Create Folder')}
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item
      id="rename-folder"
      textValue="Rename Folder"
      isDisabled={!item}
      onPress={() => item && onFolderEdit(item)}>
      {renderContextMenuLabel('vx:pen', 'Rename Folder')}
    </ContextMenu.Item>
    <ContextMenu.Item
      id="change-color"
      textValue="Change Color"
      isDisabled={!item}
      onPress={() => item && onFolderEdit(item)}>
      {renderContextMenuLabel('vx:palette-round', 'Change Color')}
    </ContextMenu.Item>
    <ContextMenu.Item
      id="change-icon"
      textValue="Change Emoji/Icon"
      isDisabled={!item}
      onPress={() => item && onFolderEdit(item)}>
      {renderContextMenuLabel('vx:smile-circle', 'Change Emoji/Icon')}
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item
      id="delete-folder"
      textValue="Delete Folder"
      variant="danger"
      isDisabled={!item}
      onPress={() => item && onFolderDelete(item.id)}>
      {renderContextMenuLabel('vx:trash', 'Delete Folder')}
    </ContextMenu.Item>
  </>
)

const BookmarkContextMenuItems = ({
  contextTarget,
  folderTargets,
  onBookmarkRemove,
  onFolderEdit,
  onFolderDelete,
  onNewFolder,
  onBookmarkMove
}: BookmarkContextMenuItemsProps) => {
  const renderMoveTargets = (itemId: string) => (
    <ContextMenu.SubmenuTrigger>
      <ContextMenu.Item id="move" textValue="Move">
        {renderContextMenuLabel('vx:folder-with-files', 'Move')}
        <ContextMenu.SubmenuIndicator />
      </ContextMenu.Item>
      <ContextMenu.Popover className={panelContextMenuClass}>
        <ContextMenu.Menu>
          <ContextMenu.Item
            id="move-root"
            textValue="Bookmarks"
            onPress={() => onBookmarkMove(itemId)}>
            <Label>Bookmarks</Label>
          </ContextMenu.Item>
          {folderTargets.map(target => (
            <ContextMenu.Item
              key={target.id}
              id={`move-${target.id}`}
              textValue={target.title}
              onPress={() => onBookmarkMove(itemId, target.id)}>
              <Label
                className="block truncate"
                style={{ paddingInlineStart: target.depth * 10 }}>
                {target.title}
              </Label>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Menu>
      </ContextMenu.Popover>
    </ContextMenu.SubmenuTrigger>
  )

  if (contextTarget.type === 'folder') {
    return (
      <FolderMenuItems
        item={contextTarget.item}
        onFolderEdit={onFolderEdit}
        onFolderDelete={onFolderDelete}
        onNewFolder={onNewFolder}
      />
    )
  }

  if (contextTarget.type === 'bookmark') {
    return (
      <>
        <ContextMenu.Item
          id="create-folder"
          textValue="Create Folder"
          onPress={() => onNewFolder()}>
          {renderContextMenuLabel('vx:folder-add', 'Create Folder')}
        </ContextMenu.Item>
        <ContextMenu.Separator />
        {renderMoveTargets(contextTarget.item.id)}
        <ContextMenu.Separator />
        <ContextMenu.Item
          id="delete-bookmark"
          textValue="Delete"
          variant="danger"
          onPress={() => onBookmarkRemove(contextTarget.item.id)}>
          {renderContextMenuLabel('vx:trash', 'Delete')}
        </ContextMenu.Item>
      </>
    )
  }

  return (
    <FolderMenuItems
      onFolderEdit={onFolderEdit}
      onFolderDelete={onFolderDelete}
      onNewFolder={onNewFolder}
    />
  )
}

const BrowserContextMenuItems = () => (
  <>
    <ContextMenu.Item id="back" textValue="Back">
      <Label>Back</Label>
      <ShortcutKey className="ms-auto" shortcut="⌘ [" />
    </ContextMenu.Item>
    <ContextMenu.Item isDisabled id="forward" textValue="Forward">
      <Label>Forward</Label>
      <ShortcutKey className="ms-auto" shortcut="⌘ ]" />
    </ContextMenu.Item>
    <ContextMenu.Item id="reload" textValue="Reload">
      <Label>Reload</Label>
      <ShortcutKey className="ms-auto" shortcut="⌘ R" />
    </ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item id="view-source" textValue="View Page Source">
      <Label>View Page Source</Label>
    </ContextMenu.Item>
    <ContextMenu.Item id="inspect" textValue="Inspect">
      <Label>Inspect</Label>
    </ContextMenu.Item>
  </>
)

export { BookmarkContextMenuItems, BrowserContextMenuItems }
