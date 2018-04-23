/* @flow */
import throttle from 'lodash.throttle';

export default class Placeholder {
  original: HTMLElement;
  element: HTMLElement;
  cachedRect: DOMRect;
  observer: MutationObserver;

  constructor(
    element: HTMLElement,
    placehold: boolean = true,
    observe: boolean = true,
  ) {
    if (!element || !element.nodeName) {
      throw new TypeError(`[Stuck.js Error] ${element} is not valid Element`);
    }
    this.original = element;
    this.element = Placeholder.createPlaceholder(element, placehold);
    this.cachedRect = this.element.getBoundingClientRect();
    this.updateSize = throttle(this.updateSize, 166);

    Placeholder.wrap(this.original, this.element);
    if (placehold && observe) {
      this.observer = Placeholder.createObserver(this.original, this.updateSize);
    }
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    Placeholder.unwrap(this.original);
    this.element = null;
  }

  updateSize(): void {
    const originalRect: DOMRect = this.original.getBoundingClientRect();

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
  }

  static detectSizeMutation({ type, attributeName }: MutationRecord): boolean {
    return (
      type === 'childList'
      || (type === 'attributes'
        && (
          attributeName !== null
          && /width|height/i.attributeName
        )
      )
    );
  }

  static createObserver(targetNode: HTMLElement, callback: () => mixed): MutationObserver {
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
    const parent = wrapper.parentNode;
    wrapper.insertAdjacentElement('beforebegin', target);
    parent.removeChild(wrapper);
    return target;
  }

  static wrap(target: HTMLElement, wrapper:HTMLElement): HTMLElement {
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
      const originalRect: DOMRect = element.getBoundingClientRect();

      placeholder.style.margin = computedStyles.margin;
      placeholder.style.width = `${originalRect.width}px`;
      placeholder.style.height = `${originalRect.height}px`;
    }

    return placeholder;
  }
}
