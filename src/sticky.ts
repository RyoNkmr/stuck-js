export type Selector = string
export type SelectorOrElement = Selector | HTMLElement
export type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>

export interface StickyOptions {
  marginTop?: number
  wrapper?: SelectorOrElement
  observe?: boolean
}

export interface Sticky {
  element: HTMLElement
  options: PartialRequired<StickyOptions, 'marginTop'>
  /** 上に積まれた sticky の高さを含めた、実際に固定される位置 */
  offsetTop: number
  /** スタック上の位置を再計算させる。通常は自動で呼ばれる */
  update(): void
  destroy(): void
}
