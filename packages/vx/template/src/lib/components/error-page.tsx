import { Alert } from '@vezham/react-v3'

type Props = {
  error?: unknown
}

const getMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong.'
}

export const ErrorPage = ({ error }: Props) => (
  <main className="vx-error-page mx-auto flex min-h-80 max-w-xl flex-col items-center justify-center gap-3 p-6 text-center">
    <Alert status="danger">
      <Alert.Content>
        <Alert.Title>Unable to load this page</Alert.Title>
        <Alert.Description>{getMessage(error)}</Alert.Description>
      </Alert.Content>
    </Alert>
  </main>
)
