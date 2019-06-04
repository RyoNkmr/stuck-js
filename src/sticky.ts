import Placeholder from './placeholder';

type MaybeHTMLElement = HTMLElement | Element | null | void;
export type Selector = string;
type SelectorOrElement = Selector | HTMLElement;

type PartialRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export type StickyOptions = {
  marginTop?: number;
  wrapper?: SelectorOrElement;
  observe: boolean;
};

export default class Sticky {
  element: HTMLElement;
  options: PartialRequired<StickyOptions, 'marginTop'>;
  placeholder: Placeholder;
  marginTop: number = 0;
  isStickToBottom: boolean = false;
  rect: ClientRect;
  floor?: number;

  private $$wrapper!: HTMLElement;
  private $$additionalTop?: number;

  static instances: Sticky[] = [];
  static activated: boolean = false;
  static bulkUpdateRequestId: number | null = null;

  get isSticky(): boolean {
    return this.element !== null && this.element.style.position === 'fixed';
  }

  set isSticky(value: boolean) {
    if (this.placeholder) {
      this.placeholder.shouldPlacehold = value;
    }
    this.element.dataset.stuck = value ? value.toString() : '';
    this.element.style.position = value ? 'fixed' : '';
    this.element.style.top = value ? `${this.top}px` : '';
    this.element.style.left = value
      ? `${this.placeholder.updateRect().left}px`
      : '';
    if (value) {
      this.computePositionTopFromRect();
    }
  }

  get top(): number {
    return this.$$additionalTop || this.$$additionalTop === 0
      ? this.$$additionalTop
      : this.marginTop;
  }

  set top(value: number) {
    this.$$additionalTop = value;
    this.element.style.top = value ? `${value}px` : `${this.marginTop}px`;
  }

  get wrapper(): HTMLElement {
    return this.$$wrapper;
  }

  private setWrapperFromSelectorOrElement(
    selectorOrElement?: SelectorOrElement
  ) {
    if (!(document.body instanceof HTMLElement)) {
      throw new TypeError(
        '[Stuck.js] document.body is not HTMLElement in this environment'
      );
    }
    const parent = (
      (this.placeholder && this.placeholder.element) ||
      this.element
    ).parentElement;
    this.$$wrapper = Sticky.normalizeElement(
      selectorOrElement,
      parent,
      document.body
    );
    this.floor = Sticky.computeAbsoluteFloor(this.$$wrapper);
    this.options.wrapper = this.$$wrapper;
  }

  constructor(
    element: HTMLElement,
    options: StickyOptions = { observe: true },
    activate: boolean = true,
    onUpdate: () => void = () => {}
  ) {
    if (!element) {
      throw new Error('[Stuck-js] Invalid element given');
    }
    this.element = element;
    this.rect = this.element.getBoundingClientRect();
    this.options = {
      marginTop: 0,
      ...options,
    };
    this.marginTop = this.options.marginTop || 0;
    this.setWrapperFromSelectorOrElement(this.options.wrapper);
    this.placeholder = new Placeholder(
      this.element,
      this.options.observe || true,
      onUpdate || Sticky.bulkUpdate
    );
    this.element.dataset.stuck = '';
    Sticky.register(this);

    if (activate) {
      Sticky.activate();
    }

    this.placeholder.shouldPlacehold = this.isSticky;
  }

  static computeAbsoluteFloor(target: HTMLElement): number {
    const absoluteBottom =
      target.getBoundingClientRect().bottom + window.pageYOffset;
    const { paddingBottom } = window.getComputedStyle(target);
    const paddingBottomPixels =
      paddingBottom !== null ? parseInt(paddingBottom, 10) : 0;
    return absoluteBottom - paddingBottomPixels;
  }

  static normalizeElement(
    value?: SelectorOrElement,
    ...fallbacks: MaybeHTMLElement[]
  ): HTMLElement {
    if (value && value instanceof HTMLElement) {
      return value;
    }

    const element = [value && document.querySelector(value), ...fallbacks].find(
      (item): item is HTMLElement => !!item && item instanceof HTMLElement
    );

    if (element instanceof HTMLElement) {
      return element;
    }

    throw new TypeError('[Stuck-js] Could not find HTMLElement');
  }

  static register(instance: Sticky): void {
    Sticky.instances = [...Sticky.instances, instance];
  }

  destroy(): void {
    this.isSticky = false;
    this.placeholder.destroy();
    Sticky.instances = Sticky.instances.filter(instance => instance !== this);
    delete this.placeholder;
    delete this.element;
    delete this.options;
    if (Sticky.instances.length < 1) {
      Sticky.deactivate();
    }
  }

  static destroyAll(): void {
    Sticky.instances.forEach(instance => instance.destroy());
  }

  static activate(): void {
    if (!Sticky.activated && Sticky.instances.length > 0) {
      window.addEventListener('scroll', Sticky.bulkUpdate);
      window.addEventListener('resize', Sticky.bulkPlaceholderUpdate);
      Sticky.activated = true;
    }
    Sticky.bulkUpdate();
  }

  static deactivate(): void {
    if (Sticky.activated) {
      window.removeEventListener('scroll', Sticky.bulkUpdate);
      window.removeEventListener('resize', Sticky.bulkPlaceholderUpdate);
      Sticky.activated = false;
    }
  }

  static bulkPlaceholderUpdate(): void {
    if (Sticky.bulkUpdateRequestId) {
      window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
    }
    Sticky.bulkUpdateRequestId = window.requestAnimationFrame(() => {
      Sticky.instances.forEach(instance => {
        instance.placeholder.update();
        instance.update();
      });
    });
  }

  static bulkUpdate(): void {
    if (Sticky.bulkUpdateRequestId) {
      window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
    }
    Sticky.bulkUpdateRequestId = window.requestAnimationFrame(() => {
      Sticky.instances.forEach(instance => instance.update());
    });
  }

  computePositionTopFromRect(
    rect: ClientRect = this.element.getBoundingClientRect()
  ) {
    this.rect = rect;
    this.floor = Sticky.computeAbsoluteFloor(this.wrapper);

    const relativeFloor = (this.floor || 0) - window.pageYOffset;

    if (this.rect.bottom >= relativeFloor && !this.isStickToBottom) {
      this.top = relativeFloor - this.rect.height;
      this.isStickToBottom = true;
      return;
    }

    if (!this.isStickToBottom) {
      return;
    }

    if (this.rect.top >= this.marginTop) {
      this.top = this.marginTop;
      this.isStickToBottom = false;
      return;
    }

    if (this.rect.top < this.marginTop) {
      this.top = relativeFloor - this.rect.height;
    }
  }

  update(): void {
    const placeholderRect = this.placeholder.element.getBoundingClientRect();

    if (!this.isSticky && this.marginTop > placeholderRect.top) {
      this.isSticky = true;
      return;
    }

    if (this.isSticky) {
      if (placeholderRect.top >= this.marginTop) {
        this.isSticky = false;
        return;
      }

      this.rect = this.element.getBoundingClientRect();
      if (this.rect.left !== placeholderRect.left) {
        this.element.style.left = `${placeholderRect.left}px`;
      }

      this.computePositionTopFromRect(this.rect);
    }
  }
}
