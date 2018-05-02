/* @flow */
import Sticky, { Stickies, StickyOptions } from './sticky';

type StickySetting = StickyOptions & {
  selector: string,
};

export default class Stuck {
  static stackingInstances: Stickies = [];
  static registeredInstances: Stickies = [];
  instances: Array<Class<Sticky>>;

  constructor(
    settings: Array<StickySetting> = [],
    defaultOptions: StuckOptions = {},
    sharedStacking = true,
  ) {
    this.defaultOptions = defaultOptions;
    this.instances = [];
    this.create(settings, sharedStacking);
  }

  create(source: Array<StickySetting>|StickySetting, sharedStacking = true) {
    const settings = Array.isArray(source) ? source : [source];
    const registered = settings.reduce((accumulator, setting) => (
      [...accumulator, ...this.register(setting, sharedStacking)]
    ), []);
    Stuck.updateAndSort(registered);
    Sticky.activate();
  }

  register({ selector, ...options }: StickySetting, sharedStacking = true): Stickies {
    const targetElements = [...document.querySelectorAll(selector)]
      .filter(target => !Stuck.registeredInstances.map(({ element }) => element).includes(target));
    if (targetElements.length < 1) {
      return [];
    }
    const stickies = targetElements.map(node => (
      new Sticky(node, { ...this.defaultOptions, ...options }, false)
    ));
    Stuck.registeredInstances = [...Stuck.registeredInstances, ...stickies];
    this.instances = [...this.instances, ...stickies];

    if (sharedStacking) {
      Stuck.stackingInstances = [...Stuck.stackingInstances, ...stickies];
    }
    return stickies;
  }

  destroy():void {
    Stuck.registeredInstances = Stuck.registeredInstances.filter(registered => (
      !this.instances.includes(registered)
    ));
    Stuck.stackingInstances = Stuck.stackingInstances.filter(stacking => (
      !this.instances.includes(stacking)
    ));
    if (Stuck.registeredInstances.length > 0) {
      Stuck.updateAndSort(Stuck.registeredInstances);
    }
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }

  static updateAndSort(instances: Stickies) {
    Stuck.update(instances);
    instances.sort((before, after) => (
      before.placeholder.cachedRect.top > after.placeholder.cachedRect.top
    ));
  }

  static update(instances: Stickies): void {
    [...Stuck.stackingInstances, ...instances]
      .reduce((unique, instance) => (
        unique.includes(instance) ? unique : [...unique, instance]
      ), [])
      .map(instance => ({
        instance,
        rect: instance.placeholder.updateRect(),
      }))
      .sort(({ rect: before }, { rect: after }) => before.top > after.top)
      .reduce((ceiling, { instance, rect }) => {
        instance.marginTop = instance.options.marginTop + ceiling;
        return rect.height + instance.marginTop;
      }, 0);
    Sticky.bulkUpdate();
  }
}
