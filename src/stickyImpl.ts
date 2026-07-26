import { join, recalculate, register, unregister } from './stack'
import type {
  PartialRequired,
  SelectorOrElement,
  Sticky,
  StickyOptions,
} from './sticky'
import { noop } from './utility'

type MaybeHTMLElement = HTMLElement | Element | null | undefined

const normalizeElement = (
  value?: SelectorOrElement,
  ...fallbacks: MaybeHTMLElement[]
): HTMLElement => {
  if (value && value instanceof HTMLElement) {
    return value
  }

  const element = [value && document.querySelector(value), ...fallbacks].find(
    (item): item is HTMLElement => !!item && item instanceof HTMLElement
  )

  if (element instanceof HTMLElement) {
    return element
  }

  throw new TypeError('[Stuck-js] Could not find HTMLElement')
}

export default class StickyImpl implements Sticky {
  public element: HTMLElement
  public options: PartialRequired<StickyOptions, 'marginTop'>

  private $$offsetTop: number = -1
  private readonly $$onUpdate: () => void
  private readonly $$restoreStyles: () => void
  private readonly $$sentinel: HTMLElement
  private $$resizeObserver?: ResizeObserver
  private $$stuckObserver?: IntersectionObserver
  private $$destroyed: boolean = false

  public constructor(
    element: HTMLElement,
    options: StickyOptions = { observe: true },
    activate: boolean = true,
    onUpdate: () => void = noop
  ) {
    if (!element) {
      throw new Error('[Stuck-js] Invalid element given')
    }

    this.element = element
    this.options = { marginTop: 0, ...options }
    this.$$onUpdate = typeof onUpdate === 'function' ? onUpdate : noop
    this.options.wrapper = normalizeElement(
      this.options.wrapper,
      element.parentElement,
      document.body
    )

    const { position, top } = element.style
    this.$$restoreStyles = (): void => {
      element.style.position = position
      element.style.top = top
    }
    element.style.position = 'sticky'
    element.dataset.stuck = ''

    // 元の位置に残る目印。要素自身を観測しても、固定されて動かないのか
    // 元からその位置にあるのかを区別できないため、動かない基準が要る
    this.$$sentinel = document.createElement('div')
    this.$$sentinel.style.cssText =
      'height:0;margin:0;padding:0;border:0;visibility:hidden;'
    element.insertAdjacentElement('beforebegin', this.$$sentinel)

    this.offsetTop = this.options.marginTop

    if (this.options.observe ?? true) {
      // 高さが変われば下に積まれた sticky の位置も変わる
      this.$$resizeObserver = new ResizeObserver((): void => {
        recalculate()
        this.$$onUpdate()
      })
      this.$$resizeObserver.observe(element)
    }

    register(this)

    if (activate) {
      join(this)
    }
  }

  public get offsetTop(): number {
    return this.$$offsetTop
  }

  public set offsetTop(value: number) {
    if (this.$$destroyed || this.$$offsetTop === value) {
      return
    }
    this.$$offsetTop = value
    this.element.style.top = `${value}px`
    this.watchStuckState()
  }

  /**
   * 固定線が動くたびに監視域を張り直す。sentinel がその線より上へ
   * 抜けていれば、要素は線に貼り付いている
   */
  private watchStuckState(): void {
    this.$$stuckObserver?.disconnect()
    this.$$stuckObserver = new IntersectionObserver(
      ([entry]): void => {
        this.element.dataset.stuck = entry.isIntersecting ? '' : 'true'
      },
      {
        // 上は固定線まで縮め、下はページ全体を覆うほど広げる。
        // 下を広げないと、まだ画面下にある sentinel まで「交差なし」に
        // なってしまい、スクロール前から固定扱いされる
        rootMargin: `-${this.$$offsetTop}px 0px 100000px 0px`,
        threshold: 0,
      }
    )
    this.$$stuckObserver.observe(this.$$sentinel)
  }

  public update(): void {
    if (this.$$destroyed) {
      return
    }
    recalculate()
  }

  public destroy(): void {
    if (this.$$destroyed) {
      return
    }
    this.$$destroyed = true
    this.$$resizeObserver?.disconnect()
    this.$$stuckObserver?.disconnect()
    this.$$sentinel.remove()
    this.$$restoreStyles()
    this.element.removeAttribute('data-stuck')
    unregister(this)
  }
}
