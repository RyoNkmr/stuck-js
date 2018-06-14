import { scrollTo, getRect } from './puppeteerHelper';

describe('Sticky', () => {
  const containerWidth = 2000;
  const containerHeight = 3000;
  const target = '#js-box01';
  let viewport;

  beforeEach(async () => {
    viewport = await page.viewport();
    await page.setContent(`
      <div id="container">
        <div id="js-box00" class="box">box00</div>
        <div id="js-box01" class="box box--large">box01</div>
        <div id="js-box02" class="box">box02</div>
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
    `});
    await page.addScriptTag({ path: 'lib/index.js' });
    await page.evaluate(selector => {
      const { Sticky } = StuckJs;
      const element = document.querySelector(selector);
      const sticky = new Sticky(element);
    }, target);
  }, 10000);

  afterEach(async () => {
    await scrollTo(0, 0);
    await page.reload();
  });

  it('preserves left position of sticky', async () => {
    await scrollTo(100, viewport.height);
    const [{ top, left }] = await getRect(target);
    expect(top).toBe(0);
    expect(left).toBe(-100);
  });

  describe('DOM mutations', () => {
    it('adds stuck data attribute on created', async () => {
      const stuck = await page.$eval(target, el => el.dataset.stuck);
      expect(stuck).toBeDefined();
    });

    it('turns stuck-attr to be "true" string while being sticky', async () => {
      await scrollTo(0, viewport.height);
      const stuck = await page.$eval(target, el => el.dataset.stuck);
      expect(stuck).toBe('true');
    });

    it('turns stuck-attr to be empty string while no-sticky state', async () => {
      const stuck = await page.$eval(target, el => el.dataset.stuck);
      expect(stuck).toBe('');
    });
  });

  describe('position sticking inside the wrapper', () => {
    beforeEach(async () => {
      await page.reload();
      viewport = await page.viewport();
      await page.setContent(`
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
      `);
      await page.addStyleTag({
        content: `
          html, body {
            margin: 0;
            padding: 0;
          }
          #container {
            display: flex;
            justify-content: space-between;
            width: 2000px;
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
        `,
      });
      await page.addScriptTag({ path: 'lib/index.js' });
    });

    test('without page height changing', async () => {
      await page.evaluate(() => {
        const { Sticky } = StuckJs;
        const element = document.querySelector('#js-box01');
        const sticky = new Sticky(element, { wrapper: '#sidebar' });
      });
      await scrollTo(0, 2400);
      const [rect] = await getRect('#js-box01');
      expect(rect.top).toBe(-400);
    });

    test('with dynamically page height changing', async () => {
      await page.evaluate(() => {
        const { Sticky } = StuckJs;
        const element = document.querySelector('#js-box01');
        const sticky = new Sticky(element, { wrapper: '#sidebar' });
      });
      await scrollTo(0, 2400);
      await page.evaluate(() => {
        const element = document.querySelector('#main-column');
        element.style.height = '3600px';
      });
      await scrollTo(0, 3400);
      const [rect] = await getRect('#js-box01');
      expect(rect.top).toBe(-400);
    });
  });
});
