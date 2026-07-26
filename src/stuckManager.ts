import type { Sticky } from './sticky'
import { getStickyManagerInstance } from './stickyManager'
import type { Stuck } from './stuck'

export interface StuckManager {
  stickies: readonly Sticky[]
  stickyElements: readonly HTMLElement[]
  stackingStickies: readonly Sticky[]
  register(stuck: Stuck): StuckManager
  unregister(stuck: Stuck): StuckManager
  addStickies(stacking: boolean, ...stickies: Sticky[]): StuckManager
  destroyStickies(...stickies: Sticky[]): StuckManager
  destroyAll(): StuckManager
  update(): StuckManager
}

class StuckManagerImpl implements StuckManager {
  private static $$instance: StuckManager
  private $$stucks: Stuck[] = []
  private $$stickies: Sticky[] = []
  private $$stackingStickies: Sticky[] = []
  private $$window: Window

  private constructor(_window: Window) {
    this.$$window = _window
  }

  public static getInstance(_window: Window): StuckManager {
    if (!StuckManagerImpl.$$instance) {
      StuckManagerImpl.$$instance = new StuckManagerImpl(_window)
    }
    return StuckManagerImpl.$$instance
  }

  public register(stuck: Stuck): StuckManager {
    this.$$stucks = [...this.$$stucks, stuck]
    return this
  }

  public unregister(stuck: Stuck): StuckManager {
    this.destroyStickies(...stuck.stickies)
    this.$$stucks = this.$$stucks.filter(instance => instance !== stuck)
    return this
  }

  public get stickies(): readonly Sticky[] {
    return this.$$stickies
  }

  public get stickyElements(): readonly HTMLElement[] {
    return this.$$stickies.map(sticky => sticky.element)
  }

  public get stackingStickies(): readonly Sticky[] {
    return this.$$stackingStickies
  }

  public addStickies(stacking: boolean, ...stickies: Sticky[]): StuckManager {
    this.$$stickies = [...this.$$stickies, ...stickies]
    if (stacking) {
      this.$$stackingStickies = [...this.$$stackingStickies, ...stickies]
    }
    getStickyManagerInstance(this.$$window).activate()
    return this
  }

  public destroyStickies(...stickies: Sticky[]): StuckManager {
    for (const instance of stickies) {
      instance.destroy()
    }
    this.$$stickies = this.$$stickies.filter(
      sticky => !stickies.includes(sticky)
    )
    this.$$stackingStickies = this.$$stackingStickies.filter(
      sticky => !stickies.includes(sticky)
    )
    if (this.$$stackingStickies.length > 0) {
      this.update()
    }
    return this
  }

  /** 登録済みの Stuck と Sticky をすべて破棄し、シングルトンを初期状態に戻す */
  public destroyAll(): StuckManager {
    this.destroyStickies(...this.$$stickies)
    this.$$stucks = []
    this.$$stickies = []
    this.$$stackingStickies = []
    getStickyManagerInstance(this.$$window).destroyAll()
    return this
  }

  public update(): StuckManager {
    const sorted = Array.from(new Set(this.stackingStickies))
      .map(instance => ({
        instance,
        rect: instance.placeholder.updateRect(),
      }))
      .sort((before, after) => before.rect.top - after.rect.top)

    // 上にあるものから順に、直前の要素の下端を次の要素の marginTop に積む
    let ceiling = 0
    const stacking: Sticky[] = []
    for (const { instance } of sorted) {
      instance.marginTop = instance.options.marginTop + ceiling
      ceiling = instance.rect.height + instance.marginTop
      stacking.push(instance)
    }
    this.$$stackingStickies = stacking

    getStickyManagerInstance(this.$$window).bulkUpdate()

    // Array.prototype.sort は ES2019 以降、安定ソートが保証されている
    this.$$stickies = [...this.stickies].sort(
      (before, after) =>
        before.placeholder.cachedRect.top - after.placeholder.cachedRect.top
    )

    return this
  }
}

export const getStuckManagerInstance = (_window: Window): StuckManager =>
  StuckManagerImpl.getInstance(_window)
