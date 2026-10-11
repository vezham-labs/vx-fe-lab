export type FolderVisualType = 'emoji' | 'icon'

export interface FolderFormState {
  id?: string
  name: string
  color: string
  visualType: FolderVisualType
  emoji: string
  icon: string
}

export interface FolderModalProps {
  open: boolean
  mode: 'create' | 'edit'
  form: FolderFormState
  onFormChange: (form: FolderFormState) => void
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export interface FolderVisualPreviewProps {
  color: string
  visualType: FolderVisualType
  emoji: string
  icon: string
  className?: string
}
