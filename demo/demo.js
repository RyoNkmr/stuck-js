/* eslint-disable */
import { Sticky, Stuck } from '../src';
//
// const construct = (ids: Array<string>) => ids.reduce((acc, id) => ({ ...acc, [id]: new Sticky(document.querySelector(id))}), {});
// const instances = construct([
//   '#js-sticky-header',
//   '#js-sticky-ad01',
//   '#js-sticky-ad02',
// ]);

const instances = new Stuck([
  { selector: '#js-sticky-header', options: { marginTop: 0 }},
  { selector: '#js-sticky-ad01', wrapper: '#js-sidebar' },
  { selector: '#js-sticky-ad02' }
], { marginTop: 10 });

console.log(instances);
