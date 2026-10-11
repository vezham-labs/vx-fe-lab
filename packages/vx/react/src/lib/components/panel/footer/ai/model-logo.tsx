import { MODEL_LOGOS } from './model-logos'

export const ModelLogo = ({
  provider,
  size = 16
}: {
  provider: string
  size?: number
}) => (
  <img
    src={MODEL_LOGOS[provider]}
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    className={`shrink-0 object-contain ${provider !== 'Claude' && provider !== 'Gemini' ? 'dark:invert' : ''}`}
  />
)
