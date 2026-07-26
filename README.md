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

