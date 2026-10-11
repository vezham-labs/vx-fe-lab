import { VezhamTamizhi } from '@vezham/icons-react'

import type { InfoPanelDefinition } from '../../info-panel'
import { InfoPanelSheet } from '../../info-panel/sheet'
import { AIContent } from './content'
import { useMockConversation } from './conversation'

type Props = { isOpen: boolean; onClose: () => void }

const AISheet = ({ isOpen, onClose }: Props) =>
  isOpen ? <AISession onClose={onClose} /> : null

const AISession = ({ onClose }: Pick<Props, 'onClose'>) => {
  const conversation = useMockConversation()
  return (
    <InfoPanelSheet
      onClose={onClose}
      panel={{
        title: aiPanel.title,
        titleIcon: aiPanel.titleIcon,
        scrollable: false,
        content: <AIContent conversation={conversation} panel />
      }}
    />
  )
}

const AIPanelContent = () => {
  const conversation = useMockConversation()
  return <AIContent conversation={conversation} panel />
}

export const aiPanel: InfoPanelDefinition = {
  title: 'Tamizhi AI',
  titleIcon: (
    <VezhamTamizhi size={20} aria-hidden="true" className="shrink-0" />
  ),
  scrollable: false,
  content: <AIPanelContent />,
  renderCompact: props => <AISheet {...props} />
}
