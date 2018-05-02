/* @flow */
import Sticky, { StickyOptions } from './sticky';

type StickySetting = StickyOptions & {
  selector: string,
};

export default class Stuck {
  instances: Array<Class<Sticky>>;

  constructor(settings: Array<StickySetting> = [], defaultOptions: StuckOptions = {}) {
    this.defaultOptions = defaultOptions;
    this.instances = [];
    this.create(settings);
  }

  create(settings: Array<StickySetting>) {
    settings.forEach(setting => this.register(setting));
    this.updateStickies();
    Sticky.activate();
  }

  register({ selector, ...options }: StickySetting): void {
    const registeredElements = this.instances.map(instance => instance.element);
    const stickies = Array.from(document.querySelectorAll(selector))
      .filter(element => !registeredElements.includes(element))
      .map(node => (
        new Sticky(node, { ...this.defaultOptions, ...options }, false)
      ));
    this.instances = [...this.instances, ...stickies];
  }

  destroy() {
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }

  updateStickies(): void {
    const { instances: updated } = this.instances
      .map(instance => ({ instance, rect: instance.element.getBoundingClientRect() }))
      .sort(({ rect: before }, { rect: after }) => before.top > after.top)
      .reduce(({ ceiling, instances }, { instance, rect }) => {
        instance.options.marginTop += ceiling;
        return {
          ceiling: rect.height + instance.options.marginTop,
          instances: [...instances, instance],
        };
      }, { ceiling: 0, instances: [] });
    this.instances = updated;
  }
}
