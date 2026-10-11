import type { BookmarkItem, BookmarksResponse, FavoriteItem } from './types'

export const sampleFavorites: FavoriteItem[] = [
  {
    id: 'favorite-all-classes',
    name: 'All Classes',
    url: '/academic/classes/allclasses'
  },
  { id: 'favorite-operations', name: 'Operations', url: '/operations' },
  { id: 'favorite-hello-world', name: 'Hello World', url: '/hello-world' },
  {
    id: '1',
    name: 'HeroUI v3',
    url: 'https://v3.heroui.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg'
  },
  {
    id: '2',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg'
  },
  {
    id: '3',
    name: 'Miro Boards',
    url: 'https://miro.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg'
  },
  {
    id: '4',
    name: 'Figma',
    url: 'https://figma.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg'
  },
  {
    id: '5',
    name: 'GitHub',
    url: 'https://github.com',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg'
  },
  {
    id: '6',
    name: 'Gemini',
    url: 'https://gemini.google.com',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg'
  },
  {
    id: '7',
    name: 'Application',
    url: '',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg'
  },
  {
    id: '8',
    name: 'HeroUI Pro',
    url: 'https://heroui.pro',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg'
  },
  {
    id: '9',
    name: 'Design ideas',
    url: ''
  },
  {
    id: '10',
    name: 'Reading list',
    url: ''
  },
  {
    id: '11',
    name: 'Project notes',
    url: ''
  },
  {
    id: '12',
    name: 'Project notes',
    url: ''
  },
  {
    id: '13',
    name: 'Project notes',
    url: ''
  }
]

const samplePins: FavoriteItem[] = [
  {
    id: 'pin-all-classes',
    name: 'All Classes',
    url: '/academic/classes/allclasses'
  },
  { id: 'pin-operations', name: 'Operations', url: '/operations' },
  { id: 'pin-hello-world', name: 'Hello World', url: '/hello-world' },
  {
    id: 'pin-classes',
    name: 'Classes',
    url: '/academic/classes',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg'
  },
  {
    id: 'pin-projects',
    name: 'Project overview',
    url: '/workspace/projects/overview',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg'
  },
  {
    id: 'pin-board',
    name: 'Design board',
    url: 'https://miro.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg'
  },
  {
    id: 'pin-review',
    name: 'Design review',
    url: 'https://figma.com',
    backgroundImage:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg'
  },
  {
    id: 'pin-docs',
    name: 'Reference docs',
    url: 'https://v3.heroui.com/docs',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg'
  },
  {
    id: 'pin-activity',
    name: 'Project activity',
    url: '/workspace/projects/activity',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg'
  },
  { id: 'pin-notes', name: 'Meeting notes', url: '' },
  { id: 'pin-reading', name: 'Reading queue', url: '' }
]

const sampleBookmarks: BookmarkItem[] = [
  {
    id: 'bookmark-all-classes',
    name: 'All Classes',
    url: '/academic/classes/allclasses'
  },
  { id: 'bookmark-operations', name: 'Operations', url: '/operations' },
  { id: 'bookmark-hello-world', name: 'Hello World', url: '/hello-world' },
  {
    id: 'b1',
    name: 'HeroUI v3 Docs',
    url: 'https://v3.heroui.com/docs',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg',
    folder: 'Development'
  },
  {
    id: 'b2',
    name: 'Tailwind Installation',
    url: 'https://tailwindcss.com/docs/installation',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg',
    folder: 'Development'
  },
  {
    id: 'b3',
    name: 'Miro Demo Team',
    url: 'https://miro.com/app/board/',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg',
    folder: 'Design'
  },
  {
    id: 'b4',
    name: 'Figma Design System Figma Design System Figma Design System',
    url: 'https://figma.com/design/7otXAQPcV',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
    folder: 'Design'
  },
  {
    id: 'b5-pro',
    name: 'Pro | Application home',
    url: '/pro',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg',
    folder: 'Workspace'
  },
  {
    id: 'b5',
    name: 'Application home',
    url: '/',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg',
    folder: 'Workspace'
  },
  {
    id: 'b6',
    name: 'Karthik Stay',
    url: '#',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/black.jpg'
  },
  {
    id: 'b4',
    name: 'Figma Design System',
    url: 'https://figma.com/design/7otXAQPcV',
    avatar:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg',
    folder: 'Design'
  }
]

export const bookmarksData: BookmarksResponse = {
  favorites: sampleFavorites,
  pins: samplePins,
  bookmarks: sampleBookmarks
}
