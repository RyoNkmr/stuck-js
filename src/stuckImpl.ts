import { Stuck, StickySetting, SelectorOrElementOption } from './stuck'
import { StuckManager, stuckManagerInstance } from './stuckManager'
import { Sticky, StickyOptions } from './sticky'
import StickyImpl from './stickyImpl'

const getElementsArrayFromSetting = (
  option: SelectorOrElementOption
): HTMLElement[] => {
  if (option.element) {
    const { element } = option
    if (element instanceof HTMLElement) {
      return [element]
    }
    if (Array.isArray(element) || typeof element === 'object') {
      return Array.from(element)
    }
  }
  if (option.selector) {
    return Array.from(document.querySelectorAll(option.selector)).filter(
      (maybeHTMLElement): maybeHTMLElement is HTMLElement =>
        maybeHTMLElement instanceof HTMLElement
    )
  }
  throw new Error('[Stuck.js] No selector, element nor elements in setting')
}

export default class StuckImpl implements Stuck {
  private readonly $$defaultOptions!: StickyOptions
  private readonly $$manager: StuckManager = stuckManagerInstance.register(this)
  private $$instances: Sticky[] = []

  public constructor(
    settings: StickySetting[] | StickySetting = [],
    defaultOptions: StickyOptions = { observe: true },
    sharedStacking: boolean = true
  ) {
    this.$$defaultOptions = defaultOptions
    this.create(settings, sharedStacking)
  }

  public create(
    source: Readonly<StickySetting[] | StickySetting>,
    sharedStacking: boolean = true
  ): Sticky[] {
    const settings = Array.isArray(source) ? source : [source]
    const registered = settings.reduce(
      (accumulator: Sticky[], setting): Sticky[] => [
        ...accumulator,
        ...this.register(setting, sharedStacking),
      ],
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
    const stickies = getElementsArrayFromSetting(({
      selector,
      element,
    } as unknown) as SelectorOrElementOption)
      .filter((target): boolean => !registeredInstanceElements.includes(target))
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
