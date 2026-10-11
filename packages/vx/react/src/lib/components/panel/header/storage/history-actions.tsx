import type { ComponentProps } from 'react'

import { Button } from '@vezham/react-v3'

import { AppIcon } from '../../../app-icon'

type Action = {
  type: string
  icon: string
  label: string
  props: ComponentProps<typeof Button>
  onPress: () => void
}

export const StorageHistoryActions = ({
  visible,
  actions,
  barProps
}: {
  visible: boolean
  actions: readonly Action[]
  barProps: ComponentProps<'div'>
}) =>
  visible && actions.length > 0 ? (
    <div {...barProps}>
      {actions.map(action => (
        <Button key={action.type} {...action.props} onPress={action.onPress}>
          <AppIcon icon={action.icon} size={16} aria-hidden="true" />
          {action.label}
        </Button>
      ))}
    </div>
  ) : null
