import Sticky, { Selector, StickyOptions } from './sticky';

type SelectorOrElementOption = { selector: Selector } & {
  element: HTMLElement | HTMLElement[];
};
type StickySetting = StickyOptions & SelectorOrElementOption;

const getElementsArrayBySetting = ({
  element,
  selector,
}: SelectorOrElementOption): HTMLElement[] => {
  if (element instanceof HTMLElement) {
    return [element];
  }
  if (Array.isArray(element) || typeof element === 'object') {
    return Array.from(element);
  }
  if (selector) {
    return Array.from(document.querySelectorAll(selector)).filter(
      (maybeHTMLElement): maybeHTMLElement is HTMLElement =>
        maybeHTMLElement instanceof HTMLElement
    );
  }
  throw new Error('[Stuck.js] No selector, element nor elements in setting');
};

export default class Stuck {
  static stackingStickies: Sticky[] = [];
  static registeredInstances: Sticky[] = [];

  defaultOptions!: StickyOptions;
  instances: Sticky[] = [];

  constructor(
    settings: StickySetting[] | StickySetting = [],
    defaultOptions: StickyOptions = { observe: true },
    sharedStacking: boolean = true
  ) {
    this.defaultOptions = defaultOptions;
    this.create(settings, sharedStacking);
  }

  create(
    source: Array<StickySetting> | StickySetting,
    sharedStacking: boolean = true
  ): Sticky[] {
    const settings = Array.isArray(source) ? source : [source];
    const registered = settings.reduce(
      (accumulator: Sticky[], setting) => [
        ...accumulator,
        ...this.register(setting, sharedStacking),
      ],
      []
    );
    if (registered.length === 0) {
      return [];
    }
    Stuck.updateAndSort();
    Sticky.activate();
    return registered;
  }

  register(
    { selector, element, ...options }: StickySetting,
    sharedStacking: boolean = true
  ): Sticky[] {
    const stickies = getElementsArrayBySetting({
      selector,
      element,
    })
      .filter(
        (target: HTMLElement) =>
          !Stuck.registeredInstances
            .map(instance => instance.element)
            .includes(target)
      )
      .map(
        (newElement: HTMLElement) =>
          new Sticky(
            newElement,
            { ...this.defaultOptions, ...options },
            false,
            Stuck.updateAndSort
          )
      );

    Stuck.registeredInstances = [...Stuck.registeredInstances, ...stickies];
    this.instances = [...this.instances, ...stickies];

    if (sharedStacking) {
      Stuck.stackingStickies = [...Stuck.stackingStickies, ...stickies];
    }
    return stickies;
  }

  destroy(): void {
    Stuck.registeredInstances = Stuck.registeredInstances.filter(
      registered => !this.instances.includes(registered)
    );
    Stuck.stackingStickies = Stuck.stackingStickies.filter(
      stacking => !this.instances.includes(stacking)
    );
    if (Stuck.registeredInstances.length > 0) {
      Stuck.updateAndSort();
    }
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }

  static updateAndSort(): void {
    Stuck.update();
    Stuck.registeredInstances.sort(
      (before, after) =>
        before.placeholder.cachedRect.top - after.placeholder.cachedRect.top
    );
  }

  static update(): void {
    [...Stuck.stackingStickies]
      .filter((instance, index, all) => all.indexOf(instance) === index)
      .map(instance => ({
        instance,
        rect: instance.placeholder.updateRect(),
      }))
      .sort(({ rect: before }, { rect: after }) => before.top - after.top)
      .reduce((ceiling, { instance }) => {
        instance.marginTop = instance.options.marginTop + ceiling;
        return instance.rect.height + instance.marginTop;
      }, 0);
    Sticky.bulkUpdate();
  }
}
