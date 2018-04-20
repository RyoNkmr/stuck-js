/* @flow */
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

  constructor(
    element: HTMLElement,
    options: StickyOptions = {
      marginTop: 0,
      wrapper: document.body,
      placehold: true,
    },
  ) {
    this.element = element;
    this.options = options;

    if (options.placehold) {
      this.placeholder = new Placeholder(element);
    }
  }
}
