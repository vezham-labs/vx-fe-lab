export type PreviewModel = {
  name: string
  provider: string
  description: string
  ratings: readonly [number, number, number, number]
  context: string
}

const model = (
  name: string,
  provider: string,
  description: string,
  ratings: PreviewModel['ratings'],
  context = '1M context window · preview'
): PreviewModel => ({ name, provider, description, ratings, context })

export const PREVIEW_MODELS: readonly PreviewModel[] = [
  model(
    'Sonnet 4.6',
    'Claude',
    'Balanced preset for everyday app generation and iteration.',
    [2, 2, 2, 2]
  ),
  model(
    'Sonnet 5',
    'Claude',
    'Versatile preset for design and implementation tasks.',
    [3, 3, 2, 2]
  ),
  model(
    'Opus 4.8',
    'Claude',
    'Thorough preset for complex planning and detailed work.',
    [3, 3, 1, 3]
  ),
  model(
    'Fable 5',
    'Claude',
    'Creative preset for exploring ideas and visual directions.',
    [2, 3, 2, 2]
  ),
  model(
    'Gemini 3.1 Pro',
    'Gemini',
    'General-purpose preset for larger contextual tasks.',
    [3, 2, 2, 2]
  ),
  model(
    'Gemini 3.8 Flash',
    'Gemini',
    'Quick preset for concise answers and small iterations.',
    [2, 2, 3, 1]
  ),
  model(
    'Kimi K3',
    'Kimi',
    'Context-focused preset for summaries and structured work.',
    [2, 2, 2, 2]
  ),
  model(
    'Grok 4.6',
    'Grok',
    'Conversational preset for exploring alternatives.',
    [2, 2, 2, 2]
  ),
  model(
    'GPT-6.1 Sol',
    'GPT',
    'Sample preset matching the Fast mode reference.',
    [3, 3, 2, 2]
  ),
  model(
    'GPT-6 Astra',
    'GPT',
    'Thorough preset for complex reasoning and detailed work.',
    [3, 3, 2, 2]
  )
]
