import { AppearanceSettings, AppearanceTile } from './appearance'
import { ControlCenter } from './control-center'
import { DirectionSettings, DirectionTile } from './direction'
import { ThemeSettings, ThemeTile } from './theme'
import type { ControlCenterProps, TileDefinition } from './types'

const tiles: readonly TileDefinition[] = [
  {
    id: 'appearance',
    span: 'full',
    Tile: AppearanceTile,
    title: 'Appearance',
    Panel: AppearanceSettings
  },
  {
    id: 'theme',
    span: 'full',
    Tile: ThemeTile,
    title: 'Theme',
    Panel: ThemeSettings
  },
  {
    id: 'direction',
    span: 'full',
    Tile: DirectionTile,
    title: 'Direction',
    Panel: DirectionSettings
  }
]

export const DefaultControlCenter = (
  props: Pick<
    ControlCenterProps<object>,
    'placement' | 'appearance' | 'onOpenChange'
  >
) => <ControlCenter context={{}} tiles={tiles} editControls {...props} />
