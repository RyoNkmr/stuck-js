/* @flow */
export default class Placeholder {
  original: HTMLElement;
  placeholder: HTMLElement;
  wrapped: boolean;
  observer: MutationObserver;
  updateTimerId: number;
  updateDebounceWait: number;

  constructor(element: HTMLElement, observe: boolean = true, updateDebounceWait: number = 100) {
    if (!element || !element.nodeName) {
      throw new TypeError(`[Stuck.js Error] ${element} is not valid Element`);
    }
    this.original = element;
    this.placeholder = Placeholder.createPlaceholder(element);
    this.updateDebounceWait = updateDebounceWait;

    Placeholder.wrap(this.original, this.placeholder);

    if (observe) {
      this.observer = Placeholder.createObserver(this.original, this.updateSize);
    }
  }

  updateSize(): void {
    clearTimeout(this.updateTimerId);
    this.updateTimerId = setTimeout(() => {
      const originalRect: DOMRect = this.original.getBoundingClientRect();
      const placeholderRect: DOMRect = this.original.getBoundingClientRect();

      if (originalRect.width !== placeholderRect.width) {
        this.placeholder.style.width = `${originalRect.width}px`;
      }
      if (originalRect.height !== placeholderRect.height) {
        this.placeholder.style.height = `${originalRect.height}px`;
      }
    }, this.updateDebounceWait);
  }

  static detectSizeMutation({ type, attributeName }: MutationRecord): boolean {
    console.log(type, attributeName);
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

  static createPlaceholder(element: HTMLElement): HTMLElement {
    const placeholder: HTMLElement = document.createElement('div');
    const computedStyles: CSSStyleDeclaration = window.getComputedStyle(element);
    const originalRect: DOMRect = element.getBoundingClientRect();

    placeholder.style.margin = computedStyles.margin;
    placeholder.style.width = `${originalRect.width}px`;
    placeholder.style.height = `${originalRect.height}px`;

    return placeholder;
  }
}
