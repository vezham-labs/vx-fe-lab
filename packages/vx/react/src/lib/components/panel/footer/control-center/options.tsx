import { Button } from '@vezham/react-v3'

import type { Option } from './types'
import { controlCenterVariants, optionTileVariants } from './variant'

const styles = controlCenterVariants()

export const Options = ({
  value,
  options,
  onChange
}: {
  value: string
  options: readonly Option[]
  onChange: (value: string) => void
}) => (
  <div className={styles.optionsList()}>
    {options.map(option =>
      option.href ? (
        <a
          key={option.value}
          href={option.href}
          aria-current={option.value === value ? 'true' : undefined}
          className={optionTileVariants({ selected: option.value === value })}
          onClick={event => {
            // vx-bot/NOTE: Preserve modified clicks and native link destinations.
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.altKey ||
              event.shiftKey
            )
              return
            event.preventDefault()
            onChange(option.value)
          }}>
          {option.label}
        </a>
      ) : (
        <Button
          key={option.value}
          aria-pressed={option.value === value}
          className={optionTileVariants({ selected: option.value === value })}
          variant="ghost"
          onPress={() => onChange(option.value)}>
          {option.label}
        </Button>
      )
    )}
  </div>
)
