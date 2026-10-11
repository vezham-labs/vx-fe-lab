import { useState, useSyncExternalStore } from 'react'

import {
  Button,
  Input,
  Label,
  ListBox,
  Select,
  Surface,
  Switch,
  TextField
} from '@vezham/react-v3'

import {
  AppearanceProvider,
  useAppearance
} from '../../components/panel/footer/control-center/appearance'
import { useRootAttribute } from '../../components/panel/footer/control-center/document'
import type { ThemeMode } from '../../components/panel/footer/control-center/types'
import { useUser } from '../../store/users/useUserStore'
import type { SettingsSection } from './navigation'

const subscribeNotifications = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  window.addEventListener('vx:notification-settings', onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener('vx:notification-settings', onChange)
  }
}
const readNotifications = () =>
  localStorage.getItem('demo:notification-settings') ?? ''
const serverNotifications = () => ''
const useSettingsPreferences = () => {
  const { user, updateUser } = useUser()
  const { value: language, onChange: setLanguage } = useRootAttribute(
    'lang',
    'en'
  )
  const { themeMode: mode, setThemeMode: setMode } = useAppearance()
  const [name, setName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)
  const snapshot = useSyncExternalStore(
    subscribeNotifications,
    readNotifications,
    serverNotifications
  )
  let notifications = { sounds: true, badges: true }
  try {
    const value = JSON.parse(snapshot || 'null')
    if (
      value &&
      typeof value.sounds === 'boolean' &&
      typeof value.badges === 'boolean'
    )
      notifications = { sounds: value.sounds, badges: value.badges }
  } catch {
    // vx-bot/NOTE: Invalid saved preferences use defaults.
  }
  const setNotifications = (next: typeof notifications) => {
    localStorage.setItem('demo:notification-settings', JSON.stringify(next))
    window.dispatchEvent(new Event('vx:notification-settings'))
  }
  return {
    updateUser,
    language,
    setLanguage,
    mode,
    setMode,
    name,
    setName,
    lastName,
    setLastName,
    email,
    setEmail,
    saved,
    setSaved,
    notifications,
    setNotifications
  }
}
type Preferences = ReturnType<typeof useSettingsPreferences>

const AccountSettings = ({
  updateUser,
  name,
  setName,
  lastName,
  setLastName,
  email,
  setEmail,
  saved,
  setSaved
}: Preferences) => (
  <form
    className="border-border bg-surface space-y-4 rounded-xl border p-5"
    onSubmit={event => {
      event.preventDefault()
      updateUser({ firstName: name, lastName, email })
      setSaved(true)
    }}
    onChange={() => setSaved(false)}>
    <p className="text-muted text-sm">
      Profile changes apply to this demo session.
    </p>
    <TextField name="firstName" value={name} onChange={setName} isRequired>
      <Label>First name</Label>
      <Input variant="secondary" />
    </TextField>
    <TextField name="lastName" value={lastName} onChange={setLastName}>
      <Label>Last name</Label>
      <Input variant="secondary" />
    </TextField>
    <TextField
      name="email"
      type="email"
      value={email}
      onChange={setEmail}
      isRequired>
      <Label>Email</Label>
      <Input variant="secondary" />
    </TextField>
    <Button type="submit">Save changes</Button>
    <p role="status" className="text-muted text-sm">
      {saved ? 'Changes saved.' : ''}
    </p>
  </form>
)

const AppearanceSettings = ({ mode, setMode }: Preferences) => (
  <div className="border-border bg-surface rounded-xl border p-5">
    <p className="mb-1 text-sm font-medium">Appearance</p>
    <p className="text-muted mb-5 text-xs">
      Choose a light, dark, or automatic appearance.
    </p>
    <div className="grid grid-cols-3 gap-3">
      {['light', 'dark', 'auto'].map(value => (
        <Button
          key={value}
          variant="ghost"
          aria-pressed={mode === value}
          className={`h-auto flex-col gap-2 rounded-lg p-2 ${mode === value ? 'ring-accent ring-2' : ''}`}
          onPress={() => setMode?.(value as ThemeMode)}>
          <span
            aria-hidden="true"
            className={`border-border relative block h-16 w-full overflow-hidden rounded-md border ${value === 'dark' ? 'bg-foreground' : 'bg-surface-secondary'}`}>
            <span className="bg-muted/30 absolute inset-y-0 left-0 w-1/3" />
            <span
              className={`absolute inset-y-3 right-2 left-[40%] rounded-sm ${value === 'dark' ? 'bg-background/30' : 'bg-surface'}`}
            />
            {value === 'auto' && (
              <span className="bg-foreground/70 absolute inset-y-0 right-0 w-1/2" />
            )}
          </span>
          <span className="text-xs capitalize">
            {value === 'auto' ? 'System' : value}
          </span>
        </Button>
      ))}
    </div>
  </div>
)

const GeneralSettings = ({ language, setLanguage }: Preferences) => (
  <Surface className="border-border flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-none">
    <div>
      <p className="text-sm font-medium">Language</p>
      <p className="text-muted mt-1 text-xs">Language for the app interface</p>
    </div>
    <Select
      aria-label="Language"
      className="w-40"
      value={language}
      onChange={value => {
        if (typeof value === 'string') {
          setLanguage(value)
          document.documentElement.lang = value
        }
      }}
      variant="secondary">
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {[
            { id: 'en', label: 'English' },
            { id: 'zh', label: '中文' }
          ].map(option => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  </Surface>
)

const NotificationsSettings = ({
  notifications,
  setNotifications
}: Preferences) => (
  <div className="space-y-4">
    <p className="text-muted text-sm">
      Demo preferences are saved on this device. Notification delivery is
      simulated.
    </p>
    {(['sounds', 'badges'] as const).map(key => (
      <Switch
        key={key}
        className="border-border bg-surface w-full rounded-xl border p-4"
        isSelected={notifications[key]}
        onChange={selected => {
          const next = { ...notifications, [key]: selected }
          setNotifications(next)
        }}>
        <Switch.Content className="flex w-full flex-row-reverse justify-between gap-3 text-sm">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {key === 'sounds' ? 'Notification sounds' : 'Notification badges'}
        </Switch.Content>
      </Switch>
    ))}
  </div>
)

const settingsComponents = {
  Account: AccountSettings,
  Appearance: AppearanceSettings,
  General: GeneralSettings,
  Notifications: NotificationsSettings
}
const SettingsContentView = ({ active }: { active: SettingsSection }) => {
  const preferences = useSettingsPreferences()
  if (active === 'Edit Widgets' || active === 'Edit Controls') return null
  const Content = settingsComponents[active]
  return <Content {...preferences} />
}

export const SettingsContent = ({ active }: { active: SettingsSection }) => (
  <AppearanceProvider>
    <SettingsContentView active={active} />
  </AppearanceProvider>
)
