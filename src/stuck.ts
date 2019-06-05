import Sticky, { Selector, StickyOptions } from './sticky'

interface SelectorOption {
  selector: Selector
  element?: undefined
}
interface ElementOption {
  element: HTMLElement | HTMLElement[]
  selector?: undefined
}
type SelectorOrElementOption = SelectorOption | ElementOption
type StickySetting = StickyOptions & SelectorOrElementOption

const getElementsArrayBySetting = (
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

export default class Stuck {
  private defaultOptions!: StickyOptions
  private instances: Sticky[] = []

  private static stackingStickies: Sticky[] = []
  private static registeredInstances: Sticky[] = []

  public constructor(
    settings: StickySetting[] | StickySetting = [],
    defaultOptions: StickyOptions = { observe: true },
    sharedStacking: boolean = true
  ) {
    this.defaultOptions = defaultOptions
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
    Stuck.updateAndSort()
    Sticky.activate()
    return registered
  }

  private register(
    { selector, element, ...options }: StickySetting,
    sharedStacking: boolean = true
  ): Sticky[] {
    const registeredInstanceElements: HTMLElement[] = Stuck.registeredInstances.map(
      (instance): HTMLElement => instance.element
    )
    const stickies = getElementsArrayBySetting(({
      selector,
      element,
    } as unknown) as SelectorOrElementOption)
      .filter((target): boolean => !registeredInstanceElements.includes(target))
      .map(
        (newElement): Sticky =>
          new Sticky(
            newElement,
            { ...this.defaultOptions, ...options },
            false,
            Stuck.updateAndSort
          )
      )

    Stuck.registeredInstances = [...Stuck.registeredInstances, ...stickies]
    this.instances = [...this.instances, ...stickies]

    if (sharedStacking) {
      Stuck.stackingStickies = [...Stuck.stackingStickies, ...stickies]
    }
    return stickies
  }

  public destroy(): void {
    Stuck.registeredInstances = Stuck.registeredInstances.filter(
      (registered): boolean => !this.instances.includes(registered)
    )
    Stuck.stackingStickies = Stuck.stackingStickies.filter(
      (stacking): boolean => !this.instances.includes(stacking)
    )
    if (Stuck.registeredInstances.length > 0) {
      Stuck.updateAndSort()
    }
    this.instances.forEach((instance): void => instance.destroy())
    this.instances = []
  }

  private static updateAndSort(): void {
    Stuck.update()
    Stuck.registeredInstances.sort(
      (before, after): number =>
        before.placeholder.cachedRect.top - after.placeholder.cachedRect.top
    )
  }

  public static update(): void {
    interface StuckUpdateSource {
      instance: Sticky
      rect: ClientRect
    }
    ;[...Stuck.stackingStickies]
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
      .reduce((ceiling, { instance }): ClientRect['top'] => {
        instance.marginTop = instance.options.marginTop + ceiling
        return instance.rect.height + instance.marginTop
      }, 0)
    Sticky.bulkUpdate()
  }
}
