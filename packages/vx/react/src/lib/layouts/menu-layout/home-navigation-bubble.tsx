import { Surface } from '@vezham/react-v3'

import { Header } from '../../components/panel/header'
import { type User } from '../../components/panel/header/types'

const HomeNavigationBubble = ({
  onToggleDock,
  users
}: {
  onToggleDock: () => void
  users: User
}) => {
  return (
    <Surface
      variant="transparent"
      role="group"
      aria-label="Home navigation"
      className="border-default-200 bg-background/90 fixed top-3 left-3 z-40 flex h-[50px] w-fit items-center rounded-full border px-2 py-0 shadow-[0_14px_28px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <Header
        compact
        users={users}
        isDockHidden
        showBookamarks
        showStorage
        onToggleDock={onToggleDock}
      />
    </Surface>
  )
}

export { HomeNavigationBubble }
