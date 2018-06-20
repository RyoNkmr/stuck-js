/* @flow */
export default class Placeholder {
  original: HTMLElement;
  element: HTMLElement;
  cachedRect: ClientRect;
  observer: MutationObserver;
  onUpdate: () => mixed;
  initialComputedStyles: ?CSSStyleDeclaration;
  initiallyHidden: ?boolean;
  $$shouldPlacehold: boolean;

  get shouldPlacehold(): boolean {
    return this.$$shouldPlacehold;
  }

  set shouldPlacehold(value: boolean): void {
    if (this.shouldPlacehold === value) {
      return;
    }

    this.$$shouldPlacehold = value;
    this.update(true);
  }

  constructor(
    element: HTMLElement,
    placehold: boolean = true,
    observe: boolean = true,
    onUpdate: () => mixed = () => {},
  ) {
    this.onUpdate = typeof onUpdate === 'function' ? onUpdate : () => {};

    this.original = element;
    this.updateInitialComputedStyles();
    this.element = Placeholder.createPlaceholder();
    this.refrectInitialStyles();
    this.cachedRect = this.element && this.updateRect();
    this.shouldPlacehold = placehold;

    Placeholder.wrap(this.original, this.element);

    if (observe) {
      this.observer = Placeholder.createObserver(this.original, () => this.update());
    }
  }

  updateInitialComputedStyles() {
    if (this.initialComputedStyles) {
      throw new Error('[Stuck.js] updateInitialComputedStyles should not be called more than once.');
    }
    this.initialComputedStyles = window.getComputedStyle(this.original);
    this.initiallyHidden = this.initialComputedStyles.display === 'none';

    if (this.initiallyHidden) {
      const state = this.original.dataset.stuck;
      this.original.dataset.stuck = 'true';
      this.initialComputedStyles = window.getComputedStyle(this.original);
      this.original.dataset.stuck = state;
    }
  }

  refrectInitialStyles(): void {
    if (!this.initialComputedStyles) {
      return;
    }
    this.element.style.margin = this.initialComputedStyles.margin;
    this.element.style.minWidth = this.initialComputedStyles.minWidth;
    this.element.style.minHeight = this.initialComputedStyles.minHeight;
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      delete this.observer;
    }
    Placeholder.unwrap(this.original);
    delete this.element;
    delete this.original;
    delete this.cachedRect;
    delete this.onUpdate;
  }

  updateRect(): ClientRect {
    this.cachedRect = this.element.getBoundingClientRect();
    if (this.initiallyHidden) {
      const state = this.original.dataset.stuck;
      this.original.dataset.stuck = 'true';
      this.cachedRect = this.element.getBoundingClientRect();
      this.original.dataset.stuck = state;
    }
    return this.cachedRect;
  }

  applyStyles(forceUpdate: boolean = false): void {
    if (!this.original || !this.element) {
      return;
    }
    const originalRect: ClientRect = this.original.getBoundingClientRect();
    const widthChanged = originalRect.width !== this.cachedRect.width;
    const heightChanged = originalRect.height !== this.cachedRect.height;

    if (!forceUpdate && !widthChanged && !heightChanged) {
      return;
    }

    if (forceUpdate || widthChanged) {
      this.element.style.width = `${originalRect.width}px`;
    }

    if (forceUpdate || heightChanged) {
      this.element.style.height = `${originalRect.height}px`;
    }

    this.updateRect();
  }

  removeStyles(): void {
    if (!this.original || !this.element) {
      return;
    }
    this.element.style.width = '';
    this.element.style.height = '';
  }

  update(forceUpdate: boolean = false): void {
    if (this.shouldPlacehold) {
      this.applyStyles(forceUpdate);
    } else {
      this.removeStyles();
    }
    this.onUpdate();
  }

  static detectSizeMutation({ type }: MutationRecord): boolean {
    return type === 'childList' || type === 'attributes';
  }

  static createObserver(targetNode: ?HTMLElement, callback: () => mixed): MutationObserver {
    if (!targetNode) {
      throw new TypeError(`[Stuck.js] Could not create mutation observer on targetNode ${String(targetNode)}. This should be HTMLElement`);
    }

    const observer = new MutationObserver((mutations: Array<MutationRecord>) => {
      const isMutated = mutations.some(Placeholder.detectSizeMutation);
      if (isMutated) {
        callback();
      }
    });

    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
    });
    return observer;
  }

  static unwrap(target: HTMLElement): HTMLElement {
    const wrapper = target.parentNode;

    if (wrapper instanceof HTMLElement) {
      wrapper.insertAdjacentElement('beforebegin', target);
      const parent = wrapper.parentNode;

      if (parent instanceof HTMLElement) {
        parent.removeChild(wrapper);
      }
    }
    return target;
  }

  static wrap(target: HTMLElement, wrapper: HTMLElement): HTMLElement {
    if (target.parentNode !== wrapper) {
      target.insertAdjacentElement('beforebegin', wrapper);
      wrapper.appendChild(target);
    }
    return wrapper;
  }

  static createPlaceholder(): HTMLElement {
    return document.createElement('div');
  }
}
