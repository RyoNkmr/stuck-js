import { scrollTo, getRects } from './puppeteerHelper'

describe('Stuck', () => {
  const containerHeight = 3000
  const viewport = { width: 800, height: 600 }

  beforeEach(async () => {
    await page.setViewport(viewport)
    await page.setContent(`
      <div id="container">
        <div id="js-box00" class="box js-box" style="z-index: 3">box00</div>
        <div id="js-box01" class="box box--large" style="z-index: 2">box01</div>
        <div id="js-box02" class="box box--initially-hidden">box02</div>
        <div id="js-box03" class="box js-box" style="z-index: 1">box03</div>
      </div>
      <footer>
        footer
      </footer>
    `)
    await page.addStyleTag({
      content: `
      html, body {
        margin: 0;
        padding: 0;
      }
      #container {
        height: ${containerHeight}px;
      }
      .box {
        width: 300px;
        height: 250px;
        background-color: #33a;
      }
      .box:nth-child(n+2) {
        margin-top: 30px;
      }
      .box.box--large {
        height: 400px;
        background-color: #a3a;
      }
      .box.box--initially-hidden {
        display: none;
        margin-top: 0;
      }
      .box.box--initially-hidden[data-stuck='true'] {
        display: block;
      }
      footer {
        margin: 0;
        padding: 0;
        width: 100%;
      }
    `,
    })
    await page.addScriptTag({ path: 'lib/index.js' })
    await page.waitFor(60)
  }, 10000)

  afterEach(async () => {
    await scrollTo(0, 0)
    await page.reload()
  })

  describe('position stacking', () => {
    test('no margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs
        const stuck = new Stuck([
          { selector: '#js-box00' },
          { selector: '#js-box01' },
          { selector: '#js-box03' },
        ])
      })
      await scrollTo(0, viewport.height)
      const rects = await getRects('#js-box00', '#js-box01', '#js-box03')
      const result = rects.map(el => el.top)
      expect(result).toEqual([0, 250, 650])
    })

    test('with margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs
        const stuck = new Stuck(
          [
            { selector: '#js-box00', marginTop: 20 },
            { selector: '#js-box01' },
            { selector: '#js-box03', marginTop: 100 },
          ],
          { marginTop: 10 }
        )
      })
      await scrollTo(0, viewport.height)
      const rects = await getRects('#js-box00', '#js-box01', '#js-box03')
      const result = rects.map(el => el.top)
      expect(result).toEqual([20, 280, 780])
    })

    test('position stacking with element initially hidden', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs
        const stuck = new Stuck([
          { selector: '#js-box00' },
          { selector: '#js-box02' },
          { selector: '#js-box03' },
        ])
      })
      const rectsBeforeScroll = await getRects(
        '#js-box00',
        '#js-box02',
        '#js-box03'
      ).then(rects => rects.map(el => el.top))
      expect(rectsBeforeScroll).toEqual([0, 0, 710])

      await scrollTo(0, viewport.height)
      const rectsAfterScroll = await getRects(
        '#js-box00',
        '#js-box02',
        '#js-box03'
      ).then(rects => rects.map(el => el.top))
      expect(rectsAfterScroll).toEqual([0, 250, 500])
    })
  })

  describe('Sticky instance creation', () => {
    describe('when Stuck instance is constructed', () => {
      it('creates an Sticky instance', async () => {
        const instanceLength = await page.evaluate(
          () => new StuckJs.Stuck({ selector: '#js-box01' }).stickies.length
        )
        expect(instanceLength).toBe(1)
      })

      it('creates an Sticky instance with specified HTMLelement', async () => {
        const instanceLength = await page.evaluate(() => {
          const element = document.querySelector('#js-box01')
          return new StuckJs.Stuck({ element }).stickies.length
        })
        expect(instanceLength).toBe(1)
      })

      it('creates multiple Stickes at once', async () => {
        const instanceLength = await page.evaluate(
          () => new StuckJs.Stuck({ selector: '.js-box' }).stickies.length
        )
        expect(instanceLength).toBe(2)
      })

      it('creates multiple Stickes with specified HTMLelements at once', async () => {
        const instanceLength = await page.evaluate(() => {
          const elements = document.querySelectorAll('.js-box')
          return new StuckJs.Stuck({ element: elements }).stickies.length
        })
        expect(instanceLength).toBe(2)
      })

      it('creates Stickies by multiple settings', async () => {
        const instanceLength = await page.evaluate(
          () =>
            new StuckJs.Stuck([
              { selector: '#js-box01' },
              { selector: '.js-box' },
            ]).stickies.length
        )
        expect(instanceLength).toBe(3)
      })

      it('throws when no selector, element nor elements in setting was given', async () => {
        const isThrown = await page.evaluate(() => {
          try {
            new StuckJs.Stuck({})
            return false
          } catch (error) {
            return true
          }
        })
        expect(isThrown).toBe(true)
      })
    })

    describe('after constructed(lazy registration)', () => {
      it('registers new Stickies', async () => {
        const instanceLength = await page.evaluate(() => {
          const _stuck = new StuckJs.Stuck({ selector: '#js-box01' })
          _stuck.create({ selector: '.js-box' })
          return _stuck.stickies.length
        })
        expect(instanceLength).toBe(3)
      })
    })
  })

  describe('sort and updates by position', () => {
    test('when created', async () => {
      const targetIndex = await page.evaluate(() => {
        const { Stuck } = StuckJs
        const stuck = new Stuck([
          { selector: '#js-box01' },
          { selector: '.js-box' },
        ])
        const target = document.querySelector('#js-box01')
        return stuck.$$manager.stackingStickies.findIndex(
          ({ element }) => element === target
        )
      })
      expect(targetIndex).toEqual(1)
    })

    test('lazy registeration', async () => {
      const targetIndex = await page.evaluate(() => {
        const { Stuck } = StuckJs
        const stuck = new Stuck([
          { selector: '#js-box03' },
          { selector: '#js-box00' },
        ])
        stuck.create({ selector: '#js-box01' })
        const target = document.querySelector('#js-box00')
        return stuck.$$manager.stackingStickies.findIndex(
          ({ element }) => element === target
        )
      })
      expect(targetIndex).toEqual(0)
    })
  })
})
