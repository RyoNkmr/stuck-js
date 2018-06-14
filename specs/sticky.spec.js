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
    await page.evaluate((selector) => {
      const { Sticky } = StuckJs;
      const element = document.querySelector(selector);
      const sticky = new Sticky(element);
    }, target);
  });

  afterEach(async () => {
    await scrollTo(0, 0);
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
});
