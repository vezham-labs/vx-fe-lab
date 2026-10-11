import type { ReactNode } from 'react'

import { Typography } from '@vezham/react-v3'

import { formatHistoryDate } from './history-utils'
import type { useProps } from './types'

type Props = Pick<
  ReturnType<typeof useProps>,
  | 'getDateGroupProps'
  | 'getDateHeaderProps'
  | 'getDateLabelProps'
  | 'getDateDividerProps'
  | 'getItemsListProps'
> & {
  date: string
  children: ReactNode
}

export const StorageHistoryDateGroup = ({
  date,
  children,
  getDateGroupProps,
  getDateHeaderProps,
  getDateLabelProps,
  getDateDividerProps,
  getItemsListProps
}: Props) => (
  <div {...getDateGroupProps()}>
    <div {...getDateHeaderProps()}>
      <Typography.Paragraph {...getDateLabelProps()}>
        {formatHistoryDate(date)}
      </Typography.Paragraph>
      <div {...getDateDividerProps()} />
    </div>
    <div {...getItemsListProps()}>{children}</div>
  </div>
)
