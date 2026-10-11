'use client'

import { useDocsSearch } from '@vezham/docs-core/search/client'
import { staticClient } from '@vezham/docs-core/search/client/orama-static'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps
} from '@vezham/docs-react/components/dialog/search'
import { useI18n } from '@vezham/docs-react/contexts/i18n'

const DocsSearchDialog = (props: SharedProps) => {
  const { locale } = useI18n()
  const { search, setSearch, query } = useDocsSearch({
    client: staticClient({
      locale
    })
  })

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}

export { DocsSearchDialog }
