# @vx/start

For Vite apps using TanStack Router, use `RouterRoot` as the root route
component. It renders the outlet and development tools inside the router
context, so apps do not need to mount `ClientDevtools` separately.

```tsx
import { createRootRoute } from '@tanstack/react-router'

import { RouterRoot } from '@vx/start/router/tanstack'

export const Route = createRootRoute({ component: RouterRoot })
```

The query devtools panel detects whether a query provider exists. Next.js and
TanStack Start providers already mount their own devtools; keep their existing
root setup to avoid duplicate panels.
