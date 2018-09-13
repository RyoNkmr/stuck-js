/* @flow */
import Sticky from './sticky';
import type { Stickies, StickyOptions } from './sticky';

type StickySetting = StickyOptions & {
  selector: ?string,
  elements: ?HTMLElement[],
  element: ?HTMLElement,
};

const getElementsArrayBySetting = ({ element, elements, selector }) => {
  if (element) return [element];
  if (elements) return [...elements];
  if (selector) return [...document.querySelectorAll(selector)];
  throw new Error('[Stuck.js] No selector, element nor elements in setting');
};

export default class Stuck {
  static stackingInstances: Stickies = [];
  static registeredInstances: Stickies = [];

  defaultOptions: StickyOptions;
  instances: Stickies = [];

  constructor(
    settings: StickySetting[] | StickySetting = [],
    defaultOptions: StickyOptions = { observe: true },
    sharedStacking: boolean = true,
  ) {
    this.defaultOptions = defaultOptions;
    this.create(settings, sharedStacking);
  }

  create(source: Array<StickySetting>|StickySetting, sharedStacking: boolean = true): Stickies {
    const settings = Array.isArray(source) ? source : [source];
    const registered = settings.reduce((accumulator, setting) => (
      [...accumulator, ...this.register(setting, sharedStacking)]
    ), []);
    if (registered.length === 0) {
      return [];
    }
    Stuck.updateAndSort();
    Sticky.activate();
    return registered;
  }

  register({
    selector, element, elements, ...options
  }: StickySetting, sharedStacking: boolean = true): Stickies {
    const targetElements = getElementsArrayBySetting({ selector, element, elements })
      .filter(target => !Stuck.registeredInstances.map(instance => instance.element)
        .includes(target));

    if (targetElements.length < 1) {
      return [];
    }
    const stickies = targetElements.map(node => (
      new Sticky(node, { ...this.defaultOptions, ...options }, false, Stuck.updateAndSort)
    ));

    Stuck.registeredInstances = [...Stuck.registeredInstances, ...stickies];
    this.instances = [...this.instances, ...stickies];

    if (sharedStacking) {
      Stuck.stackingInstances = [...Stuck.stackingInstances, ...stickies];
    }
    return stickies;
  }

  destroy(): void {
    Stuck.registeredInstances = Stuck.registeredInstances.filter(registered => (
      !this.instances.includes(registered)
    ));
    Stuck.stackingInstances = Stuck.stackingInstances.filter(stacking => (
      !this.instances.includes(stacking)
    ));
    if (Stuck.registeredInstances.length > 0) {
      Stuck.updateAndSort();
    }
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }

  static updateAndSort(): void {
    Stuck.update();
    Stuck.registeredInstances.sort((before, after) => (
      before.placeholder.cachedRect.top - after.placeholder.cachedRect.top
    ));
  }

  static update(): void {
    [...Stuck.stackingInstances]
      .reduce((unique, instance) => (
        unique.includes(instance) ? unique : [...unique, instance]
      ), [])
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
