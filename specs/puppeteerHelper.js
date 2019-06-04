export const scrollTo = async (scrollLeft = 0, scrollTop = 0) => {
  await page.evaluate(
    (left, top) => {
      window.scroll(left, top);
    },
    scrollLeft,
    scrollTop
  );
  await page.waitFor(60);
};

export const getRects = (...selectors) =>
  page.evaluate(
    targetSelectors =>
      targetSelectors
        .reduce(
          (acc, selector) =>
            acc.concat(Array.from(document.querySelectorAll(selector))),
          []
        )
        .map(el => el.getBoundingClientRect())
        .map(({ top, left, width, height }) => ({ top, left, width, height })),
    selectors
  );

export const getParentRects = (...selectors) =>
  page.evaluate(
    targetSelectors =>
      targetSelectors
        .reduce(
          (acc, selector) =>
            acc.concat(Array.from(document.querySelectorAll(selector))),
          []
        )
        .map(el => el.parentNode.getBoundingClientRect())
        .map(({ top, left, width, height }) => ({ top, left, width, height })),
    selectors
  );
