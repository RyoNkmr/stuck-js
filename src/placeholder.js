/* @flow */
import { debounced } from './util-decorators';

export default class Placeholder {
  original: HTMLElement;
  element: HTMLElement;
  wrapped: boolean;
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
    Placeholder.wrap(this.original, this.element);

    if (placehold && observe) {
      this.observer = Placeholder.createObserver(this.original, this.updateSize);
    }
  }

  @debounced()
  updateSize(): void {
    const originalRect: DOMRect = this.original.getBoundingClientRect();
    const placeholderRect: DOMRect = this.original.getBoundingClientRect();

    if (originalRect.width !== placeholderRect.width) {
      this.element.style.width = `${originalRect.width}px`;
    }
    if (originalRect.height !== placeholderRect.height) {
      this.element.style.height = `${originalRect.height}px`;
    }
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
      const isMutated = mutations.some(Placeholder.detectMutation);
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