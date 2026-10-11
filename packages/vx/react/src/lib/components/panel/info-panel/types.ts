import { ReactNode } from 'react'

export type ActiveInfoPanel = 'bookmarks' | 'storage' | 'ai' | null

export interface InfoPanelContextValue {
  activeInfoPanel: ActiveInfoPanel
  isOpen: boolean
  setActiveInfoPanel: (panel: ActiveInfoPanel) => void
  openInfoPanel: (panel: Exclude<ActiveInfoPanel, null>) => void
  closeInfoPanel: () => void
  toggleInfoPanel: (panel: Exclude<ActiveInfoPanel, null>) => void
}

export interface InfoPanelDefinition {
  title: string
  titleIcon?: ReactNode
  content: ReactNode
  scrollable?: boolean
  renderCompact?: (props: { isOpen: boolean; onClose: () => void }) => ReactNode
}
