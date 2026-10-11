import { Spinner } from '@vezham/react-v3'

export const Loading = () => (
  <div className="vx-loading flex min-h-40 items-center justify-center p-6">
    <Spinner aria-label="Loading" color="accent" size="lg" />
  </div>
)
