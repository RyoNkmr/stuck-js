export const scrollTo = (
  scrollLeft = 0, 
  scrollTop = 0, 
  moveLeft = Math.max(32, scrollLeft/2),
  moveTop= Math.max(32, scrollTop/2),
) => (
  page.evaluate((left, top, moveX, moveY) => new Promise(resolve => {
    let id;
    const checker = () => {
      if (window.scrollX >= left && window.scrollY >= top) {
        resolve();
      }

      if (window.scrollX < left) {
        window.scrollBy(moveX, 0);
      }

      if (window.scrollY < top) {
        window.scrollBy(0, moveY);
      }
      id = window.requestAnimationFrame(checker);
    }
    checker();
  }), scrollLeft, scrollTop, moveLeft, moveTop)
);
export const getRect = (...selectors) => (
  page.evaluate(targetSelectors => (
    targetSelectors
      .reduce((acc, selector) => acc.concat(Array.from(document.querySelectorAll(selector))), [])
      .map(el => el.getBoundingClientRect())
      .map(({ top, left }) => ({ top, left }))
  ), selectors)
);
