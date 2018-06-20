import { scrollTo, getRect } from './puppeteerHelper';

describe('Stuck', () => {
  const containerHeight = 3000;
  let viewport;

  beforeEach(async () => {
    viewport = await page.viewport();
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
    `);
    await page.addStyleTag({ content: `
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
    `});
    await page.addScriptTag({ path: 'lib/index.js' });
  });

  afterEach(async () => {
    await page.reload();
  });

  describe('position stacking', () => {
    test('no margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box00' },
          { selector: '#js-box01' },
          { selector: '#js-box03' },
        ]);
      });
      await scrollTo(0, viewport.height);
      const rects = await getRect('#js-box00', '#js-box01', '#js-box03');
      const result = rects.map(el => el.top);
      expect(result).toEqual([0, 250, 650]);
    });

    test('with margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box00', marginTop: 20 },
          { selector: '#js-box01' },
          { selector: '#js-box03', marginTop: 100 },
        ], { marginTop: 10 });
      });
      await scrollTo(0, viewport.height);
      const rects = await getRect('#js-box00', '#js-box01', '#js-box03');
      const result = rects.map(el => el.top);
      expect(result).toEqual([20, 280, 780]);
    });

    test('with element initially hidden', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box00' },
          { selector: '#js-box02', placehold: false },
          { selector: '#js-box03' },
        ]);
      });
      const rectsBeforeScroll = await getRect('#js-box00', '#js-box02', '#js-box03')
        .then(rects => rects.map(el => el.top));
      expect(rectsBeforeScroll).toEqual([0, 0, 710]);

      await scrollTo(0, viewport.height);
      const rectsAfterScroll = await getRect('#js-box00', '#js-box02', '#js-box03')
        .then(rects => rects.map(el => el.top));
      expect(rectsAfterScroll).toEqual([0, 250, 500]);
    })
  });

  describe('Sticky instance creation', () => {
    describe('when Stuck instance is constructed', () => {
      it('create an Sticky instance', async () => {
        const instanceLength = await page.evaluate(() => (
          new StuckJs.Stuck({ selector: '#js-box01' }).instances.length
        ));
        expect(instanceLength).toBe(1);
      });

      it('creates multiple Stickes at once', async () => {
        const instanceLength = await page.evaluate(() => (
          new StuckJs.Stuck({ selector: '.js-box' }).instances.length
        ));
        expect(instanceLength).toBe(2);
      });

      it('creates Stickies by multiple settings', async () => {
        const instanceLength = await page.evaluate(() => (
          new StuckJs.Stuck([
            { selector: '#js-box01' },
            { selector: '.js-box' },
          ]).instances.length
        ));
        expect(instanceLength).toBe(3);
      });
    });

    describe('after constructed(lazy registration)', () => {
      it('registers new Stickies', async () => {
        const instanceLength = await page.evaluate(() => {
          const _stuck = new StuckJs.Stuck({ selector: '#js-box01' })
          _stuck.create({ selector: '.js-box' })
          return _stuck.instances.length;
        });
        expect(instanceLength).toBe(3);
      });
    });
  });

  describe('sort and updates by position', () => {
    test('when created', async () => {
      const targetIndex = await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box01' },
          { selector: '.js-box' },
        ]);
        const target = document.querySelector('#js-box01');
        return Stuck.registeredInstances.findIndex(({ element }) => element === target);
      });
      expect(targetIndex).toEqual(1);
    });

    test('lazy registeration', async () => {
      const targetIndex = await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box03' },
          { selector: '#js-box00' }
        ]);
        stuck.create({ selector: '#js-box01' });
        const target = document.querySelector('#js-box00');
        return Stuck.registeredInstances.findIndex(({ element }) => element === target);
      });
      expect(targetIndex).toEqual(0);
    });
  });
});
