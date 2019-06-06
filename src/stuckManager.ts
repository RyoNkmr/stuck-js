import { Stuck } from './stuck'
import { Sticky } from './sticky'
import { getStickyManagerInstance } from './stickyManager'
import { stableSort } from './utility'

export interface StuckManager {
  stickies: readonly Sticky[]
  stickyElements: readonly HTMLElement[]
  stackingStickies: readonly Sticky[]
  register(stuck: Stuck): StuckManager
  unregister(stuck: Stuck): StuckManager
  addStickies(stacking: boolean, ...stickies: Sticky[]): StuckManager
  destroyStickies(...stickies: Sticky[]): StuckManager
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
    if (!this.$$instance) {
      this.$$instance = new StuckManagerImpl(_window)
    }
    return this.$$instance
  }

  public register(stuck: Stuck): StuckManager {
    this.$$stucks = [...this.$$stucks, stuck]
    return this
  }

  public unregister(stuck: Stuck): StuckManager {
    this.destroyStickies(...stuck.stickies)
    this.$$stucks = this.$$stucks.filter(
      (instance): boolean => instance !== stuck
    )
    return this
  }

  public get stickies(): readonly Sticky[] {
    return this.$$stickies
  }

  public get stickyElements(): readonly HTMLElement[] {
    return this.$$stickies.map((sticky): HTMLElement => sticky.element)
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
    stickies.forEach((instance): void => instance.destroy())
    this.$$stickies = this.$$stickies.filter(
      (sticky): boolean => !stickies.includes(sticky)
    )
    this.$$stackingStickies = this.$$stackingStickies.filter(
      (sticky): boolean => !stickies.includes(sticky)
    )
    if (this.$$stackingStickies.length > 0) {
      this.update()
    }
    return this
  }

  public update(): StuckManager {
    interface StuckUpdateSource {
      instance: Sticky
      rect: ClientRect
    }
    interface StuckSortingAccumulator {
      instances: Sticky[]
      ceiling: ClientRect['top']
    }
    this.$$stackingStickies = this.stackingStickies
      .filter(
        (instance, index, all): boolean => all.indexOf(instance) === index
      )
      .map(
        (instance): StuckUpdateSource => ({
          instance,
          rect: instance.placeholder.updateRect(),
        })
      )
      .sort(
        ({ rect: before }, { rect: after }): ClientRect['top'] =>
          before.top - after.top
      )
      .reduce(
        (
          { instances, ceiling }: StuckSortingAccumulator,
          { instance }
        ): StuckSortingAccumulator => {
          instance.marginTop = instance.options.marginTop + ceiling
          return {
            instances: [...instances, instance],
            ceiling: instance.rect.height + instance.marginTop,
          }
        },
        { instances: [], ceiling: 0 }
      ).instances

    getStickyManagerInstance(this.$$window).bulkUpdate()

    this.$$stickies = stableSort(
      this.stickies,
      (before: Sticky, after: Sticky): number =>
        before.placeholder.cachedRect.top - after.placeholder.cachedRect.top
    )

    return this
  }
}

export const getStuckManagerInstance = (_window: Window): StuckManager =>
  StuckManagerImpl.getInstance(_window)
