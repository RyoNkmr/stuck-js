import { noop } from './utility'

export default class Placeholder {
  public original: HTMLElement
  public element: HTMLElement
  public cachedRect: DOMRect
  public observer?: ResizeObserver
  public onUpdate: () => void
  public initialComputedStyles: CSSStyleDeclaration
  public initiallyHidden: boolean
  private $$shouldPlacehold: boolean = true
  private $$destroyed: boolean = false

  public get shouldPlacehold(): boolean {
    return !this.initiallyHidden && this.$$shouldPlacehold
  }

  public set shouldPlacehold(value: boolean) {
    if (this.shouldPlacehold === value) {
      return
    }

    this.$$shouldPlacehold = value
    this.update(true)
  }

  public constructor(
    element: HTMLElement,
    observe: boolean = true,
    onUpdate: () => void = noop
  ) {
    this.original = element
    this.onUpdate = typeof onUpdate === 'function' ? onUpdate : noop

    this.initialComputedStyles = window.getComputedStyle(this.original)
    this.initiallyHidden = this.initialComputedStyles.display === 'none'

    if (this.initiallyHidden) {
      this.execWhileStucking((): void => {
        this.initialComputedStyles = window.getComputedStyle(this.original)
      })
    }

    this.element = Placeholder.createPlaceholderElement()
    this.applyInitialStyles()
    Placeholder.wrap(this.original, this.element)
    this.cachedRect = this.updateRect()

    if (observe) {
      this.observer = Placeholder.createObserver(this.original, (): void =>
        this.update()
      )
    }
  }

  public update(forceUpdate: boolean = false): void {
    if (this.$$destroyed) {
      return
    }
    if (this.shouldPlacehold) {
      this.applyStyles(forceUpdate)
    } else {
      this.removeStyles()
    }
    this.onUpdate()
  }

  public updateRect(): DOMRect {
    this.cachedRect = this.element.getBoundingClientRect()
    if (this.initiallyHidden) {
      this.execWhileStucking((): void => {
        this.cachedRect = this.element.getBoundingClientRect()
      })
    }
    return this.cachedRect
  }

  public destroy(): void {
    if (this.$$destroyed) {
      return
    }
    this.$$destroyed = true
    if (this.observer) {
      this.observer.disconnect()
      delete this.observer
    }
    Placeholder.unwrap(this.original)
  }

  private execWhileStucking(execute: () => void): void {
    const state = this.original.dataset.stuck
    this.original.dataset.stuck = 'true'
    execute()
    this.original.dataset.stuck = state
  }

  private applyInitialStyles(): void {
    if (!this.initialComputedStyles || this.initiallyHidden) {
      return
    }
    this.element.style.margin = this.initialComputedStyles.margin
    this.element.style.minWidth = this.initialComputedStyles.minWidth
    this.element.style.minHeight = this.initialComputedStyles.minHeight
    this.element.style.width = this.initialComputedStyles.width
    this.element.style.height = this.initialComputedStyles.height
  }

  private applyStyles(forceUpdate: boolean = false): void {
    const { width: originalWidth, height: originalHeight } =
      this.original.getBoundingClientRect()
    const widthChanged = originalWidth !== this.cachedRect.width
    const heightChanged = originalHeight !== this.cachedRect.height

    if (!forceUpdate && !widthChanged && !heightChanged) {
      return
    }

    if (forceUpdate || widthChanged) {
      this.element.style.width = `${originalWidth}px`
    }

    if (forceUpdate || heightChanged) {
      this.element.style.height = `${originalHeight}px`
    }

    this.updateRect()
  }

  private removeStyles(): void {
    this.element.style.width = ''
    this.element.style.height = ''
  }

  /**
   * サイズそのものを監視する。属性の変化を見る MutationObserver では
   * CSS transition や animation による寸法の変化を取り逃がしてしまう
   * （class が付いた時点でしか測れず、遷移後の値にならない）。
   */
  private static createObserver(
    targetNode: HTMLElement,
    callback: () => void
  ): ResizeObserver {
    if (!targetNode) {
      throw new TypeError(
        `[Stuck.js] Could not observe targetNode ${String(
          targetNode
        )}. This should be HTMLElement`
      )
    }

    const observer = new ResizeObserver((): void => {
      callback()
    })

    observer.observe(targetNode)
    return observer
  }

  private static unwrap(target: HTMLElement): HTMLElement {
    const wrapper = target.parentNode

    if (wrapper instanceof HTMLElement) {
      wrapper.insertAdjacentElement('beforebegin', target)
      const parent = wrapper.parentNode

      if (parent instanceof HTMLElement) {
        parent.removeChild(wrapper)
      }
    }
    return target
  }

  private static wrap(target: HTMLElement, wrapper: HTMLElement): HTMLElement {
    if (target.parentNode !== wrapper) {
      target.insertAdjacentElement('beforebegin', wrapper)
      wrapper.appendChild(target)
    }
    return wrapper
  }

  private static createPlaceholderElement(tagName = 'div'): HTMLElement {
    return document.createElement(tagName)
  }
}
