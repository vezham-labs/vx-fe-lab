import { useCallback, useContext, useMemo } from 'react'

import {
  type ToolbarActionEvent,
  ToolbarActionsContext
} from '../../../toolbar-actions'
import {
  AppearanceSettings,
  AppearanceTile,
  AppearanceToggle
} from './appearance'
import { ControlCenter } from './control-center'
import { DirectionSettings, DirectionTile, DirectionToggle } from './direction'
import {
  DocumentLanguageSettings,
  DocumentLanguageTile,
  LanguageSettings,
  LanguageTile
} from './language'
import {
  PreviewAirDropSettings,
  PreviewAirDropTile,
  PreviewBluetoothSettings,
  PreviewBluetoothTile,
  PreviewDisplayTile,
  PreviewFocusTile,
  PreviewMediaTile,
  PreviewMirroringSettings,
  PreviewMirroringTile,
  PreviewSoundTile,
  PreviewStageManagerTile,
  PreviewWiFiSettings,
  PreviewWiFiTile
} from './preview'
import { ThemeSettings, ThemeTile } from './theme'
import type {
  BuiltinTileType,
  ControlCenterConfig,
  ControlCenterContext,
  ControlCenterProps,
  TileDefinition,
  TileRegistration
} from './types'

const ConfiguredLanguageTile = ({
  onOpen,
  label,
  language,
  i18n
}: ControlCenterContext & { label?: string; onOpen: () => void }) =>
  language ? (
    <LanguageTile language={language} label={label} onOpen={onOpen} />
  ) : (
    <DocumentLanguageTile i18n={i18n} label={label} onOpen={onOpen} />
  )
const ConfiguredLanguageSettings = ({
  language,
  i18n
}: ControlCenterContext) =>
  language ? (
    <LanguageSettings language={language} />
  ) : (
    <DocumentLanguageSettings i18n={i18n} />
  )

const builtins: Record<BuiltinTileType, TileRegistration<object>> = {
  'direction-toggle': { Tile: DirectionToggle, label: 'Direction' },
  'appearance-toggle': { Tile: AppearanceToggle, label: 'Appearance' },
  appearance: {
    Tile: AppearanceTile,
    Panel: AppearanceSettings,
    label: 'Appearance'
  },
  theme: { Tile: ThemeTile, Panel: ThemeSettings, label: 'Theme' },
  direction: {
    Tile: DirectionTile,
    Panel: DirectionSettings,
    label: 'Direction'
  },
  language: {
    Tile: ConfiguredLanguageTile,
    Panel: ConfiguredLanguageSettings,
    label: 'Language'
  },
  'preview-wifi': {
    Tile: PreviewWiFiTile,
    Panel: PreviewWiFiSettings,
    label: 'Wi-Fi'
  },
  'preview-bluetooth': {
    Tile: PreviewBluetoothTile,
    Panel: PreviewBluetoothSettings,
    label: 'Bluetooth'
  },
  'preview-airdrop': {
    Tile: PreviewAirDropTile,
    Panel: PreviewAirDropSettings,
    label: 'AirDrop'
  },
  'preview-focus': { Tile: PreviewFocusTile, label: 'Do Not Disturb' },
  'preview-stage-manager': {
    Tile: PreviewStageManagerTile,
    label: 'Stage Manager'
  },
  'preview-mirroring': {
    Tile: PreviewMirroringTile,
    Panel: PreviewMirroringSettings,
    label: 'Screen Mirroring'
  },
  'preview-media': { Tile: PreviewMediaTile, label: 'Media' },
  'preview-display': { Tile: PreviewDisplayTile, label: 'Display' },
  'preview-sound': { Tile: PreviewSoundTile, label: 'Sound' }
}

export type ControlCenterActionEvent = ToolbarActionEvent & { tileId: string }
export type ConfiguredControlCenterProps<Context extends object> = Omit<
  ControlCenterProps<Context & ControlCenterContext>,
  'tiles' | 'editControls'
> & {
  config: ControlCenterConfig
  registrations?: Readonly<
    Record<string, TileRegistration<Context & ControlCenterContext>>
  >
  onAction?: (event: ControlCenterActionEvent) => void
}

export const resolveTiles = <Context extends object>(
  config: ControlCenterConfig,
  onAction: (tileId: string, actionKey: string) => void,
  registrations: Readonly<Record<string, TileRegistration<Context>>> = {}
): readonly TileDefinition<Context>[] =>
  config.tiles.map(tile => {
    const { id, span, label, description, editable } = tile
    const registration =
      tile.type === 'custom' ? registrations[id] : builtins[tile.type]
    const base = {
      id,
      span,
      label: label ?? registration?.label ?? id,
      editable: editable ?? true
    }
    const emit = () => {
      if (tile.type === 'custom') onAction(id, tile.action)
    }
    if (!registration) {
      if (tile.type !== 'custom')
        throw new Error(`Unknown control center tile type: ${tile.type}`)
      return { ...base, label: label ?? id, description, onAction: emit }
    }
    const { Tile, Panel } = registration
    if (Panel) {
      return {
        ...base,
        title: base.label,
        Panel: (props: Context) => <Panel {...props} />,
        Tile: (props: Context & { onOpen: () => void }) => (
          <Tile {...props} label={base.label} onAction={emit} />
        )
      }
    }
    return {
      ...base,
      Tile: (props: Context) => (
        <Tile
          {...props}
          label={
            tile.type === 'appearance-toggle' ||
            tile.type === 'direction-toggle'
              ? label
              : base.label
          }
          onOpen={emit}
          onAction={emit}
        />
      )
    }
  })

export const ConfiguredControlCenter = <Context extends object>({
  config,
  registrations,
  onAction,
  ...props
}: ConfiguredControlCenterProps<Context>) => {
  const actions = useContext(ToolbarActionsContext)
  const emit = useCallback(
    (tileId: string, actionKey: string) => {
      const event = {
        tileId,
        actionKey,
        pageKey: 'control-center',
        pathname: window.location.pathname
      }
      if (onAction) onAction(event)
      else if (!actions?.emit(event))
        throw new Error(`Unhandled control center action: ${actionKey}`)
    },
    [actions, onAction]
  )
  const tiles = useMemo(
    () =>
      resolveTiles<Context & ControlCenterContext>(config, emit, registrations),
    [config, emit, registrations]
  )
  return (
    <ControlCenter
      {...props}
      tiles={tiles}
      editControls={config.editControls}
    />
  )
}
