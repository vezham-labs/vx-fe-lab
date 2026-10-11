import { type Props } from './types'

// vx-bot/TODO: export const preConfig = ({ name, version, store = true }: Props) => {
export const preConfig = ({ store = true }: Props) => {
  if (store) {
    // vx-bot/TODO: defineStore({ pretext: name, version })
  }
}

// vx-bot/TODO: export const config = ({ worker = true, axios = true, ...props }: Props) => {
export const config = ({ worker = true, axios = true }: Props) => {
  if (worker) {
    // vx-bot/TODO: defineWorker({})
  }
  if (axios) {
    // vx-bot/TODO: defineAxios(props)
  }
}
