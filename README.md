# Stuck.js

[![CircleCI](https://circleci.com/gh/RyoNkmr/stuck-js/tree/master.svg?style=svg)](https://circleci.com/gh/RyoNkmr/stuck-js/tree/master)

A sticky library handles stack of stickies and supports scrollX without dependencies(like jQuery)
Demo: https://ryonkmr.github.io/stuck-js/

## Quickstart

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
  <script src="lib/stuck.js"></script>
  <script>
  const Stuck = StuckJs.Stuck;
  const instances = new Stuck([
    { selector: '#js-header', marginTop: 0 },
    { selector: '.js-sticky-ad', wrapper: '#js-sidebar' },
  ], { marginTop: 10 });
  </script>
</body>
```

