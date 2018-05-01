/* eslint-disable */
import { Stuck } from '../src';

const instances = new Stuck([
  { selector: '#js-sticky-header', marginTop: 0 },
  { selector: '#js-sticky-ad01', wrapper: '#js-sidebar' },
  { selector: '#js-sticky-ad02', wrapper: '#js-sidebar' },
], { marginTop: 10 });

console.log(instances);
