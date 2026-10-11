import {
  AltArrowDown as AltArrowDownIcon,
  AltArrowUp as AltArrowUpIcon,
  ArrowLeft as ArrowLeftIcon,
  Eye as EyeIcon,
  Heart,
  MinusCircle,
  Pin
} from '@vezham/icons-react'
import { Avatar, Button, ScrollShadow, Typography } from '@vezham/react-v3'

import { BookmarkSectionEmptyState } from '../empty-state'
import { ReorderableGridList } from '../favorites'
import { ShortcutContextMenu } from '../shortcut-context-menu'
import { type QuickAccessProps } from './types'

const QuickAccess = ({
  mode,
  favorites,
  onUnpin,
  onFavoriteRemove,
  onFavoritesReorder,
  pins,
  visiblePins,
  hasMorePins,
  isScrollFavoritesOpen,
  renderFavoriteItem,
  getSectionProps,
  getSectionHeaderProps,
  getSectionTitleProps,
  getSectionIconProps,
  getFavorite2ItemsProps,
  getFavoriteBackgroundImageProps,
  getFavoriteBackgroundGradientProps,
  getFavoriteOverlayProps,
  getFavoriteAvatarContainerProps,
  getFavoriteAvatarProps,
  getFavoriteAvatarIconProps,
  getFavoriteAvatarFallbackProps,
  getFavoriteContentProps,
  getFavoriteNameProps,
  onFavoriteClick,
  onViewAllPins,
  onBackToNormalView,
  onToggleScrollFavorites
}: QuickAccessProps) => {
  const renderAllPinsFullView = () => {
    return (
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              isIconOnly
              aria-label="Back to bookmarks"
              size="sm"
              variant="ghost"
              className="text-default-600 shrink-0"
              onPress={onBackToNormalView}>
              <ArrowLeftIcon size={16} aria-hidden="true" />
            </Button>
            <Typography.Heading className="text-xl font-semibold">
              All Pins
            </Typography.Heading>
          </div>
        </div>
        {pins.length === 0 && (
          <BookmarkSectionEmptyState
            title="No pins yet."
            description="Keep useful items within easy reach."
          />
        )}
        <div className="space-y-1">
          {pins.map(item => (
            <div
              key={item.id}
              className="group hover:bg-default has-[:focus-visible]:bg-default relative flex w-full min-w-0 items-center rounded-md">
              <button
                type="button"
                onClick={() => onFavoriteClick(item.url, item)}
                className="focus-visible:ring-focus flex w-full min-w-0 cursor-[var(--cursor-interactive)] items-center gap-3 rounded-md px-2 py-2 text-left outline-none group-hover:pe-10 group-has-[:focus-visible]:pe-10 focus-visible:ring-2 focus-visible:ring-inset [@media(hover:none)]:pe-10">
                <Avatar className="h-5 w-5 shrink-0">
                  {item.avatar ? (
                    <Avatar.Image src={item.avatar} alt={item.name} />
                  ) : item.backgroundImage ? (
                    <Avatar.Image src={item.backgroundImage} alt={item.name} />
                  ) : null}
                  <Avatar.Fallback className="bg-default-500 text-white">
                    <Pin
                      className="text-warning"
                      size="1em"
                      weight="filled"
                      aria-hidden="true"
                    />
                  </Avatar.Fallback>
                </Avatar>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-foreground block truncate text-sm leading-5 font-medium">
                    {item.name}
                  </span>
                  {item.url && (
                    <span className="text-muted block truncate text-xs leading-4">
                      {item.url}
                    </span>
                  )}
                </span>
              </button>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-muted hover:text-danger data-[hovered=true]:text-danger pointer-events-none absolute end-1 size-7 min-w-0 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-has-[:focus-visible]:pointer-events-auto group-has-[:focus-visible]:opacity-100 hover:bg-transparent data-[hovered=true]:bg-transparent [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
                aria-label={`Unpin ${item.name} from Quick Access`}
                onPress={() => onUnpin(item.id)}>
                <MinusCircle size={16} aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPinsForScroll = () => {
    if (renderFavoriteItem) {
      return visiblePins.map(item => (
        <div data-shortcut-id={item.id} key={item.id}>
          {renderFavoriteItem({
            item,
            onItemClick: url => onFavoriteClick(url, item)
          })}
        </div>
      ))
    }

    return (
      <div className="flex flex-nowrap gap-3 pb-2">
        {visiblePins.map(item => (
          <div
            role="group"
            data-shortcut-id={item.id}
            key={item.id}
            {...getFavorite2ItemsProps()}>
            <button
              type="button"
              aria-label={`Open ${item.name}`}
              className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
              onClick={() => onFavoriteClick(item.url, item)}
            />
            {item.backgroundImage ? (
              <img
                {...getFavoriteBackgroundImageProps(
                  item.backgroundImage,
                  item.name
                )}
                alt={item.name}
              />
            ) : (
              <div {...getFavoriteBackgroundGradientProps()} />
            )}
            <div {...getFavoriteOverlayProps()} />

            <div {...getFavoriteAvatarContainerProps()}>
              <Avatar {...getFavoriteAvatarProps()}>
                {item.avatar && (
                  <Avatar.Image src={item.avatar} alt={item.name} />
                )}
                <Avatar.Fallback {...getFavoriteAvatarFallbackProps(item.name)}>
                  <Pin
                    {...getFavoriteAvatarIconProps()}
                    weight="filled"
                    aria-hidden="true"
                  />
                </Avatar.Fallback>
              </Avatar>
            </div>

            <div {...getFavoriteContentProps()}>
              <Typography.Paragraph {...getFavoriteNameProps(item.name)} />
            </div>
          </div>
        ))}

        {hasMorePins && (
          <button
            onClick={onViewAllPins}
            className="group bg-default-100 hover:bg-default-200 relative flex aspect-square w-[120px] shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl transition-[transform,background-color] hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex flex-col items-center gap-2 p-4">
              <EyeIcon
                size={32}
                className="text-primary"
                weight="filled"
                aria-hidden="true"
              />
              <div className="text-center">
                <Typography.Paragraph className="text-default-700 text-sm font-semibold">
                  View All
                </Typography.Paragraph>
                <Typography.Paragraph className="text-default-500 text-xs">
                  {pins.length - 6} more
                </Typography.Paragraph>
              </div>
            </div>
          </button>
        )}
      </div>
    )
  }

  if (mode === 'all') {
    return renderAllPinsFullView()
  }

  return (
    <>
      <section {...getSectionProps()}>
        <div {...getSectionHeaderProps()}>
          <Heart
            {...getSectionIconProps('text-primary')}
            weight="filled"
            aria-hidden="true"
          />
          <Typography.Heading {...getSectionTitleProps('Favorites')} />
        </div>

        <ReorderableGridList
          items={favorites}
          onRemove={onFavoriteRemove}
          onReorder={onFavoritesReorder}
          onAction={item => onFavoriteClick(item.url, item)}
        />
      </section>

      <section {...getSectionProps()}>
        <div {...getSectionHeaderProps()}>
          <div className="flex flex-1 items-center gap-2">
            <Pin
              {...getSectionIconProps('text-primary')}
              weight="filled"
              aria-hidden="true"
            />
            <Typography.Heading {...getSectionTitleProps('Quick Access')} />
          </div>
          {pins.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                aria-label={
                  isScrollFavoritesOpen
                    ? 'Collapse quick access'
                    : 'Expand quick access'
                }
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={onToggleScrollFavorites}
                className="text-default-400">
                {isScrollFavoritesOpen ? (
                  <AltArrowUpIcon size={18} aria-hidden="true" />
                ) : (
                  <AltArrowDownIcon size={18} aria-hidden="true" />
                )}
              </Button>
            </div>
          )}
        </div>

        {(isScrollFavoritesOpen || pins.length === 0) && (
          <ShortcutContextMenu items={pins} kind="pin" onRemove={onUnpin}>
            <ScrollShadow
              orientation="horizontal"
              className="max-w-full overflow-x-auto pb-2"
              hideScrollBar={false}>
              {pins.length === 0 ? (
                <BookmarkSectionEmptyState
                  title="No pins yet."
                  description="Keep useful items within easy reach."
                />
              ) : (
                renderPinsForScroll()
              )}
            </ScrollShadow>
          </ShortcutContextMenu>
        )}
      </section>
    </>
  )
}

export { QuickAccess }
