/* @flow */
export default class Placeholder {
  original: HTMLElement;
  element: HTMLElement;
  cachedRect: ClientRect;
  observer: MutationObserver;
  onUpdate: () => mixed;

  constructor(
    element: HTMLElement,
    placehold: boolean = true,
    observe: boolean = true,
    onUpdate: () => mixed = () => {},
  ) {
    this.original = element;
    this.element = Placeholder.createPlaceholder(element, placehold);

    Placeholder.wrap(this.original, this.element);
    this.cachedRect = this.element && this.element.getBoundingClientRect();
    this.onUpdate = onUpdate;

    if (placehold && observe) {
      this.observer = Placeholder.createObserver(this.original, this.update);
    }
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
    return this.cachedRect;
  }

  update(): void {
    const originalRect: ClientRect = this.original.getBoundingClientRect();
    const widthChanged = originalRect.width !== this.cachedRect.width;
    const heightChanged = originalRect.height !== this.cachedRect.height;

    if (!widthChanged && !heightChanged) {
      return;
    }

    if (widthChanged) {
      this.element.style.width = `${originalRect.width}px`;
    }

    if (heightChanged) {
      this.element.style.height = `${originalRect.height}px`;
    }

    this.cachedRect = this.element.getBoundingClientRect();
    this.onUpdate();
  }

  static detectSizeMutation({ type, attributeName }: MutationRecord): boolean {
    return (
      type === 'childList'
      || (
        type === 'attributes'
        && (typeof attributeName === 'string' && /width|height/.test(attributeName))
      )
    );
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

  static createPlaceholder(element: HTMLElement, placehold: boolean = true): HTMLElement {
    const placeholder: HTMLElement = document.createElement('div');

    if (placehold) {
      const computedStyles: CSSStyleDeclaration = window.getComputedStyle(element);
      const originalRect: ClientRect = element.getBoundingClientRect();

      placeholder.style.margin = computedStyles.margin;
      placeholder.style.width = `${originalRect.width}px`;
      placeholder.style.height = `${originalRect.height}px`;
    }

    return placeholder;
  }
}
