describe('Stuck', () => {
  const containerHeight = 3000;
  let viewport;

  beforeEach(async () => {
    viewport = await page.viewport();
    await page.setContent(`
      <div id="container">
        <div id="js-box00" class="box js-box" style="z-index: 3">box00</div>
        <div id="js-box01" class="box box--large" style="z-index: 2">box01</div>
        <div id="js-box02" class="box js-box" style="z-index: 1">box02</div>
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
      footer {
        margin: 0;
        padding: 0;
        width: 100%;
      }
    `});
    await page.addScriptTag({ path: 'lib/lib.js' });
  });

  afterEach(async () => {
    await page.reload();
  });

  describe('position stacking', () => {
    const scrollTo = scrollTop => (
      page.evaluate(top => new Promise(resolve => {
        let id;
        const checker = () => {
          if (window.scrollY < top) {
            window.scrollBy(0, 100);
            id = window.requestAnimationFrame(checker);
            return;
          }
          resolve();
        }
        checker();
      }), scrollTop)
    );
    const getTopPosition = (...selectors) => (
      page.evaluate(targetSelectors => (
        targetSelectors
          .reduce((acc, selector) => acc.concat(Array.from(document.querySelectorAll(selector))), [])
          .map(el => el.getBoundingClientRect().top)
      ), selectors)
    );

    test('no margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box00' },
          { selector: '#js-box01' },
          { selector: '#js-box02' },
        ]);
      });
      await scrollTo(viewport.height);
      const result = await getTopPosition('#js-box00', '#js-box01', '#js-box02');
      expect(result).toEqual([0, 250, 650]);
    });

    test('with margin', async () => {
      await page.evaluate(() => {
        const { Stuck } = StuckJs;
        const stuck = new Stuck([
          { selector: '#js-box00', marginTop: 20 },
          { selector: '#js-box01' },
          { selector: '#js-box02', marginTop: 100 },
        ], { marginTop: 10 });
      });
      await scrollTo(viewport.height);
      const result = await getTopPosition('#js-box00', '#js-box01', '#js-box02');
      expect(result).toEqual([20, 280, 780]);
    });
  });

  describe('Sticky instance creation', () => {
    describe('when Stuck instance is constructed', () => {
      it('create an Sticky instance', async () => {
        const stuck = await page.evaluate(() => (
          new StuckJs.Stuck({ selector: '#js-box01' })
        ));
        expect(stuck.instances).toHaveLength(1);
      });

      it('creates multiple Stickes at once', async () => {
        const stuck = await page.evaluate(() => (
          new StuckJs.Stuck({ selector: '.js-box' })
        ));
        expect(stuck.instances).toHaveLength(2);
      });

      it('creates Stickies by multiple settings', async () => {
        const stuck = await page.evaluate(() => (
          new StuckJs.Stuck([
            { selector: '#js-box01' },
            { selector: '.js-box' },
          ])
        ));
        expect(stuck.instances).toHaveLength(3);
      });
    });

    describe('after constructed(lazy registration)', () => {
      it('registers new Stickies', async () => {
        const stuck = await page.evaluate(() => {
          const _stuck = new StuckJs.Stuck({ selector: '#js-box01' })
          _stuck.create({ selector: '.js-box' })
          return _stuck;
        });
        expect(stuck.instances).toHaveLength(3);
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
          { selector: '#js-box02' },
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
