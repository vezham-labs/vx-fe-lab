import type {
  StatusTimingOption,
  SuggestedStatusOption,
  UserStatus,
  UserStatusOption
} from './types'

const STATUS_OPTIONS = [
  { id: 'active', label: 'Available', icon: '🟢', color: 'bg-success' },
  { id: 'away', label: 'Away', icon: '🌙', color: 'bg-warning' },
  { id: 'idle', label: 'Idle', icon: '💤', color: 'bg-primary' },
  { id: 'busy', label: 'Busy', icon: '🔴', color: 'bg-danger' },
  { id: 'dnd', label: 'Do not disturb', icon: '⛔', color: 'bg-muted' }
] as const satisfies readonly UserStatusOption[]

const DEFAULT_STATUS_OPTION = STATUS_OPTIONS[0]

const SUGGESTED_STATUS_OPTIONS: readonly SuggestedStatusOption[] = [
  { id: 'meeting', label: 'In a meeting', emoji: '🗓️' },
  { id: 'commuting', label: 'Commuting', emoji: '🚌' },
  { id: 'sick', label: 'Out sick', emoji: '🤒' },
  { id: 'vacation', label: 'Vacationing', emoji: '🌴' },
  { id: 'remote', label: 'Working remotely', emoji: '🏡' }
]

const STATUS_TIMING_OPTIONS: readonly StatusTimingOption[] = [
  { id: '15min', label: 'For 15 minutes' },
  { id: '1hour', label: 'For 1 hour' },
  { id: '8hours', label: 'For 8 hours' },
  { id: '24hours', label: 'For 24 hours' },
  { id: '3days', label: 'For 3 days' },
  { id: 'forever', label: 'Forever' }
]

const isColorStatus = (status?: UserStatus) =>
  status === 'active' || status === 'away' || status === 'busy'

export {
  DEFAULT_STATUS_OPTION,
  STATUS_OPTIONS,
  STATUS_TIMING_OPTIONS,
  SUGGESTED_STATUS_OPTIONS,
  isColorStatus
}
