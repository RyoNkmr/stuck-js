import type { Sticky, StickyOptions } from './sticky'
import StickyImpl from './stickyImpl'
import type { ElementSource, StickySetting, Stuck } from './stuck'
import { getStuckManagerInstance, type StuckManager } from './stuckManager'

const getElementsArrayFromSetting = ({
  selector,
  element,
}: ElementSource): HTMLElement[] => {
  if (element) {
    return element instanceof HTMLElement ? [element] : Array.from(element)
  }
  if (selector) {
    // querySelectorAll は SVGElement なども拾うため HTMLElement に絞る
    return Array.from(document.querySelectorAll(selector)).filter(
      (maybeHTMLElement): maybeHTMLElement is HTMLElement =>
        maybeHTMLElement instanceof HTMLElement
    )
  }
  throw new Error('[Stuck.js] No selector, element nor elements in setting')
}

export default class StuckImpl implements Stuck {
  private readonly $$defaultOptions: StickyOptions
  private readonly $$manager: StuckManager
  private $$instances: Sticky[] = []

  public constructor(
    settings: StickySetting[] | StickySetting = [],
    defaultOptions: StickyOptions = { observe: true },
    sharedStacking: boolean = true
  ) {
    this.$$manager = getStuckManagerInstance(window).register(this)
    this.$$defaultOptions = defaultOptions
    this.create(settings, sharedStacking)
  }

  public create(
    source: Readonly<StickySetting[] | StickySetting>,
    sharedStacking: boolean = true
  ): Sticky[] {
    const settings = Array.isArray(source) ? source : [source]
    const registered = settings.reduce<Sticky[]>(
      (accumulator, setting): Sticky[] =>
        accumulator.concat(this.register(setting, sharedStacking)),
      []
    )
    if (registered.length === 0) {
      return []
    }
    this.$$manager.update()
    return registered
  }

  private register(
    { selector, element, ...options }: StickySetting,
    sharedStacking: boolean = true
  ): Sticky[] {
    const registeredInstanceElements = this.$$manager.stickyElements
    const stickies = getElementsArrayFromSetting({ selector, element })
      .filter(target => !registeredInstanceElements.includes(target))
      .map(
        (newElement): Sticky =>
          new StickyImpl(
            newElement,
            { ...this.$$defaultOptions, ...options },
            false,
            (): void => {
              this.$$manager.update()
            }
          )
      )

    this.$$manager.addStickies(sharedStacking, ...stickies)
    this.$$instances = [...this.$$instances, ...stickies]
    return stickies
  }

  public get stickies(): readonly Sticky[] {
    return this.$$instances
  }

  public destroy(): void {
    this.$$manager.unregister(this)
    this.$$instances = []
  }
}
