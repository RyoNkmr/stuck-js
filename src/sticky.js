/* @flow */
import throttle from 'lodash.throttle';
import Placeholder from './placeholder';

type StickyOptions = {
  marginTop: number,
  wrapper: HTMLElement,
  placehold: boolean,
};

export default class Sticky {
  element: HTMLElement;
  options: StickyOptions;
  placeholder: Class<Placeholder>;
  isSticky: ?boolean;

  static instances = [];
  static activated = false;

  get isSticky() {
    return this.element !== null && this.element.style.position === 'fixed';
  }

  set isSticky(value: boolean) {
    this.element.style.position = value ? 'fixed' : null;
    this.element.style.top = value ? `${this.options.marginTop}px` : null;
    this.element.style.left = value ? `${this.placeholder.element.getBoundingClientRect().left}px` : null;
  }

  constructor(
    element: HTMLElement,
    options: StickyOptions = {
      marginTop: 0,
      wrapper: document.body,
      placehold: true,
    },
    activate: boolean = true,
  ) {
    this.element = element;
    this.options = options;
    this.placeholder = new Placeholder(element, options.placehold);

    Sticky.register(this);

    if (activate) {
      Sticky.activate(this);
    }
  }

  static register(instance: Class<Sticky>): void {
    Sticky.instances = [...Sticky.instances, instance];
  }

  static activate(): void {
    if (!Sticky.activated) {
      window.addEventListener('scroll', Sticky.bulkUpdate);
      Sticky.activated = true;
    }
  }

  static deactivate(): void {
    if (Sticky.activated) {
      window.removeEventListener('scroll', Sticky.bulkUpdate);
      Sticky.activated = false;
    }
  }

  static bulkUpdate: void = throttle(() => {
    Sticky.instances.forEach(instance => instance.update());
  }, 16);

  update(): void {
    const rect = this.element.getBoundingClientRect();
    const placeholderRect = this.placeholder.element.getBoundingClientRect();

    if (!this.isSticky && rect.top <= this.options.marginTop) {
      this.isSticky = true;
      return;
    }

    if (this.isSticky) {
      if (window.pageYOffset <= placeholderRect.top) {
        this.isSticky = false;
      }
      if (window.pageXOffset > 0) {
        this.element.style.left = `${placeholderRect.left}px`;
      }
    }
  }
}
