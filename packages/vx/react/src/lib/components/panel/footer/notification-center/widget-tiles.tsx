import { Surface } from '@vezham/react-v3'

import { useTileEditor } from '../control-center/editor'

const tileSizes = [
  'small',
  'small',
  'medium',
  'large',
  'small',
  'small',
  'medium',
  'large'
] satisfies ('small' | 'medium' | 'large')[]

const widgetDefinitions = tileSizes.map((size, index) => ({
  id: `widget-${index}`,
  label: `${size[0].toUpperCase()}${size.slice(1)} widget ${index + 1}`,
  size
}))
export const useWidgetTiles = () =>
  useTileEditor(widgetDefinitions, 'vx:widgets')
export const WidgetTiles = () => {
  const { visibleTiles } = useWidgetTiles()
  return (
    <div className="@container mx-auto w-full max-w-[352px]">
      <div className="grid auto-rows-[calc((100cqw-1rem)/2)] grid-cols-2 gap-4 pb-4">
        {visibleTiles.map(({ id, size }) => (
          <Surface
            key={id}
            variant="transparent"
            data-widget-size={size}
            aria-hidden="true"
            className={`bg-surface/80 relative min-w-0 overflow-hidden rounded-3xl shadow-sm backdrop-blur-xl ${
              size === 'small'
                ? ''
                : size === 'medium'
                  ? 'col-span-2'
                  : 'col-span-2 row-span-2'
            }`}>
            {null}
          </Surface>
        ))}
      </div>
    </div>
  )
}
