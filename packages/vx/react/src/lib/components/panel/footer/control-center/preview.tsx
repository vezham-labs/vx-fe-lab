import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'

import {
  Airbuds,
  Bluetooth,
  Copy,
  Moon,
  MusicNote,
  Pause,
  Play,
  SkipNext,
  SkipPrevious,
  Sun,
  VolumeCross,
  VolumeLoud,
  WiFi,
  Widget2
} from '@vezham/icons-react'
import { Button, Label, Slider, Switch } from '@vezham/react-v3'

import { Options } from './options'
import { ActionTile } from './tile'
import type { Option } from './types'
import { controlCenterVariants } from './variant'

type PreviewState = {
  wifi: boolean
  network: string
  bluetooth: boolean
  device: string
  airdrop: string
  focus: boolean
  stageManager: boolean
  mirror: string
  brightness: number
  volume: number
  muted: boolean
  playing: boolean
  started: boolean
  track: number
}
const initialState: PreviewState = {
  wifi: true,
  network: 'office',
  bluetooth: true,
  device: 'headphones',
  airdrop: 'contacts',
  focus: false,
  stageManager: false,
  mirror: 'off',
  brightness: 50,
  volume: 75,
  muted: false,
  playing: false,
  started: false,
  track: 0
}
const PreviewContext = createContext<{
  state: PreviewState
  update: (values: Partial<PreviewState>) => void
} | null>(null)

export const PreviewProvider = ({
  enabled,
  children
}: {
  enabled: boolean
  children: ReactNode
}) => {
  const [state, setState] = useState(initialState)
  const update = useCallback(
    (values: Partial<PreviewState>) =>
      setState(previous => ({ ...previous, ...values })),
    []
  )
  const value = useMemo(
    () => (enabled ? { state, update } : null),
    [enabled, state, update]
  )
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  )
}

