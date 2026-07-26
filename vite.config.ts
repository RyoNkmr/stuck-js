import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// mode=docs のときは GitHub Pages 用に docs/index.js を非圧縮で出力する
export default defineConfig(({ mode }) => {
  const isDocs = mode === 'docs'

  return {
    build: {
      target: 'es2018',
      outDir: isDocs ? 'docs' : 'lib',
      // docs には手書きの HTML/CSS があるので消さない
      emptyOutDir: !isDocs,
      minify: !isDocs,
      sourcemap: isDocs ? 'inline' : false,
      lib: {
        entry: 'src/index.ts',
        name: 'StuckJs',
        formats: isDocs ? ['umd'] : ['umd', 'es'],
        fileName: format => (format === 'umd' ? 'index.js' : 'index.mjs'),
      },
      rollupOptions: {
        // 従来の webpack UMD と同じく StuckJs.Stuck で参照できるようにする
        output: { exports: 'named' },
      },
    },
    test: {
      include: ['specs/**/*.spec.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  }
})
