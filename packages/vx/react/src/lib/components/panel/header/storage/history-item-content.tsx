import { Document as DocumentIcon } from '@vezham/icons-react'

import type { useProps } from './types'

type Props = Pick<
  ReturnType<typeof useProps>,
  | 'getItemFaviconProps'
  | 'getItemFallbackIconProps'
  | 'getItemContentProps'
  | 'getItemTitleProps'
  | 'getItemUrlProps'
> & {
  item: { favicon?: string; title: string; url: string }
}

export const StorageHistoryItemContent = ({
  item,
  getItemFaviconProps,
  getItemFallbackIconProps,
  getItemContentProps,
  getItemTitleProps,
  getItemUrlProps
}: Props) => (
  <>
    {item.favicon ? (
      <img src={item.favicon} alt="" {...getItemFaviconProps()} />
    ) : (
      <DocumentIcon
        {...getItemFallbackIconProps()}
        weight="outline"
        aria-hidden="true"
      />
    )}
    <div {...getItemContentProps()}>
      <span {...getItemTitleProps(item.title)} />
      <span {...getItemUrlProps(item.url)} />
    </div>
  </>
)
