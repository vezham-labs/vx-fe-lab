import { FolderOpen, VezhamLogo } from '@vezham/icons-react'
import { ContextMenu, EmptyState } from '@vezham/react-pro-v3'
import { Button, Kbd, Label, Separator } from '@vezham/react-v3'

export const PageEmptyState = () => {
  return (
    <div className="w-105">
      <EmptyState>
        <EmptyState.Header>
          <div className="flex flex-row gap-2">
            <EmptyState.Media variant="default">
              <VezhamLogo size={32} />
            </EmptyState.Media>
            <EmptyState.Media variant="icon">
              <FolderOpen size={20} weight="duotone-filled" />
            </EmptyState.Media>
          </div>
          <EmptyState.Title>No Projects Yet</EmptyState.Title>
          <EmptyState.Description>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyState.Description>
        </EmptyState.Header>
        <EmptyState.Content className="flex-row gap-2">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </EmptyState.Content>
      </EmptyState>
      <Separator />
      <ContextMenu>
        <ContextMenu.Trigger>
          <div className="border-border text-muted flex h-48 w-80 items-center justify-center rounded-xl border border-dashed text-sm select-none">
            Right-click here | ... @vezham/react-v3
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Popover>
          <ContextMenu.Menu>
            <ContextMenu.Item id="back" textValue="Back">
              <Label>Back</Label>
              <Kbd className="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>[</Kbd.Content>
              </Kbd>
            </ContextMenu.Item>
            <ContextMenu.Item isDisabled id="forward" textValue="Forward">
              <Label>Forward</Label>
              <Kbd className="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>]</Kbd.Content>
              </Kbd>
            </ContextMenu.Item>
            <ContextMenu.Item id="reload" textValue="Reload">
              <Label>Reload</Label>
              <Kbd className="ms-auto" slot="keyboard" variant="light">
                <Kbd.Abbr keyValue="command" />
                <Kbd.Content>R</Kbd.Content>
              </Kbd>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item id="view-source" textValue="View Page Source">
              <Label>View Page Source</Label>
            </ContextMenu.Item>
            <ContextMenu.Item id="inspect" textValue="Inspect">
              <Label>Inspect</Label>
            </ContextMenu.Item>
          </ContextMenu.Menu>
        </ContextMenu.Popover>
      </ContextMenu>
    </div>
  )
}
