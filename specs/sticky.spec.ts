import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Sticky } from '../src'
import {
  cleanup,
  elementOf,
  rectsOf,
  scrollTo,
  setContent,
  topsOf,
} from './helpers'

const viewport = { width: 800, height: 600 }
const containerWidth = 2000
const containerHeight = 3000
const target = '#js-box01'

const boxesHtml = `
  <div id="container">
    <div id="js-box00" class="box">box00</div>
    <div id="js-box01" class="box box--large">box01</div>
    <div id="js-box02" class="box">box02</div>
  </div>
  <footer>
    footer
  </footer>
`

const boxesCss = `
  #container {
    width: ${containerWidth}px;
    height: ${containerHeight}px;
  }
  .box {
    width: 300px;
    height: 300px;
    background-color: #33a;
  }
  .box--large {
    height: 600px;
    background-color: #a3a;
  }
  footer {
    margin: 0;
    padding: 0;
    width: 100%;
  }
`

describe('Sticky', () => {
  beforeEach(async () => {
    await page.viewport(viewport.width, viewport.height)
  })

  afterEach(cleanup)

  describe('sticking', () => {
    beforeEach(async () => {
      await setContent(boxesHtml, boxesCss)
      new Sticky(elementOf(target))
    })

    it('preserves left position of sticky', async () => {
      await scrollTo(100, viewport.height)
      await expect.poll(() => rectsOf(target)[0].top).toBe(0)
      expect(rectsOf(target)[0].left).toBe(-100)
    })

    it('leaves the page height untouched while stuck', async () => {
      const before = document.body.scrollHeight
      await scrollTo(0, viewport.height)
      await expect.poll(() => rectsOf(target)[0].top).toBe(0)
      expect(document.body.scrollHeight).toBe(before)
    })

    describe('DOM mutations', () => {
      it('adds stuck data attribute on created', () => {
        expect(elementOf(target).dataset.stuck).toBeDefined()
      })

      it('turns stuck-attr to be "true" string while being sticky', async () => {
        await scrollTo(0, viewport.height)
        await expect.poll(() => elementOf(target).dataset.stuck).toBe('true')
      })

      it('turns stuck-attr to be empty string while no-sticky state', async () => {
        await expect.poll(() => elementOf(target).dataset.stuck).toBe('')
      })
    })
  })

  describe('options', () => {
    beforeEach(async () => {
      await setContent(boxesHtml, boxesCss)
    })

    // 上の要素が伸びたら、その下に積まれた要素も下がるはず
    const growFirstBox = (): void => {
      elementOf('#js-box00').style.height = '500px'
    }

    it('follows a sibling that grows above it', async () => {
      new Sticky(elementOf('#js-box00'))
      new Sticky(elementOf(target))
      await scrollTo(0, viewport.height)
      await expect.poll(() => topsOf('#js-box00', target)).toEqual([0, 300])

      growFirstBox()
      await expect.poll(() => topsOf('#js-box00', target)).toEqual([0, 500])
    })

    it('does not follow the sibling when observe is false', async () => {
      new Sticky(elementOf('#js-box00'), { observe: false })
      new Sticky(elementOf(target), { observe: false })
      await scrollTo(0, viewport.height)
      await expect.poll(() => topsOf('#js-box00', target)).toEqual([0, 300])

      growFirstBox()
      await expect.poll(() => topsOf('#js-box00', target)).toEqual([0, 300])
    })
  })

  describe('lifecycle', () => {
    beforeEach(async () => {
      await setContent(boxesHtml, boxesCss)
    })

    it('throws when no element is given', () => {
      expect(() => new Sticky(undefined as unknown as HTMLElement)).toThrow()
    })

    it('exposes the offset it sticks at', () => {
      const first = new Sticky(elementOf('#js-box00'))
      const second = new Sticky(elementOf(target))
      expect(first.offsetTop).toBe(0)
      expect(second.offsetTop).toBe(300)
    })

    it('restores the element on destroy', () => {
      const element = elementOf(target)
      const sticky = new Sticky(element)
      expect(element.style.position).toBe('sticky')

      sticky.destroy()
      expect(element.style.position).toBe('')
      expect(element.dataset.stuck).toBeUndefined()
    })

    it('tolerates destroy and update being called after destroy', () => {
      const sticky = new Sticky(elementOf(target))
      sticky.destroy()
      expect(() => {
        sticky.destroy()
        sticky.update()
      }).not.toThrow()
    })

    it('re-runs the stack calculation on update()', () => {
      const first = new Sticky(elementOf('#js-box00'))
      const second = new Sticky(elementOf(target))
      elementOf('#js-box00').style.height = '450px'

      second.update()
      expect(second.offsetTop).toBe(450)
      expect(first.offsetTop).toBe(0)
    })
  })

  describe('following size changes', () => {
    const initialHeight = 200
    const expandedHeight = 500

    beforeEach(async () => {
      await setContent(
        `
          <div id="container">
            <div id="js-target" class="box">target</div>
            <div id="js-below" class="box">below</div>
          </div>
        `,
        `
          #container {
            height: ${containerHeight}px;
          }
          .box {
            width: 300px;
            height: ${initialHeight}px;
            background-color: #33a;
            transition: height .15s linear;
          }
          .box.box--tall {
            height: ${expandedHeight}px;
          }
        `
      )
    })

    it('follows the element through a CSS transition', async () => {
      new Sticky(elementOf('#js-target'))
      new Sticky(elementOf('#js-below'))
      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-target', '#js-below'))
        .toEqual([0, initialHeight])

      // transition による高さ変化は属性を変えないので、
      // ResizeObserver でなければ最終サイズを取り逃がす
      elementOf('#js-target').classList.add('box--tall')
      await expect
        .poll(() => topsOf('#js-target', '#js-below'), { timeout: 2000 })
        .toEqual([0, expandedHeight])
    })
  })

  describe('resizing the viewport', () => {
    beforeEach(async () => {
      await setContent(
        `
          <header>header</header>
          <main></main>
        `,
        `
          main {
            display: block;
            height: 3000px;
          }
          header {
            width: 100%;
            height: 80px;
            background-color: #a3a;
          }
        `
      )
    })

    it('keeps the element width in sync with its container', async () => {
      new Sticky(elementOf('header'))
      await scrollTo(0, 1000)
      await expect.poll(() => rectsOf('header')[0].width).toBe(viewport.width)

      await page.viewport(400, viewport.height)
      await expect.poll(() => rectsOf('header')[0].width).toBe(400)
    })
  })

  describe('position sticking inside the wrapper', () => {
    beforeEach(async () => {
      await setContent(
        `
          <div id="container">
            <div id="sidebar">
              <div id="js-box00" class="box">box00</div>
              <div id="js-box01" class="box box--large">box01</div>
            </div>
            <div id="main-column">long contents</div>
          </div>
          <footer>
            footer
          </footer>
        `,
        `
          #container {
            display: flex;
            justify-content: space-between;
            width: ${containerWidth}px;
          }
          .box {
            width: 300px;
            height: 300px;
            background-color: #33a;
          }
          .box--large {
            height: 600px;
            background-color: #a3a;
          }
          #main-column {
            width: 1500px;
            height: 2600px;
            background-color: #33a;
          }
          footer {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 400px;
          }
        `
      )
    })

    it('without page height changing', async () => {
      new Sticky(elementOf(target), { wrapper: '#sidebar' })
      await scrollTo(0, 2400)
      await expect.poll(() => rectsOf(target)[0].top).toBe(-400)
    })

    it('with dynamically page height changing', async () => {
      new Sticky(elementOf(target), { wrapper: '#sidebar' })
      await scrollTo(0, 2400)
      elementOf('#main-column').style.height = '3600px'
      await scrollTo(0, 3400)
      await expect.poll(() => rectsOf(target)[0].top).toBe(-400)
    })
  })
})
