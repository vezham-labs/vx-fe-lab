import { cn } from '@vezham/react-v3'

type Props = {
  title: string
  description: string
  className?: string
}

export const BookmarkSectionEmptyState = ({
  title,
  description,
  className
}: Props) => (
  <div
    className={cn(
      'text-muted flex min-h-20 w-full flex-col items-center justify-center gap-1 px-4 py-4 text-center not-italic',
      className
    )}>
    <p className="text-xs font-medium">{title}</p>
    <p className="max-w-56 text-[11px] leading-4">{description}</p>
  </div>
)
