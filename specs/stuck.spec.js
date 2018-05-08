page.on('console', msg => {
  for (let i = 0; i < msg.args().length; ++i)
    console.log(`${i}: ${msg.args()[i]}`);
});

describe('Stuck', () => {
  beforeEach(async () => {
    await page.setContent(`
      <div id="container">
        <div id="js-box00" class="box js-box">box00</div>
        <div id="js-box01" class="box box--large">box01</div>
        <div id="js-box02" class="box js-box">box02</div>
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
        height: 2000px;
      }
      .box {
        width: 300px;
        height: 300px;
      }
      .box.box--large {
        height: 600px;
      }
      footer {
        margin: 0;
        padding: 0;
        width: 100%;
      }
    `});
    await page.addScriptTag({ path: 'lib/lib.js' });
  }, 10000);

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
