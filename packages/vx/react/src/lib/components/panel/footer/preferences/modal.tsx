import { useEffect, useRef, useState } from 'react'

import { CloseCircle as CloseCircleIcon } from '@vezham/icons-react'
import { Button, Surface } from '@vezham/react-v3'

import { SettingsSidebar, findItemById } from './sidebar'

type Props = {
  open: boolean
  onClose: () => void
  defaultActiveTab?: string
}

const UserInfoModal = ({
  open,
  onClose,
  defaultActiveTab = 'account'
}: Props) => {
  if (!open) return null

  return (
    <UserInfoModalContent
      defaultActiveTab={defaultActiveTab}
      onClose={onClose}
    />
  )
}

const UserInfoModalContent = ({
  defaultActiveTab,
  onClose
}: Required<Omit<Props, 'open'>>) => {
  const [active, setActive] = useState(defaultActiveTab)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = contentRef.current

    if (!container) return

    const sections = Array.from(container.querySelectorAll('[id]'))

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          const id = visible[0].target.id
          setActive(id)
        }
      },
      {
        root: container,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-20% 0px -60% 0px'
      }
    )

    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const item = findItemById(active)
  const Component = item?.component

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        type="button"
        aria-label="Close preferences"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <Surface className="relative z-10 flex h-[500px] w-[700px] rounded-2xl p-6">
        <Button
          aria-label="Close preferences"
          isIconOnly
          variant="ghost"
          className="absolute top-4 right-4"
          onPress={onClose}>
          <CloseCircleIcon size={22} aria-hidden="true" />
        </Button>

        <SettingsSidebar active={active} onSelect={setActive} />

        <div ref={contentRef} className="flex-1 overflow-auto p-6">
          {Component ? <Component /> : <div>Select a setting</div>}
        </div>
      </Surface>
    </div>
  )
}

export { UserInfoModal }
