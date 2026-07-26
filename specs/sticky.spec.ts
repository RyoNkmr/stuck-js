import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Sticky } from '../src'
import {
  cleanup,
  elementOf,
  parentRectsOf,
  rectsOf,
  scrollTo,
  setContent,
  track,
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
  .fullwidth {
    width: 100%;
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
      track(new Sticky(elementOf(target)))
    })

    it('preserves left position of sticky', async () => {
      await scrollTo(100, viewport.height)
      await expect.poll(() => rectsOf(target)[0].top).toBe(0)
      expect(rectsOf(target)[0].left).toBe(-100)
    })

    describe('DOM mutations', () => {
      it('adds stuck data attribute on created', () => {
        expect(elementOf(target).dataset.stuck).toBeDefined()
      })

      it('turns stuck-attr to be "true" string while being sticky', async () => {
        await scrollTo(0, viewport.height)
        await expect.poll(() => elementOf(target).dataset.stuck).toBe('true')
      })

      it('turns stuck-attr to be empty string while no-sticky state', () => {
        expect(elementOf(target).dataset.stuck).toBe('')
      })
    })
  })

  describe('placeholder', () => {
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

    // sticky 本体と placeholder は別フレームで更新されうるので、まとめて待つ
    const widthsOfHeader = (): number[] => [
      rectsOf('header')[0].width,
      parentRectsOf('header')[0].width,
    ]

    it('update sticky and placeholder size on resize', async () => {
      track(new Sticky(elementOf('header')))
      await scrollTo(0, 1000)
      await expect
        .poll(widthsOfHeader)
        .toEqual([viewport.width, viewport.width])

      await page.viewport(400, viewport.height)
      await expect.poll(widthsOfHeader).toEqual([400, 400])
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
      track(new Sticky(elementOf(target), { wrapper: '#sidebar' }))
      await scrollTo(0, 2400)
      await expect.poll(() => rectsOf(target)[0].top).toBe(-400)
    })

    it('with dynamically page height changing', async () => {
      track(new Sticky(elementOf(target), { wrapper: '#sidebar' }))
      await scrollTo(0, 2400)
      elementOf('#main-column').style.height = '3600px'
      await scrollTo(0, 3400)
      await expect.poll(() => rectsOf(target)[0].top).toBe(-400)
    })
  })
})
