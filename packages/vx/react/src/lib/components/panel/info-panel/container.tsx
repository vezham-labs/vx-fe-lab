import { type ReactNode, useState } from 'react'

import {
  CloseButton,
  ScrollShadow,
  Surface,
  Typography,
  useMediaQuery
} from '@vezham/react-v3'

import { ACCOUNT_BUBBLE_MEDIA_QUERY } from '../responsive'
import styles from './container.module.css'
import { useInfoPanel } from './provider'
import { InfoPanelSheet } from './sheet'
import {
  panelBodyClass,
  panelHeaderClass,
  panelHeadingClass,
  panelLayoutClass
} from './styles'
import { ActiveInfoPanel, InfoPanelDefinition } from './types'

const INFO_PANEL_WIDTH = 328

const InfoPanelContainer = ({
  panels,
  className,
  width = INFO_PANEL_WIDTH
}: {
  panels: Record<Exclude<ActiveInfoPanel, null>, InfoPanelDefinition>
  className?: string
  width?: number
}) => {
  const { activeInfoPanel, closeInfoPanel, isOpen } = useInfoPanel()
  const activePanel = activeInfoPanel ? panels[activeInfoPanel] : null
  const compact = useMediaQuery(ACCOUNT_BUBBLE_MEDIA_QUERY, {
    initializeWithValue: false
  })
  const panel = isOpen && activeInfoPanel ? panels[activeInfoPanel] : null

  if (compact && activePanel) {
    if (activePanel.renderCompact) {
      return activePanel.renderCompact({ isOpen, onClose: closeInfoPanel })
    }
    return panel ? (
      <InfoPanelSheet
        key={activeInfoPanel}
        panel={panel}
        onClose={closeInfoPanel}
      />
    ) : null
  }

  return (
    <DesktopInfoPanel
      panel={activePanel}
      panelKey={activeInfoPanel}
      isOpen={isOpen}
      width={width}
      className={className}
      onClose={closeInfoPanel}
    />
  )
}

const DesktopInfoPanel = ({
  panel: activePanel,
  panelKey,
  isOpen,
  width,
  className,
  onClose
}: {
  panel: InfoPanelDefinition | null
  panelKey: ActiveInfoPanel
  isOpen: boolean
  width: number
  className?: string
  onClose: () => void
}) => {
  const [present, setPresent] = useState(isOpen)
  if (isOpen && !present) setPresent(true)
  return (
    <aside
      aria-hidden={!isOpen}
      className={`sticky top-0 z-40 shrink-0 overflow-hidden ${className ?? ''}`}
      style={{ width: present && activePanel ? width : 0 }}>
      {present && activePanel && (
        <div
          key={panelKey}
          className={styles.panel}
          data-state={isOpen ? 'open' : 'closed'}
          inert={!isOpen}
          onAnimationEnd={event => {
            if (event.target === event.currentTarget && !isOpen)
              setPresent(false)
          }}
          style={{ width }}>
          <Surface
            variant="transparent"
            data-vx="info-panel"
            className={`${panelLayoutClass} border-border border-r`}>
            <InfoPanelHeader
              title={activePanel.title}
              titleIcon={activePanel.titleIcon}
              onClose={onClose}
            />
            <InfoPanelContent scrollable={activePanel.scrollable ?? true}>
              {activePanel.content}
            </InfoPanelContent>
          </Surface>
        </div>
      )}
    </aside>
  )
}

const InfoPanelHeader = ({
  title,
  titleIcon,
  onClose
}: {
  title: string
  titleIcon?: ReactNode
  onClose?: () => void
}) => {
  return (
    <div className={panelHeaderClass}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {titleIcon}
        <Typography.Heading className={panelHeadingClass}>
          {title}
        </Typography.Heading>
      </div>

      <CloseButton onPress={onClose} />
    </div>
  )
}

const InfoPanelContent = ({
  children,
  scrollable
}: {
  children: ReactNode
  scrollable: boolean
}) => {
  if (!scrollable)
    return <div className={`${panelBodyClass} overflow-hidden`}>{children}</div>
  return (
    <ScrollShadow className={panelBodyClass} hideScrollBar>
      {children}
    </ScrollShadow>
  )
}

export { InfoPanelContainer }
