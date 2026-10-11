import { useRef, useState } from 'react'

import { AltArrowDown, Bolt, CheckRead, Stars } from '@vezham/icons-react'
import {
  Button,
  Popover,
  Switch,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import type { Conversation } from './conversation'
import { ModelLogo } from './model-logo'
import { PREVIEW_MODELS, type PreviewModel } from './models'

const ModelFeatures = ({ model }: { model: PreviewModel }) => (
  <div className="w-64 max-w-[calc(100vw-2rem)] p-2 text-xs">
    <p className="font-semibold">{model.name}</p>
    <p className="text-muted mt-2">{model.description}</p>
    <dl className="border-separator mt-3 flex flex-col gap-2 border-t pt-3">
      {['Complex tasks', 'Generative UI', 'Speed', 'Cost'].map(
        (label, index) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-muted">{label}</dt>
            <dd
              aria-label={`${model.ratings[index]} of 3`}
              className="flex gap-1">
              {[1, 2, 3].map(level => (
                <span
                  key={level}
                  aria-hidden="true"
                  className={`h-1.5 w-4 rounded-full ${level <= model.ratings[index] ? 'bg-foreground' : 'bg-muted/25'}`}
                />
              ))}
            </dd>
          </div>
        )
      )}
    </dl>
    <p className="text-muted mt-3 text-xs">{model.context}</p>
    <p className="text-muted mt-1 text-xs">
      Illustrative ratings, not provider specifications.
    </p>
  </div>
)

export const ModelPicker = ({
  conversation: c
}: {
  conversation: Conversation
}) => {
  const [open, setOpen] = useState(false)
  const smallScreen = useMediaQuery('(width < 640px)')
  const manualModel = useRef(PREVIEW_MODELS[0].name)
  const auto = c.model === 'Auto'
  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Button
        aria-label="AI model"
        variant="ghost"
        size="sm"
        className="min-w-0 gap-1 px-2">
        {auto ? (
          <Stars size={16} className="shrink-0" aria-hidden="true" />
        ) : (
          <ModelLogo
            provider={
              PREVIEW_MODELS.find(model => model.name === c.model)?.provider ??
              'GPT'
            }
          />
        )}
        <span className="max-w-16 truncate text-xs">{c.model}</span>
        <AltArrowDown size={12} className="shrink-0" aria-hidden="true" />
      </Button>
      <Popover.Content
        placement="top end"
        className="w-72 max-w-[calc(100vw-2rem)]">
        <Popover.Dialog aria-label="Choose AI model" className="p-2">
          <Switch
            aria-label="Auto model selection"
            isSelected={auto}
            onChange={enabled => {
              if (!auto) manualModel.current = c.model
              c.setModel(enabled ? 'Auto' : manualModel.current)
            }}
            className="bg-surface-secondary w-full rounded-2xl p-3">
            <Switch.Content className="flex w-full flex-row-reverse items-center justify-between gap-3">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <span className="text-xs font-medium">Auto</span>
            </Switch.Content>
          </Switch>
          {auto ? (
            <p className="text-muted px-2 pt-3 pb-2 text-xs">
              Balances and switches between models based on each task’s
              complexity. Recommended. Routing is simulated in this preview.
            </p>
          ) : (
            <div
              aria-label="Available models"
              className="mt-2 flex max-h-[min(24rem,50dvh)] flex-col gap-1 overflow-y-auto overscroll-contain">
              {PREVIEW_MODELS.map(model => (
                <Tooltip key={model.name} delay={150} isDisabled={smallScreen}>
                  <Button
                    aria-label={`Select ${model.name}`}
                    variant="ghost"
                    className={`w-full shrink-0 justify-start gap-2 px-3 text-xs ${c.model === model.name ? 'bg-surface-secondary' : ''}`}
                    aria-pressed={c.model === model.name}
                    onPress={() => {
                      c.setModel(model.name)
                      manualModel.current = model.name
                      setOpen(false)
                    }}>
                    <ModelLogo provider={model.provider} size={16} />
                    <span className="min-w-0 flex-1 truncate text-start">
                      {model.name}
                    </span>
                    {c.model === model.name && (
                      <CheckRead size={16} aria-hidden="true" />
                    )}
                  </Button>
                  <Tooltip.Content
                    placement="right"
                    className="bg-surface border-border rounded-2xl border shadow-xl">
                    <ModelFeatures model={model} />
                  </Tooltip.Content>
                </Tooltip>
              ))}
            </div>
          )}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}

export const FastModeToggle = ({
  conversation: c
}: {
  conversation: Conversation
}) => (
  <Tooltip delay={150}>
    <Button
      aria-label="Fast mode"
      aria-pressed={c.fastMode}
      isIconOnly
      size="sm"
      variant="ghost"
      className={c.fastMode ? 'text-accent bg-accent/10' : 'text-muted'}
      onPress={() => c.setFastMode(current => !current)}>
      <Bolt size={18} aria-hidden="true" />
    </Button>
    <Tooltip.Content>
      {c.fastMode ? 'Fast mode on' : 'Fast mode off'} · simulated
    </Tooltip.Content>
  </Tooltip>
)
