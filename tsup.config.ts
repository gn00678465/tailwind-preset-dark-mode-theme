import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    external: ['unocss'],
    minify: !options.watch,
    sourcemap: true,
    experimentalDts: true,
    outExtension({ format }) {
      return {
        js: `.${format}.js`
      }
    },
  }
})