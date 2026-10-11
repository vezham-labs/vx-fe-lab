import React from 'react'

import { EmojiPicker } from '@vezham/react-pro-v3'
import {
  Button,
  Input,
  Label,
  Modal,
  Popover,
  Separator,
  Tabs,
  useOverlayState
} from '@vezham/react-v3'

import { AppIcon } from '../../../../app-icon'
import {
  type FolderModalProps,
  type FolderVisualPreviewProps,
  type FolderVisualType
} from './types'
import { emojiOptions, folderColors, folderIconOptions } from './variants'

const FolderVisualPreview = ({
  color,
  visualType,
  emoji,
  icon,
  className = ''
}: FolderVisualPreviewProps) => (
  <span
    className={`flex shrink-0 items-center justify-center rounded-full text-white shadow-sm ${className}`}
    style={{ backgroundColor: color }}>
    {visualType === 'emoji' ? (
      <span className="text-[1em] leading-none">{emoji}</span>
    ) : (
      <AppIcon icon={icon} size="1em" aria-hidden="true" />
    )}
  </span>
)

const FolderModal = ({
  open,
  mode,
  form,
  onFormChange,
  onOpenChange,
  onSave
}: FolderModalProps) => {
  const state = useOverlayState({
    isOpen: open,
    onOpenChange
  })
  const canSave = form.name.trim().length > 0
  const selectedVisualKey = form.visualType

  const updateForm = (nextForm: Partial<typeof form>) => {
    onFormChange({
      ...form,
      ...nextForm
    })
  }
  const renderEmojiItem = (item: (typeof emojiOptions)[number]) => (
    <EmojiPicker.Item id={item.id} textValue={item.label}>
      {item.emoji}
    </EmojiPicker.Item>
  )

  return (
    <Modal state={state}>
      <Modal.Trigger className="hidden" />
      <Modal.Backdrop
        variant="blur"
        className="fixed inset-0 z-[120] bg-black/35">
        <Modal.Container placement="center">
          <Modal.Dialog className="w-[min(620px,calc(100vw-32px))] overflow-hidden rounded-[28px] border border-black/10 bg-white p-0 shadow-[0_24px_90px_rgba(15,23,42,0.28)]">
            <Modal.Header className="px-8 pt-8 pb-4">
              <Modal.Heading className="text-center text-xl font-semibold text-black">
                {mode === 'create' ? 'New Folder' : 'Edit Folder'}
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="space-y-6 px-8 pb-6">
              <div className="flex items-center gap-4">
                <Label className="w-16 shrink-0 text-base font-medium text-black">
                  Name:
                </Label>
                <Input
                  value={form.name}
                  className="border-default-200 focus:border-primary focus:ring-primary/25 h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:ring-4"
                  onChange={event => updateForm({ name: event.target.value })}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
                <div className="flex gap-4">
                  <Label className="w-16 shrink-0 pt-1 text-base font-medium text-black">
                    Color:
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {folderColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Use ${color} folder color`}
                        className="ring-primary/70 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 shadow-sm transition-transform outline-none hover:scale-105 focus-visible:ring-2"
                        style={{ backgroundColor: color }}
                        onClick={() => updateForm({ color })}>
                        {form.color === color && (
                          <span className="h-2.5 w-2.5 rounded-full bg-white shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block" />

                <div className="flex gap-4">
                  <Label className="w-14 shrink-0 pt-1 text-base font-medium text-black">
                    Icon:
                  </Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <EmojiPicker
                        selectedKey={
                          form.visualType === 'emoji' ? form.emoji : undefined
                        }
                        onSelectionChange={(key: React.Key | null) => {
                          if (!key) return
                          updateForm({
                            visualType: 'emoji',
                            emoji: String(key)
                          })
                        }}>
                        <EmojiPicker.Trigger
                          aria-label="Choose emoji"
                          className="rounded-full">
                          <FolderVisualPreview
                            color={
                              form.visualType === 'emoji'
                                ? form.color
                                : '#d6e8ff'
                            }
                            visualType="emoji"
                            emoji={form.emoji}
                            icon={form.icon}
                            className="h-14 w-14 text-2xl"
                          />
                        </EmojiPicker.Trigger>
                        <EmojiPicker.Popover placement="right">
                          <EmojiPicker.Content>
                            <EmojiPicker.Grid items={emojiOptions}>
                              {renderEmojiItem as unknown as React.ReactNode}
                            </EmojiPicker.Grid>
                          </EmojiPicker.Content>
                        </EmojiPicker.Popover>
                      </EmojiPicker>

                      <Popover>
                        <Popover.Trigger>
                          <button
                            type="button"
                            aria-label="Choose icon"
                            className="focus-visible:ring-primary rounded-full outline-none focus-visible:ring-2">
                            <FolderVisualPreview
                              color={
                                form.visualType === 'icon'
                                  ? form.color
                                  : '#e4e4e7'
                              }
                              visualType="icon"
                              emoji={form.emoji}
                              icon={form.icon}
                              className="h-14 w-14 text-2xl"
                            />
                          </button>
                        </Popover.Trigger>
                        <Popover.Content
                          placement="right"
                          className="w-[280px] rounded-3xl p-4">
                          <Popover.Dialog className="grid grid-cols-6 gap-3">
                            {folderIconOptions.map(icon => (
                              <button
                                key={icon}
                                type="button"
                                aria-label={`Use ${icon} icon`}
                                className="bg-default-200 text-default-700 ring-primary hover:bg-default-300 flex h-10 w-10 items-center justify-center rounded-full transition outline-none focus-visible:ring-2"
                                data-selected={
                                  form.visualType === 'icon' &&
                                  form.icon === icon
                                    ? 'true'
                                    : undefined
                                }
                                onClick={() =>
                                  updateForm({ visualType: 'icon', icon })
                                }>
                                <AppIcon
                                  icon={icon}
                                  size={22}
                                  aria-hidden="true"
                                />
                              </button>
                            ))}
                          </Popover.Dialog>
                        </Popover.Content>
                      </Popover>
                    </div>

                    <Tabs
                      selectedKey={selectedVisualKey}
                      onSelectionChange={key =>
                        updateForm({
                          visualType: String(key) as FolderVisualType
                        })
                      }>
                      <Tabs.ListContainer>
                        <Tabs.List
                          aria-label="Folder visual type"
                          className="*:h-8 *:px-4">
                          <Tabs.Tab id="emoji">
                            Emoji
                            <Tabs.Indicator />
                          </Tabs.Tab>
                          <Tabs.Tab id="icon">
                            <Tabs.Separator />
                            Icon
                            <Tabs.Indicator />
                          </Tabs.Tab>
                        </Tabs.List>
                      </Tabs.ListContainer>
                    </Tabs>
                  </div>
                </div>
              </div>

              <div className="border-default-200 flex items-center gap-3 border-t pt-5">
                <FolderVisualPreview
                  color={form.color}
                  visualType={form.visualType}
                  emoji={form.emoji}
                  icon={form.icon}
                  className="h-10 w-10 text-xl"
                />
                <span className="min-w-0 flex-1 truncate text-base font-medium text-black">
                  {form.name.trim() || 'Untitled Folder'}
                </span>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-default-200 flex justify-end gap-3 border-t px-8 py-5">
              <Button
                variant="secondary"
                className="min-w-24 rounded-xl"
                onPress={state.close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="min-w-24 rounded-xl"
                isDisabled={!canSave}
                onPress={onSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export { FolderVisualPreview }
export { FolderModal }
