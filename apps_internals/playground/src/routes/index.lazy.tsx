import { createLazyFileRoute } from '@tanstack/react-router'

import Page from '@pages/home'

export const Route = createLazyFileRoute('/')({
  component: () => <Page />
})
