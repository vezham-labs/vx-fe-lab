import { test as base, expect } from '@playwright/test'

// vx-bot/NOTE: Check every scenario, including navigation to an expected 404 document.
export const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ page }, use) => {
      const runtimeErrors: string[] = []
      const consoleErrors: Array<{ text: string; url: string }> = []
      const notFoundDocuments = new Set<string>()
      page.on('pageerror', error => runtimeErrors.push(error.message))
      page.on('console', message => {
        if (message.type() === 'error')
          consoleErrors.push({
            text: message.text(),
            url: message.location().url
          })
      })
      page.on('response', response => {
        const request = response.request()
        if (
          response.status() === 404 &&
          request.isNavigationRequest() &&
          request.frame() === page.mainFrame()
        ) {
          notFoundDocuments.add(response.url())
        }
      })
      await use()
      const unexpectedErrors = consoleErrors.filter(
        error =>
          !(
            notFoundDocuments.has(error.url) &&
            /^Failed to load resource: the server responded with a status of 404(?: \((?:Not Found)?\))?$/.test(
              error.text
            )
          )
      )
      expect([
        ...runtimeErrors,
        ...unexpectedErrors.map(error => error.text)
      ]).toEqual([])
    },
    { auto: true }
  ]
})

export { expect } from '@playwright/test'
