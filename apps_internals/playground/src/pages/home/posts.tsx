import { usePosts } from '@store/usePosts'

export default () => {
  const { data, error, isPending, isError } = usePosts()

  if (isPending) return <div>Loading...</div>
  if (isError) return <span>Error: {error.message}</span>
  // if (isFetching) return <div>Background Updating...</div>

  return (
    <div>
      {data.map(post => (
        <p key={post.id}>
          <a data-id={post.id} href={`/posts/${post.id}`}>
            {post.title}
          </a>
        </p>
      ))}
    </div>
  )
}
