import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Stuck } from '../src'
import type { StickySetting } from '../src/stuck'
import { getStuckManagerInstance } from '../src/stuckManager'
import { cleanup, elementOf, scrollTo, setContent, topsOf } from './helpers'

const viewport = { width: 800, height: 600 }
const containerHeight = 3000

const html = `
  <div id="container">
    <div id="js-box00" class="box js-box" style="z-index: 3">box00</div>
    <div id="js-box01" class="box box--large" style="z-index: 2">box01</div>
    <div id="js-box02" class="box box--initially-hidden">box02</div>
    <div id="js-box03" class="box js-box" style="z-index: 1">box03</div>
  </div>
  <footer>
    footer
  </footer>
`

const css = `
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
`

describe('Stuck', () => {
  beforeEach(async () => {
    await page.viewport(viewport.width, viewport.height)
    await setContent(html, css)
  })

  afterEach(cleanup)

  describe('position stacking', () => {
    it('no margin', async () => {
      new Stuck([
        { selector: '#js-box00' },
        { selector: '#js-box01' },
        { selector: '#js-box03' },
      ])
      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-box00', '#js-box01', '#js-box03'))
        .toEqual([0, 250, 650])
    })

    it('with margin', async () => {
      new Stuck(
        [
          { selector: '#js-box00', marginTop: 20 },
          { selector: '#js-box01' },
          { selector: '#js-box03', marginTop: 100 },
        ],
        { marginTop: 10 }
      )
      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-box00', '#js-box01', '#js-box03'))
        .toEqual([20, 280, 780])
    })

    it('position stacking with element initially hidden', async () => {
      new Stuck([
        { selector: '#js-box00' },
        { selector: '#js-box02' },
        { selector: '#js-box03' },
      ])
      await expect
        .poll(() => topsOf('#js-box00', '#js-box02', '#js-box03'))
        .toEqual([0, 0, 710])

      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-box00', '#js-box02', '#js-box03'))
        .toEqual([0, 250, 500])
    })
  })

  describe('recalculating the stack while scrolled', () => {
    it('lifts the remaining stickies when one is destroyed', async () => {
      const first = new Stuck({ selector: '#js-box00' })
      new Stuck([{ selector: '#js-box01' }, { selector: '#js-box03' }])
      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-box00', '#js-box01', '#js-box03'))
        .toEqual([0, 250, 650])

      first.destroy()
      await expect
        .poll(() => topsOf('#js-box01', '#js-box03'))
        .toEqual([0, 400])
    })

    it('pushes the existing stickies down when one is added', async () => {
      new Stuck([{ selector: '#js-box01' }, { selector: '#js-box03' }])
      await scrollTo(0, viewport.height)
      await expect
        .poll(() => topsOf('#js-box01', '#js-box03'))
        .toEqual([0, 400])

      new Stuck({ selector: '#js-box00' })
      await expect
        .poll(() => topsOf('#js-box00', '#js-box01', '#js-box03'))
        .toEqual([0, 250, 650])
    })
  })

  describe('Sticky instance creation', () => {
    describe('when Stuck instance is constructed', () => {
      it('creates an Sticky instance', () => {
        expect(new Stuck({ selector: '#js-box01' }).stickies.length).toBe(1)
      })

      it('creates an Sticky instance with specified HTMLelement', () => {
        const element = elementOf('#js-box01')
        expect(new Stuck({ element }).stickies.length).toBe(1)
      })

      it('creates multiple Stickes at once', () => {
        expect(new Stuck({ selector: '.js-box' }).stickies.length).toBe(2)
      })

      it('creates multiple Stickes with specified HTMLelements at once', () => {
        const element = document.querySelectorAll<HTMLElement>('.js-box')
        expect(new Stuck({ element }).stickies.length).toBe(2)
      })

      it('creates Stickies by multiple settings', () => {
        const stuck = new Stuck([
          { selector: '#js-box01' },
          { selector: '.js-box' },
        ])
        expect(stuck.stickies.length).toBe(3)
      })

      it('throws when no selector, element nor elements in setting was given', () => {
        expect(() => new Stuck({} as unknown as StickySetting)).toThrow()
      })
    })

    describe('after constructed(lazy registration)', () => {
      it('registers new Stickies', () => {
        const stuck = new Stuck({ selector: '#js-box01' })
        stuck.create({ selector: '.js-box' }, true)
        expect(stuck.stickies.length).toBe(3)
      })
    })
  })

  describe('sort and updates by position', () => {
    const indexOfStackingSticky = (selector: string): number => {
      const target = elementOf(selector)
      return getStuckManagerInstance(window).stackingStickies.findIndex(
        ({ element }) => element === target
      )
    }

    it('when created', () => {
      new Stuck([{ selector: '#js-box01' }, { selector: '.js-box' }])
      expect(indexOfStackingSticky('#js-box01')).toBe(1)
    })

    it('lazy registeration', () => {
      const stuck = new Stuck([
        { selector: '#js-box03' },
        { selector: '#js-box00' },
      ])
      stuck.create({ selector: '#js-box01' }, true)
      expect(indexOfStackingSticky('#js-box00')).toBe(0)
    })
  })
})
