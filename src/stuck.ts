import type { Selector, Sticky, StickyOptions } from './sticky'

/** querySelectorAll の戻り値をそのまま渡せるよう ArrayLike も受ける */
export type ElementOrElements = HTMLElement | ArrayLike<HTMLElement>

interface SelectorOption {
  selector: Selector
  element?: undefined
}
interface ElementOption {
  element: ElementOrElements
  selector?: undefined
}
export type SelectorOrElementOption = SelectorOption | ElementOption

/** 内部で selector と element を同時に扱うための、判別しない形 */
export interface ElementSource {
  selector?: Selector
  element?: ElementOrElements
}
export type StickySetting = StickyOptions & SelectorOrElementOption

export interface Stuck {
  create(
    source: Readonly<StickySetting[] | StickySetting>,
    sharedStacking: boolean
  ): Sticky[]

  stickies: readonly Sticky[]
  destroy(): void
}
