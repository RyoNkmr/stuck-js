/* eslint-disable */
import Stuck from '../src';

const instances = new Stuck([
  { selector: '#js-sticky-header', marginTop: 0 },
  // { selector: '#js-sticky-ad01', wrapper: '#js-sidebar' },
  // { selector: '#js-sticky-ad02', wrapper: '#js-sidebar' },
  // { selector: '.js-sticky-ad', wrapper: '#js-sidebar' },
], { marginTop: 10 });

window.addEventListener('keydown', ({ key }) => {
  console.log(key);
  if (key === 'ArrowLeft') {
    instances.destroy();
    return false;
  }
  if (key === 'ArrowRight') {
    instances.create([{ selector: '.js-sticky-ad', wrapper: '#js-sidebar', marginTop: 10 }]);
    return false;
  }
})
console.log(instances);
