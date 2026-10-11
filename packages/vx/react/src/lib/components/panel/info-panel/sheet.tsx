import { type ReactNode, useState } from 'react'

import { Maximize, Minimize } from '@vezham/icons-react'
import { Sheet } from '@vezham/react-pro-v3'
import { Button, Surface, Tooltip } from '@vezham/react-v3'

import {
  panelBodyClass,
  panelHeaderClass,
  panelHeadingClass,
  panelLayoutClass
} from './styles'
import type { InfoPanelDefinition } from './types'

export const InfoPanelSheet = ({
  panel,
  heading,
  isOpen = true,
  onClose
}: {
  panel: InfoPanelDefinition
  heading?: ReactNode
  isOpen?: boolean
  onClose: () => void
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Sheet
      isOpen={isOpen}
      onOpenChange={open => !open && onClose()}
      placement="bottom"
      isHandleOnly
      shouldAutoFocus>
      <Sheet.Backdrop
        variant="blur"
        className="bg-overlay/10 z-80 backdrop-blur-xs">
        <Sheet.Content
          className={`mx-auto w-full ${expanded ? 'h-dvh max-h-none max-w-none' : 'h-[75dvh] max-h-[75dvh] max-w-2xl'}`}>
          <Sheet.Dialog
            className={`${panelLayoutClass} max-h-none ${expanded ? 'rounded-none pt-[env(safe-area-inset-top)]' : 'rounded-t-[1.75rem]'}`}>
            <Surface variant="transparent" className={panelLayoutClass}>
              {!expanded && <Sheet.Handle />}
              <Sheet.Header className={panelHeaderClass}>
                <Sheet.Heading
                  className={`${panelHeadingClass} flex flex-1 items-center gap-2`}>
                  {panel.titleIcon}
                  <span className="truncate">{heading ?? panel.title}</span>
                </Sheet.Heading>
                <Tooltip>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-label={`${expanded ? 'Collapse' : 'Expand'} ${panel.title}`}
                    onPress={() => setExpanded(current => !current)}>
                    {expanded ? (
                      <Minimize size={18} aria-hidden="true" />
                    ) : (
                      <Maximize size={18} aria-hidden="true" />
                    )}
                  </Button>
                  <Tooltip.Content>
                    {expanded ? 'Collapse' : 'Expand'}
                  </Tooltip.Content>
                </Tooltip>
                <Sheet.CloseTrigger
                  aria-label={`Close ${panel.title}`}
                  className="static shrink-0"
                />
              </Sheet.Header>
              <Sheet.Body
                className={`${panelBodyClass} @container/info-panel pb-[max(1rem,env(safe-area-inset-bottom))] ${panel.scrollable === false ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain'}`}>
                {panel.content}
              </Sheet.Body>
            </Surface>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  )
}
