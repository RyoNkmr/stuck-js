/* @flow */
import Sticky, { StickyOptions } from './sticky';

type StickySetting = {
  selector: string,
  options: ?StickyOptions,
}

export default class Stuck {
  instances: Array<Class<Sticky>>;

  constructor(settings: Array<StickySetting> = [], defaultOptions: StuckOptions = {}) {
    this.defaultOptions = defaultOptions;
    this.instances = [];
    settings.forEach(setting => this.register(setting));
    this.updateStickies();
    Sticky.activate();
  }

  register({ selector, options }: StickySetting): void {
    const stickies = Array.from(document.querySelectorAll(selector), node => (
      new Sticky(node, { ...this.defaultOptions, ...options }, false)
    ));
    this.instances = [...this.instances, ...stickies];
  }

  updateStickies(): void {
    const { instances: updated } = this.instances
      .map(instance => ({ instance, rect: instance.element.getBoundingClientRect() }))
      .sort(({ rect: before }, { rect: after }) => before.top > after.top)
      .reduce(({ ceiling, instances }, { instance, rect }) => {
        instance.top += ceiling;
        return {
          ceiling: rect.height + instance.top,
          instances: [...instances, instance],
        };
      }, { ceiling: 0, instances: [] });
    this.instances = updated;
  }
}
