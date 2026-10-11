import type { ElementType } from 'react'

import defaultMdxComponents from '@vezham/docs-react/mdx'

type MDXComponents = Record<string, ElementType>

export const getMDXComponents = (components?: MDXComponents) => {
  return {
    ...defaultMdxComponents,
    ...components
  } satisfies MDXComponents
}
