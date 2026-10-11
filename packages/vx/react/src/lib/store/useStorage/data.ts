import type { ArchiveItem, StorageResponse, TrashItem } from './types'

const sampleArchiveItems: ArchiveItem[] = [
  {
    id: 'archive-all-classes',
    title: 'All Classes',
    url: '/academic/classes/allclasses',
    archivedDate: '2026-04-09'
  },
  {
    id: 'archive-operations',
    title: 'Operations',
    url: '/operations',
    archivedDate: '2026-04-09'
  },
  {
    id: 'archive-hello-world',
    title: 'Hello World',
    url: '/hello-world',
    archivedDate: '2026-04-09'
  },
  {
    id: 'a1',
    title: 'HeroUI v3 (Previous',
    url: 'heroui.com',
    archivedDate: '2026-04-09',
    favicon: 'https://www.google.com/s2/favicons?domain=heroui.com&sz=32'
  },
  {
    id: 'a2',
    title: 'Application home',
    url: '/',
    archivedDate: '2026-04-09',
    favicon:
      'https://www.google.com/s2/favicons?domain=school.vezham.local&sz=32'
  },
  {
    id: 'a3',
    title: "Unlock your team's best work ",
    url: 'jira.atlassian.com',
    archivedDate: '2026-04-09',
    favicon: 'https://www.google.com/s2/favicons?domain=atlassian.com&sz=32'
  },
  {
    id: 'a4',
    title: 'Home | Vezham Books2',
    url: 'books2.vezham.local:3000',
    archivedDate: '2026-04-09',
    favicon:
      'https://www.google.com/s2/favicons?domain=books2.vezham.local&sz=32'
  },
  {
    id: 'a5',
    title: 'HeroUI v3 Documentation St...',
    url: 'heroui.com/react/llms-full.txt',
    archivedDate: '2026-04-08',
    favicon: 'https://www.google.com/s2/favicons?domain=heroui.com&sz=32'
  },
  {
    id: 'a6',
    title: 'MacOS Keyboard Backlight Gui...',
    url: 'chatgpt.com/c/69d67392-4d8c-83...',
    archivedDate: '2026-04-08',
    favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32'
  },
  {
    id: 'a7',
    title: 'Application reports',
    url: '/reports',
    archivedDate: '2026-04-07',
    favicon:
      'https://www.google.com/s2/favicons?domain=school.vezham.local&sz=32'
  },
  {
    id: 'a8',
    title: 'Home | Vezham Books2',
    url: 'books2.vezham.local:3000',
    archivedDate: '2026-04-07',
    favicon:
      'https://www.google.com/s2/favicons?domain=books2.vezham.local&sz=32'
  },
  {
    id: 'a9',
    title: 'User Info Clickable Update',
    url: 'chatgpt.com/c/69d51b8b-7758-832...',
    archivedDate: '2026-04-07',
    favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32'
  },
  {
    id: 'a10',
    title: 'sellur pincode - Google Search',
    url: 'google.com/search?q=sellur+pincod...',
    archivedDate: '2026-04-07',
    favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32'
  },
  {
    id: 'a11',
    title: 'Application home',
    url: '/',
    archivedDate: '2026-04-07',
    favicon:
      'https://www.google.com/s2/favicons?domain=school.vezham.local&sz=32'
  },
  {
    id: 'a12',
    title: 'Home | Vezham Books2',
    url: 'localhost:5173',
    archivedDate: '2026-04-07',
    favicon: 'https://www.google.com/s2/favicons?domain=localhost&sz=32'
  }
]

const sampleTrashItems: TrashItem[] = [
  {
    id: 'trash-all-classes',
    title: 'All Classes',
    url: '/academic/classes/allclasses',
    deletedDate: '2026-04-09'
  },
  {
    id: 'trash-operations',
    title: 'Operations',
    url: '/operations',
    deletedDate: '2026-04-09'
  },
  {
    id: 'trash-hello-world',
    title: 'Hello World',
    url: '/hello-world',
    deletedDate: '2026-04-09'
  },
  {
    id: 't1',
    title: 'Untitled folder so just demo testing purpose',
    url: '#',
    deletedDate: '2026-04-09',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't2',
    title: 'Old Documentation',
    url: 'docs.example.com/old',
    deletedDate: '2026-04-08',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't3',
    title: 'Temporary Notes',
    url: 'notes.example.com/temp',
    deletedDate: '2026-04-07',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't4',
    title: 'Draft - Project Proposal',
    url: 'docs.example.com/draft',
    deletedDate: '2026-04-07',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't5',
    title: 'Meeting Notes - Archived',
    url: 'meet.example.com/notes',
    deletedDate: '2026-04-06',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't6',
    title: 'Screenshot 2026-03-15',
    url: 'files.example.com/screenshots',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't7',
    title: 'Download - Presentation.pptx',
    url: 'downloads.example.com/preso',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't5',
    title: 'Meeting Notes - Archived',
    url: 'meet.example.com/notes',
    deletedDate: '2026-04-06',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't6',
    title: 'Screenshot 2026-03-15',
    url: 'files.example.com/screenshots',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't7',
    title: 'Download - Presentation.pptx',
    url: 'downloads.example.com/preso',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't5',
    title: 'Meeting Notes - Archived',
    url: 'meet.example.com/notes',
    deletedDate: '2026-04-06',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't6',
    title: 'Screenshot 2026-03-15',
    url: 'files.example.com/screenshots',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  },
  {
    id: 't7',
    title: 'Download - Presentation.pptx',
    url: 'downloads.example.com/preso',
    deletedDate: '2026-04-05',
    favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=32'
  }
]

export const storageData: StorageResponse = {
  archiveItems: sampleArchiveItems,
  trashItems: sampleTrashItems
}
