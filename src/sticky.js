/* @flow */
import Placeholder from './placeholder';

export type StickyOptions = {
  marginTop: number,
  wrapper: HTMLElement | string,
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

  set isSticky(value: boolean): boolean {
    if (value) {
      this.computePositionTopByRect(this.element.getBoundingClientRect());
    }
    this.element.style.position = value ? 'fixed' : null;
    this.element.style.top = value ? `${this.top}px` : null;
    this.element.style.left = value ? `${this.placeholder.element.getBoundingClientRect().left}px` : null;
    return value;
  }

  get top(): number {
    return (this.$$additionalTop || this.$$additionalTop === 0)
      ? this.$$additionalTop
      : this.options.marginTop;
  }

  set top(value: number): number {
    this.$$additionalTop = value;
    this.element.style.top = value ? `${value}px` : `${this.options.marginTop}px`;
    return value;
  }

  get floor(): number {
    return this.$$floor || 0;
  }

  get wrapper(): HTMLElement {
    return this.$$wrapper;
  }

  set wrapper(value: HTMLElement): HTMLElement {
    this.$$wrapper = typeof value === 'string'
      ? document.querySelector(value)
      : (value || document.body);
    this.$$floor = Sticky.computeAbsoluteFloor(this.$$wrapper);
    this.options.wrapper = this.$$wrapper;
    return this.$$wrapper;
  }

  constructor(
    element: HTMLElement,
    options: StickyOptions = {},
    activate: boolean = true,
  ) {
    this.element = element;
    this.options = {
      marginTop: 0,
      placehold: true,
      ...options,
    };
    this.wrapper = this.options.wrapper;
    this.placeholder = new Placeholder(element, this.options.placehold);

    Sticky.register(this);

    if (activate) {
      Sticky.activate();
    }
  }

  static computeAbsoluteFloor(target: HTMLElement): number {
    const { bottom } = target.getBoundingClientRect();
    const { paddingBottom } = window.getComputedStyle(target);
    const paddingBottomPixels = parseInt(paddingBottom, 10) || 0;
    return bottom - paddingBottomPixels;
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

  computePositionTopByRect(rect: DOMRect) {
    const relativeFloor = this.floor - global.pageYOffset;
    if (rect.bottom > relativeFloor) {
      this.top = relativeFloor - rect.height;
      return;
    }

    if (this.top === this.options.marginTop) {
      return;
    }

    if (this.top < this.options.marginTop) {
      this.top = relativeFloor - rect.height;
      return;
    }
    this.top = null;
  }

  update(): void {
    const placeholderRect = this.placeholder.element.getBoundingClientRect();

    if (!this.isSticky && placeholderRect.top <= this.options.marginTop) {
      this.isSticky = true;
      return;
    }

    if (this.isSticky) {
      if (placeholderRect.top >= this.options.marginTop) {
        this.isSticky = false;
        return;
      }

      const rect = this.element.getBoundingClientRect();
      if (rect.left !== placeholderRect.left) {
        this.element.style.left = `${placeholderRect.left}px`;
      }

      this.computePositionTopByRect(rect);
    }
  }
}
