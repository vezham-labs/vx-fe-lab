import { Palette } from '@vezham/icons-react'
import {
  Button,
  ColorSwatch,
  ColorSwatchPicker,
  parseColor
} from '@vezham/react-v3'

import { useRootAttribute } from './document'
import { ActionTile } from './tile'
import { controlCenterVariants, optionTileVariants } from './variant'

const colors = [
  { id: 'blue', label: 'Blue', color: '#0067d6', foreground: '#ffffff' },
  { id: 'purple', label: 'Purple', color: '#7d3fc8', foreground: '#ffffff' },
  { id: 'pink', label: 'Pink', color: '#d63384', foreground: '#ffffff' },
  { id: 'red', label: 'Red', color: '#c9373c', foreground: '#ffffff' },
  { id: 'orange', label: 'Orange', color: '#b85a00', foreground: '#ffffff' },
  { id: 'yellow', label: 'Yellow', color: '#f0bd27', foreground: '#111111' },
  { id: 'green', label: 'Green', color: '#24823d', foreground: '#ffffff' },
  { id: 'graphite', label: 'Graphite', color: '#62646a', foreground: '#ffffff' }
] as const

const properties = [
  '--accent',
  '--accent-foreground',
  '--heroui-primary',
  '--heroui-primary-foreground',
  '--heroui-focus'
] as const
const originalStyles = new WeakMap<
  HTMLElement,
  { value: string; priority: string }[]
>()
const styles = controlCenterVariants()

const hslChannels = (color: string) => {
  const hsl = parseColor(color).toFormat('hsl')
  return `${hsl.getChannelValue('hue')} ${hsl.getChannelValue('saturation')}% ${hsl.getChannelValue('lightness')}%`
}

const applyColor = (id: string) => {
  const root = document.documentElement
  const option = colors.find(color => color.id === id)
  if (option) {
    if (!originalStyles.has(root)) {
      originalStyles.set(
        root,
        properties.map(property => ({
          value: root.style.getPropertyValue(property),
          priority: root.style.getPropertyPriority(property)
        }))
      )
    }
    root.style.setProperty('--accent', option.color)
    root.style.setProperty('--accent-foreground', option.foreground)
    // vx-bot/NOTE: Existing primary utilities use the legacy theme's HSL tokens.
    root.style.setProperty('--heroui-primary', hslChannels(option.color))
    root.style.setProperty(
      '--heroui-primary-foreground',
      hslChannels(option.foreground)
    )
    root.style.setProperty('--heroui-focus', hslChannels(option.color))
  } else {
    const originals = originalStyles.get(root)
    originals?.forEach((original, index) => {
      root.style.setProperty(
        properties[index],
        original.value,
        original.priority
      )
    })
    originalStyles.delete(root)
  }
}

export const ThemeTile = ({
  onOpen,
  label = 'Theme'
}: {
  label?: string
  onOpen: () => void
}) => {
  const { value } = useRootAttribute('data-vx-theme-color', 'default')
  const option = colors.find(color => color.id === value)
  return (
    <ActionTile
      label={label}
      description={option?.label ?? 'Default'}
      icon={
        option ? (
          <ColorSwatch
            aria-label={option.label}
            color={option.color}
            size="xs"
          />
        ) : (
          <Palette size={18} />
        )
      }
      onPress={onOpen}
    />
  )
}

export const ThemeSettings = () => {
  const { value, onChange } = useRootAttribute('data-vx-theme-color', 'default')
  const selected = colors.find(color => color.id === value)
  const changeColor = (id: string) => {
    applyColor(id)
    onChange(id)
  }
  return (
    <div className={styles.colorSettings()}>
      <span className={styles.colorLabel()}>Accent color</span>
      <ColorSwatchPicker
        aria-label="Accent color"
        className={styles.colorPicker()}
        size="xl"
        value={selected?.color ?? '#00000000'}
        onChange={color => {
          const option = colors.find(
            option => option.color === color.toString('hex').toLowerCase()
          )
          if (option) changeColor(option.id)
        }}>
        {colors.map(option => (
          <ColorSwatchPicker.Item
            key={option.id}
            color={option.color}
            aria-label={option.label}
            className={styles.colorOption()}>
            <ColorSwatchPicker.Swatch colorName={option.label} />
            <ColorSwatchPicker.Indicator />
          </ColorSwatchPicker.Item>
        ))}
      </ColorSwatchPicker>
      <span className={styles.colorLabel()}>
        {selected?.label ?? 'Default'}
      </span>
      <Button
        variant="ghost"
        aria-pressed={!selected}
        className={optionTileVariants({ selected: !selected })}
        onPress={() => changeColor('default')}>
        Default
      </Button>
    </div>
  )
}
