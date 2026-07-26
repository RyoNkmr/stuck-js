import { getStuckManagerInstance } from '../src/stuckManager'

/**
 * 更新は requestAnimationFrame でスケジュールされるので、
 * 反映を待つために 2 フレーム分進める。
 */
export const nextFrame = (): Promise<void> =>
  new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

/**
 * 位置の期待値がスクロールバーの幅に左右されないよう、
 * すべてのテストで余白とスクロールバーを潰しておく。
 */
const baseCss = `
  html {
    scrollbar-width: none;
  }
  html::-webkit-scrollbar {
    display: none;
  }
  html, body {
    margin: 0;
    padding: 0;
  }
`

export const setContent = async (html: string, css: string): Promise<void> => {
  for (const style of document.head.querySelectorAll('style[data-spec]')) {
    style.remove()
  }
  const style = document.createElement('style')
  style.dataset.spec = ''
  style.textContent = `${baseCss}${css}`
  document.head.appendChild(style)
  document.body.innerHTML = html
  await nextFrame()
}

/**
 * ライブラリは window ごとのシングルトンにインスタンスを溜めるため、
 * ブラウザモードでは各テストの後に破棄しないと状態が次のテストへ漏れる。
 */
export const cleanup = async (): Promise<void> => {
  getStuckManagerInstance(window).destroyAll()
  window.scroll(0, 0)
  document.body.innerHTML = ''
  await nextFrame()
}

export const scrollTo = async (left = 0, top = 0): Promise<void> => {
  window.scroll(left, top)
  await nextFrame()
}

const queryAll = (selectors: string[]): HTMLElement[] =>
  selectors.reduce<HTMLElement[]>(
    (elements, selector) =>
      elements.concat(
        Array.from(document.querySelectorAll<HTMLElement>(selector))
      ),
    []
  )

export const rectsOf = (...selectors: string[]): DOMRect[] =>
  queryAll(selectors).map(element => element.getBoundingClientRect())

export const topsOf = (...selectors: string[]): number[] =>
  rectsOf(...selectors).map(({ top }) => top)

export const parentRectsOf = (...selectors: string[]): DOMRect[] =>
  queryAll(selectors).map(element => {
    const { parentElement } = element
    if (!parentElement) {
      throw new Error(`no parentElement found for ${element.outerHTML}`)
    }
    return parentElement.getBoundingClientRect()
  })

export const elementOf = (selector: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(selector)
  if (!element) {
    throw new Error(`no element found for ${selector}`)
  }
  return element
}
