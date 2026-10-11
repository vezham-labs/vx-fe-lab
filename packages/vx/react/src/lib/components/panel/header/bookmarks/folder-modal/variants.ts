import { type FolderFormState } from './types'

const DEFAULT_FOLDER_COLOR = '#007aff'
const DEFAULT_FOLDER_ICON = 'vx:list-filled'
const DEFAULT_FOLDER_EMOJI = '😀'

const folderColors = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#32ade6',
  '#007aff',
  '#5856d6',
  '#ff2d55',
  '#af52de',
  '#8e7d61',
  '#5d6b78',
  '#d7a59d'
]

const folderIconOptions = [
  'vx:list-filled',
  'vx:bookmark-filled',
  'vx:key-filled',
  'vx:gift-filled',
  'vx:cup-star-filled',
  'vx:academic-cap-filled',
  'vx:backpack-filled',
  'vx:notebook-bookmark-filled',
  'vx:document-filled',
  'vx:book-bookmark-filled',
  'vx:card-filled',
  'vx:cart-large-filled',
  'vx:home-filled',
  'vx:buildings-3-filled',
  'vx:banknote-filled',
  'vx:gamepad-filled',
  'vx:headphones-round-filled',
  'vx:leaf-filled',
  'vx:users-filled',
  'vx:heart-filled',
  'vx:star-filled',
  'vx:moon-filled',
  'vx:sun-2-filled',
  'vx:flag-filled'
]

const emojiOptions = [
  '😀',
  '😐',
  '❤️',
  '😂',
  '😍',
  '😌',
  '👌',
  '😊',
  '😚',
  '😭',
  '😩',
  '💕',
  '😔',
  '😉',
  '😁',
  '😳',
  '👍',
  '✌️',
  '😏',
  '😴',
  '🙋',
  '🙈',
  '😎',
  '🎵',
  '👀',
  '😪',
  '😜',
  '😋',
  '👏',
  '💡',
  '📚',
  '🎓',
  '🏫',
  '📝',
  '⭐',
  '🏁'
].map(emoji => ({ emoji, id: emoji, label: emoji }))

const createDefaultFolderForm = (): FolderFormState => ({
  name: '',
  color: DEFAULT_FOLDER_COLOR,
  visualType: 'icon',
  emoji: DEFAULT_FOLDER_EMOJI,
  icon: DEFAULT_FOLDER_ICON
})

export {
  DEFAULT_FOLDER_COLOR,
  DEFAULT_FOLDER_EMOJI,
  DEFAULT_FOLDER_ICON,
  createDefaultFolderForm,
  emojiOptions,
  folderColors,
  folderIconOptions
}
