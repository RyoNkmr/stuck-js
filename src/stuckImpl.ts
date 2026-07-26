import { join, registeredElements } from './stack'
import type { Sticky, StickyOptions } from './sticky'
import StickyImpl from './stickyImpl'
import type { ElementSource, StickySetting, Stuck } from './stuck'

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
    const registered = settings.reduce<Sticky[]>(
      (accumulator, setting): Sticky[] =>
        accumulator.concat(this.register(setting)),
      []
    )
    if (registered.length === 0) {
      return []
    }

    // 共有スタックに入らないものは、自分の marginTop の位置に固定されるだけで
    // 他の sticky の高さを積まない
    if (sharedStacking) {
      join(...registered)
    }

    this.$$instances = [...this.$$instances, ...registered]
    return registered
  }

  private register({ selector, element, ...options }: StickySetting): Sticky[] {
    const alreadyRegistered = registeredElements()
    return getElementsArrayFromSetting({ selector, element })
      .filter(target => !alreadyRegistered.includes(target))
      .map(
        (newElement): Sticky =>
          new StickyImpl(
            newElement,
            { ...this.$$defaultOptions, ...options },
            false
          )
      )
  }

  public get stickies(): readonly Sticky[] {
    return this.$$instances
  }

  public destroy(): void {
    // 各 sticky が自分でレジストリから抜けて再計算を促す
    for (const sticky of this.$$instances) {
      sticky.destroy()
    }
    this.$$instances = []
  }
}
