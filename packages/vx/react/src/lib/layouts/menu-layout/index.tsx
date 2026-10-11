import { useMediaQuery } from '@vezham/react-v3'

import type { FooterActionsProps } from '../../components/panel/footer/types'
import type { AppNavigationItem } from '../../navigation'
import { MenuMD } from './index-md'
import { MenuSM } from './index-sm'

export type MenuLayoutProps = Pick<FooterActionsProps, 'controlCenter'> & {
  items: AppNavigationItem[]
}

const MenuLayout = ({ items, controlCenter }: MenuLayoutProps) => {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return <MenuSM items={items} controlCenter={controlCenter} />
  } else {
    return <MenuMD items={items} controlCenter={controlCenter} />
  }
}

export { MenuLayout }
