import { Sticky } from './sticky'

export interface StickyManager {
  register(sticky: Sticky): StickyManager
  unregister(sticky: Sticky): StickyManager
  bulkUpdate(): StickyManager
  destroyAll(): StickyManager
  activate(): StickyManager
  deactivate(): StickyManager
}

class StickyManagerImpl implements StickyManager {
  private static $$instance: StickyManager
  private $$stickies: Sticky[] = []
  private $$activated: boolean = false
  private $$bulkUpdateRequestId: number | null = null
  private readonly $$window: Window

  private constructor(_window: Window) {
    this.$$window = _window
    this.bulkUpdate = this.bulkUpdate.bind(this)
    this.bulkPlaceholderUpdate = this.bulkPlaceholderUpdate.bind(this)
  }

  public static getInstance(_window: Window): StickyManager {
    if (!this.$$instance) {
      this.$$instance = new StickyManagerImpl(_window)
    }
    return this.$$instance
  }

  public register(sticky: Sticky): StickyManager {
    this.$$stickies = [...this.$$stickies, sticky]
    return this
  }

  public unregister(sticky: Sticky): StickyManager {
    this.$$stickies = this.$$stickies.filter(
      (instance): boolean => instance !== sticky
    )
    if (this.$$stickies.length < 1) {
      this.deactivate()
    }
    return this
  }

  public bulkUpdate(): StickyManager {
    if (this.$$bulkUpdateRequestId) {
      this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId)
    }
    this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(
      (): void => {
        this.$$stickies.forEach((instance): void => instance.update())
      }
    )
    return this
  }

  public destroyAll(): StickyManager {
    this.$$stickies.forEach((instance): void => instance.destroy())
    this.$$stickies = []
    this.deactivate()
    return this
  }

  public activate(): StickyManager {
    if (!this.$$activated && this.$$stickies.length > 0) {
      this.$$window.addEventListener('scroll', this.bulkUpdate)
      this.$$window.addEventListener('resize', this.bulkPlaceholderUpdate)
      this.$$activated = true
    }
    this.bulkUpdate()
    return this
  }

  public deactivate(): StickyManager {
    if (this.$$activated) {
      this.$$window.removeEventListener('scroll', this.bulkUpdate)
      this.$$window.removeEventListener('resize', this.bulkPlaceholderUpdate)
      this.$$activated = false
    }
    return this
  }

  private bulkPlaceholderUpdate(): void {
    if (this.$$bulkUpdateRequestId) {
      this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId)
    }
    this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(
      (): void => {
        this.$$stickies.forEach(
          (instance): void => {
            instance.placeholder.update()
            instance.update()
          }
        )
      }
    )
  }
}

export const stickyManagerInstance = StickyManagerImpl.getInstance(window)