const usePreview = () => {
  const preview = useContext(PreviewContext)
  if (!preview)
    throw new Error('Preview tiles require ControlCenter preview mode')
  return preview
}
const styles = controlCenterVariants()
type Props = { label?: string; onOpen: () => void }
const networks = [
  { value: 'office', label: 'Office Wi-Fi' },
  { value: 'iphone', label: 'iPhone' },
  { value: 'home', label: 'Home' }
]
const devices = [
  { value: 'headphones', label: 'Headphones' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' }
]
const airdropOptions = [
  { value: 'off', label: 'Off' },
  { value: 'contacts', label: 'Contacts Only' },
  { value: 'everyone', label: 'Everyone' }
]
const mirrorOptions = [
  { value: 'off', label: 'Off' },
  { value: 'studio', label: 'Studio Display' },
  { value: 'tv', label: 'Living Room TV' }
]

const PreviewToggle = ({
  label,
  value,
  onChange
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) => (
  <Switch aria-label={label} isSelected={value} onChange={onChange}>
    <Switch.Content className={styles.previewToggle()}>
      <span>{label}</span>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Content>
  </Switch>
)

const ConnectionSettings = ({
  label,
  enabled,
  value,
  options,
  onEnabledChange,
  onChange
}: {
  label: string
  enabled: boolean
  value: string
  options: readonly Option[]
  onEnabledChange: (enabled: boolean) => void
  onChange: (value: string) => void
}) => (
  <div className={styles.previewSettings()}>
    <PreviewToggle label={label} value={enabled} onChange={onEnabledChange} />
    {enabled ? (
      <Options value={value} options={options} onChange={onChange} />
    ) : (
      <p className={styles.previewHint()}>
        Turn on {label} to see preview connections.
      </p>
    )}
  </div>
)

export const PreviewWiFiTile = ({ onOpen, label = 'Wi-Fi' }: Props) => {
  const { state } = usePreview()
  return (
    <ActionTile
      label={label}
      description={
        state.wifi
          ? networks.find(option => option.value === state.network)?.label
          : 'Off'
      }
      icon={
        <WiFi
          size={18}
          className={styles.connectionIcon({ active: state.wifi })}
        />
      }
      onPress={onOpen}
    />
  )
}
export const PreviewWiFiSettings = () => {
  const { state, update } = usePreview()
  return (
    <ConnectionSettings
      label="Wi-Fi"
      enabled={state.wifi}
      value={state.network}
      options={networks}
      onEnabledChange={wifi => update({ wifi })}
      onChange={network => update({ network })}
    />
  )
}

export const PreviewBluetoothTile = ({
  onOpen,
  label = 'Bluetooth'
}: Props) => {
  const { state } = usePreview()
  return (
    <ActionTile
      label={label}
      description={
        state.bluetooth
          ? devices.find(option => option.value === state.device)?.label
          : 'Off'
      }
      icon={
        <Bluetooth
          size={18}
          className={styles.connectionIcon({ active: state.bluetooth })}
        />
      }
      onPress={onOpen}
    />
  )
}
export const PreviewBluetoothSettings = () => {
  const { state, update } = usePreview()
  return (
    <ConnectionSettings
      label="Bluetooth"
      enabled={state.bluetooth}
      value={state.device}
      options={devices}
      onEnabledChange={bluetooth => update({ bluetooth })}
      onChange={device => update({ device })}
    />
  )
}

export const PreviewAirDropTile = ({ onOpen, label = 'AirDrop' }: Props) => {
  const { state } = usePreview()
  return (
    <ActionTile
      label={label}
      description={
        airdropOptions.find(option => option.value === state.airdrop)?.label
      }
      icon={
        <Airbuds
          size={18}
          className={styles.connectionIcon({ active: state.airdrop !== 'off' })}
        />
      }
      onPress={onOpen}
    />
  )
}
export const PreviewAirDropSettings = () => {
  const { state, update } = usePreview()
  return (
    <Options
      value={state.airdrop}
      options={airdropOptions}
      onChange={airdrop => update({ airdrop })}
    />
  )
}

export const PreviewFocusTile = ({
  label = 'Do Not Disturb'
}: {
  label?: string
}) => {
  const { state, update } = usePreview()
  return (
    <ActionTile
      label={label}
      description={state.focus ? 'On' : 'Off'}
      icon={<Moon size={18} />}
      isSelected={state.focus}
      onPress={() => update({ focus: !state.focus })}
    />
  )
}

export const PreviewStageManagerTile = ({
  label = 'Stage Manager'
}: {
  label?: string
}) => {
  const { state, update } = usePreview()
  return (
    <ActionTile
      label={label}
      description={state.stageManager ? 'On' : 'Off'}
      icon={<Widget2 size={18} />}
      isSelected={state.stageManager}
      onPress={() => update({ stageManager: !state.stageManager })}
    />
  )
}

export const PreviewMirroringTile = ({
  onOpen,
  label = 'Screen Mirroring'
}: Props) => {
  const { state } = usePreview()
  return (
    <ActionTile
      label={label}
      description={
        mirrorOptions.find(option => option.value === state.mirror)?.label
      }
      icon={
        <Copy
          size={18}
          className={styles.connectionIcon({ active: state.mirror !== 'off' })}
        />
      }
      onPress={onOpen}
    />
  )
}
export const PreviewMirroringSettings = () => {
  const { state, update } = usePreview()
  return (
    <Options
      value={state.mirror}
      options={mirrorOptions}
      onChange={mirror => update({ mirror })}
    />
  )
}

const PreviewSlider = ({
  label,
  value,
  onChange,
  disabled = false
}: {
  label: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}) => (
  <Slider
    aria-label={label}
    value={value}
    minValue={0}
    maxValue={100}
    isDisabled={disabled}
    onChange={next => {
      if (typeof next === 'number') onChange(next)
    }}>
    <div className={styles.previewHeader()}>
      <Label className={styles.previewHint()}>{label}</Label>
      <Slider.Output className={styles.previewHint()}>{value}%</Slider.Output>
    </div>
    <Slider.Track>
      <Slider.Fill />
      <Slider.Thumb />
    </Slider.Track>
  </Slider>
)

export const PreviewDisplayTile = ({
  label = 'Display'
}: {
  label?: string
}) => {
  const { state, update } = usePreview()
  return (
    <section aria-label={label} className={styles.previewTile()}>
      <div className={styles.previewHeader()}>
        <Sun size={18} />
        <span className={styles.previewTitle()}>{label}</span>
      </div>
      <PreviewSlider
        label="Brightness"
        value={state.brightness}
        onChange={brightness => update({ brightness })}
      />
    </section>
  )
}

export const PreviewSoundTile = ({ label = 'Sound' }: { label?: string }) => {
  const { state, update } = usePreview()
  const Icon = state.muted ? VolumeCross : VolumeLoud
  return (
    <section aria-label={label} className={styles.previewTile()}>
      <div className={styles.previewHeader()}>
        <Icon size={18} />
        <span className={styles.previewTitle()}>{label}</span>
        <Button
          aria-label={state.muted ? 'Unmute sound' : 'Mute sound'}
          aria-pressed={state.muted}
          size="sm"
          variant="ghost"
          onPress={() => update({ muted: !state.muted })}>
          {state.muted ? 'Unmute' : 'Mute'}
        </Button>
      </div>
      <PreviewSlider
        label="Volume"
        value={state.volume}
        disabled={state.muted}
        onChange={volume => update({ volume })}
      />
    </section>
  )
}

const tracks = ['Morning Light', 'Quiet Hours', 'Afterglow']
export const PreviewMediaTile = ({ label = 'Media' }: { label?: string }) => {
  const { state, update } = usePreview()
  const Icon = state.playing ? Pause : Play
  const skip = (offset: number) =>
    update({
      track: (state.track + offset + tracks.length) % tracks.length,
      started: true
    })
  return (
    <section aria-label={label} className={styles.previewTile()}>
      <div className={styles.previewHeader()}>
        <MusicNote size={18} />
        <div>
          <p className={styles.previewTitle()}>
            {state.started ? tracks[state.track] : 'Not Playing'}
          </p>
          <p className={styles.previewHint()}>Demo playlist</p>
        </div>
      </div>
      <div className={styles.mediaControls()}>
        <Button
          aria-label="Previous track"
          isIconOnly
          variant="ghost"
          onPress={() => skip(-1)}>
          <SkipPrevious size={18} />
        </Button>
        <Button
          aria-label={state.playing ? 'Pause media' : 'Play media'}
          isIconOnly
          variant="ghost"
          onPress={() => update({ playing: !state.playing, started: true })}>
          <Icon size={24} />
        </Button>
        <Button
          aria-label="Next track"
          isIconOnly
          variant="ghost"
          onPress={() => skip(1)}>
          <SkipNext size={18} />
        </Button>
      </div>
    </section>
  )
}
