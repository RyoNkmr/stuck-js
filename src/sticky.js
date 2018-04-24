/* @flow */
import Placeholder from './placeholder';

export type StickyOptions = {
  marginTop: number,
  wrapper: HTMLElement,
  placehold: boolean,
};

export default class Sticky {
  element: HTMLElement;
  options: StickyOptions;
  placeholder: Class<Placeholder>;
  isSticky: ?boolean;

  static instances: Array<Class<Sticky>> = [];
  static activated: boolean = false;
  static bulkUpdateRequestId: ?number = null;

  get isSticky() {
    return this.element !== null && this.element.style.position === 'fixed';
  }

  set isSticky(value: boolean) {
    this.element.style.position = value ? 'fixed' : null;
    this.element.style.top = value ? `${this.options.marginTop}px` : null;
    this.element.style.left = value ? `${this.placeholder.element.getBoundingClientRect().left}px` : null;
  }

  get top() {
    return this.options.marginTop;
  }

  set top(value) {
    this.options.marginTop = value;
  }

  constructor(
    element: HTMLElement,
    options: StickyOptions,
    activate: boolean = true,
  ) {
    this.element = element;
    this.options = {
      marginTop: 0,
      wrapper: document.body,
      placehold: true,
      ...options,
    };
    this.placeholder = new Placeholder(element, this.options.placehold);

    Sticky.register(this);

    if (activate) {
      Sticky.activate();
    }
  }

  static register(instance: Class<Sticky>): void {
    Sticky.instances = [...Sticky.instances, instance];
  }

  static activate(): void {
    if (!Sticky.activated && Sticky.instances.length > 0) {
      window.addEventListener('scroll', Sticky.bulkUpdate);
      window.addEventListener('resize', Sticky.bulkPlaceholderUpdate);
      Sticky.activated = true;
      Sticky.bulkUpdate();
    }
  }

  static deactivate(): void {
    if (Sticky.activated) {
      window.removeEventListener('scroll', Sticky.bulkUpdate);
      window.removeEventListener('resize', Sticky.bulkPlaceholderUpdate);
      Sticky.activated = false;
    }
  }

  static bulkPlaceholderUpdate(): void {
    window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
    Sticky.bulkUpdateRequestId = window.requestAnimationFrame(() => {
      Sticky.instances.forEach((instance) => {
        instance.placeholder.update();
        instance.update();
      });
    });
  }

  static bulkUpdate(): void {
    window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
    Sticky.bulkUpdateRequestId = window.requestAnimationFrame(() => {
      Sticky.instances.forEach(instance => instance.update());
    });
  }

  update(): void {
    const rect = this.element.getBoundingClientRect();
    const placeholderRect = this.placeholder.element.getBoundingClientRect();

    if (!this.isSticky && rect.top <= this.options.marginTop) {
      this.isSticky = true;
      return;
    }

    if (this.isSticky) {
      if (placeholderRect.top >= 0) {
        this.isSticky = false;
        return;
      }
      if (rect.left !== placeholderRect.left) {
        this.element.style.left = `${placeholderRect.left}px`;
      }
    }
  }
}
