import type { Sticky } from './sticky'

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
    if (!StickyManagerImpl.$$instance) {
      StickyManagerImpl.$$instance = new StickyManagerImpl(_window)
    }
    return StickyManagerImpl.$$instance
  }

  public register(sticky: Sticky): StickyManager {
    this.$$stickies = [...this.$$stickies, sticky]
    return this
  }

  public unregister(sticky: Sticky): StickyManager {
    this.$$stickies = this.$$stickies.filter(instance => instance !== sticky)
    if (this.$$stickies.length < 1) {
      this.deactivate()
    }
    return this
  }

  public bulkUpdate(): StickyManager {
    this.scheduleUpdate(false)
    return this
  }

  public destroyAll(): StickyManager {
    for (const instance of this.$$stickies) {
      instance.destroy()
    }
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
    this.scheduleUpdate(true)
  }

  /** 更新は次のフレームまでまとめる。予約済みのものがあれば取り消して置き換える */
  private scheduleUpdate(withPlaceholder: boolean): void {
    if (this.$$bulkUpdateRequestId) {
      this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId)
    }
    this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(
      (): void => {
        for (const instance of this.$$stickies) {
          if (withPlaceholder) {
            instance.placeholder.update()
          }
          instance.update()
        }
      }
    )
  }
}

export const getStickyManagerInstance = (_window: Window): StickyManager =>
  StickyManagerImpl.getInstance(_window)
