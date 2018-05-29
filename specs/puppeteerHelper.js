export const scrollTo = async (
  scrollLeft = 0, 
  scrollTop = 0, 
  moveLeft = 32,
  moveTop = moveLeft,
) => {
  await page.evaluate((left, top) => { window.scroll(left, top); }, scrollLeft, scrollTop);
  await page.waitFor(60);
};

export const getRect = (...selectors) => (
  page.evaluate(targetSelectors => (
    targetSelectors
      .reduce((acc, selector) => acc.concat(Array.from(document.querySelectorAll(selector))), [])
      .map(el => el.getBoundingClientRect())
      .map(({ top, left }) => ({ top, left }))
  ), selectors)
);
