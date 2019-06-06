import Placeholder from './placeholder'

export type Selector = string
export type SelectorOrElement = Selector | HTMLElement
export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>

export interface StickyOptions {
  marginTop?: number
  wrapper?: SelectorOrElement
  observe: boolean
}

export interface Sticky {
  element: HTMLElement
  options: PartialRequired<StickyOptions, 'marginTop'>
  placeholder: Placeholder
  marginTop: number
  isStickToBottom: boolean
  rect: ClientRect
  floor?: number
  destroy(): void
  update(): void
}
