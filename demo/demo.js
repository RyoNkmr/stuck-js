/* eslint-disable */
import { Sticky } from '../src';

const construct = (ids: Array<string>) => ids.reduce((acc, id) => ({ ...acc, [id]: new Sticky(document.querySelector(id))}), {});
const instances = construct([
  '#js-sticky-header',
  '#js-sticky-ad01',
  '#js-sticky-ad02',
]);

console.log(instances);
