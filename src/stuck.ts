import { Sticky, Selector, StickyOptions } from './sticky'

interface SelectorOption {
  selector: Selector
  element?: undefined
}
interface ElementOption {
  element: HTMLElement | HTMLElement[]
  selector?: undefined
}
export type SelectorOrElementOption = SelectorOption | ElementOption
export type StickySetting = StickyOptions & SelectorOrElementOption

export interface Stuck {
  create(
    source: Readonly<StickySetting[] | StickySetting>,
    sharedStacking: boolean
  ): Sticky[]

  stickies: readonly Sticky[]
  destroy(): void
}
