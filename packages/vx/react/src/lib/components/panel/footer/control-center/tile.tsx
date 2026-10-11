import type { ReactNode } from 'react'

import { Button } from '@vezham/react-v3'

import { controlCenterTileVariants } from './variant'

const styles = controlCenterTileVariants()

export const ActionTile = ({
  label,
  description,
  icon,
  compact = false,
  isSelected,
  onPress
}: {
  label: string
  description?: string
  icon?: ReactNode
  compact?: boolean
  isSelected?: boolean
  onPress: () => void
}) => (
  <Button
    aria-label={label}
    aria-pressed={isSelected}
    className={styles.button({ compact, selected: isSelected })}
    isIconOnly={compact}
    variant="ghost"
    onPress={onPress}>
    {compact ? (
      (icon ?? label)
    ) : (
      <span className={styles.content()}>
        {icon && (
          <span className={styles.icon({ selected: isSelected })}>{icon}</span>
        )}
        <span className={styles.text()}>
          <span className={styles.title()}>{label}</span>
          {description && (
            <span className={styles.description()}>{description}</span>
          )}
        </span>
      </span>
    )}
  </Button>
)
