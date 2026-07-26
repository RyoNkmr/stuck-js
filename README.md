# Stuck.js

[![CI](https://github.com/RyoNkmr/stuck-js/actions/workflows/ci.yml/badge.svg)](https://github.com/RyoNkmr/stuck-js/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/stuck-js.svg)](https://badge.fury.io/js/stuck-js)
[![downloads](https://img.shields.io/npm/dt/stuck-js.svg)](https://www.npmjs.com/package/stuck-js)

A sticky library that stacks multiple sticky elements on top of each other and keeps them aligned when the page scrolls horizontally. No dependencies — jQuery not required.

Demo: https://ryonkmr.github.io/stuck-js/

## Quickstart

### Setup

Install it from [npm](https://www.npmjs.com/package/stuck-js):

```bash
$ npm i -S stuck-js
```

Or grab a build from the [GitHub releases](https://github.com/RyoNkmr/stuck-js/releases).

### Usage
```html
<style>
  header {
    height: 100px;
    z-index: 100;
  }
  .ad {
    width: 300px;
    height: 250px;
  }
</style>
<body>
  <header style="height: 100px; z-index: 100;">
    <h1>This is my first website</h1>
    <!-- header contents -->
  </header>
  <div>
    <main>
      <!-- main contents -->
    </main>
    <div id="js-sidebar">
      <aside class="js-sticky-ad ad ad--01"><!-- ad contents --></aside>
      <aside class="js-sticky-ad ad ad--02"><!-- ad contents --></aside>
    </div>
  </div>
  <script src="https://unpkg.com/stuck-js"></script>
  <script>
  const Stuck = StuckJs.Stuck;
  const instances = new Stuck([
    { selector: '#js-header', marginTop: 0 },
    { selector: '.js-sticky-ad', wrapper: '#js-sidebar' },
  ], { marginTop: 10 });
  </script>
</body>
```

Or with a bundler:

```js
import { Stuck } from 'stuck-js'

const instances = new Stuck([
  { selector: '#js-header', marginTop: 0 },
  { selector: '.js-sticky-ad', wrapper: '#js-sidebar' },
], { marginTop: 10 })
```

## API

The package exports `Stuck` (also the default export), `Sticky` and `Placeholder`.
`Stuck` is what you normally use: it resolves selectors, creates one `Sticky` per
element and keeps them stacked. `Placeholder` is an implementation detail and you
should not need to construct it yourself.

### Options

Every setting accepts these, and `Stuck` takes the same shape as per-instance
defaults:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `marginTop` | `number` | `0` | Gap left above the element once it sticks, measured from the bottom of the sticky above it, or from the top of the window when nothing is stacked above. |
| `wrapper` | `string \| HTMLElement` | the element's `parentElement`, else `document.body` | Node that bounds the stacking. The sticky stops once it reaches the wrapper's bottom edge. |
| `observe` | `boolean` | `true` | Watch the element with a `ResizeObserver` so the reserved space follows its size. Set to `false` if the element never resizes. |

A setting also needs a target, given as **either** a selector **or** elements:

```ts
type StickySetting = StickyOptions & (
  | { selector: string }
  | { element: HTMLElement | HTMLElement[] | NodeList }
)
```

### `new Stuck(settings?, defaultOptions?, sharedStacking?)`

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `settings` | `StickySetting \| StickySetting[]` | `[]` | What to stick. Elements already registered by another instance are skipped. |
| `defaultOptions` | `StickyOptions` | `{ observe: true }` | Applied to every setting; a setting's own options win. |
| `sharedStacking` | `boolean` | `true` | Whether these stickies join the stack shared with other `Stuck` instances. With `false` they stack only among themselves. |

Throws if a setting has neither `selector` nor `element`.

#### `stuck.create(settings, sharedStacking?)` → `Sticky[]`

Registers more elements on an existing instance and re-stacks everything.
Returns the newly created stickies (empty if every element was already
registered).

#### `stuck.stickies` → `readonly Sticky[]`

The stickies this instance owns, ordered by their position on the page.

#### `stuck.destroy()`

Destroys every sticky it owns, restores the original DOM and re-stacks the
remaining stickies. The instance should not be reused afterwards — create a new
one instead.

### `new Sticky(element, options?, activate?, onUpdate?)`

The single-element primitive `Stuck` builds on. Use it directly when you already
have the element and do not need stacking across instances.

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | — | Required. |
| `options` | `StickyOptions` | `{ observe: true }` | Same options as above. |
| `activate` | `boolean` | `true` | Start listening to scroll and resize immediately. |
| `onUpdate` | `() => void` | no-op | Called after the reserved space is recalculated. |

| Member | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | The element being stuck. |
| `options` | `StickyOptions` | Resolved options, with `marginTop` always present. |
| `placeholder` | `Placeholder` | Holds the space the element leaves behind. |
| `marginTop` | `number` | Current offset, recalculated as the stack changes. |
| `isStickToBottom` | `boolean` | Whether it has reached the wrapper's bottom edge. |
| `rect` | `DOMRect` | Last measured box. |
| `floor` | `number \| undefined` | Absolute Y of the wrapper's bottom edge. |
| `update()` | `void` | Re-evaluates position. Called for you on scroll and resize. |
| `destroy()` | `void` | Restores the DOM and stops observing. Safe to call twice. |

### DOM and styling

Each sticky is wrapped in a `div` that reserves its space, and the element gets a
`data-stuck` attribute — `"true"` while stuck, `""` otherwise — so you can style
both states:

```css
.my-sticky[data-stuck='true'] { box-shadow: 0 2px 8px rgba(0, 0, 0, .2); }
```

