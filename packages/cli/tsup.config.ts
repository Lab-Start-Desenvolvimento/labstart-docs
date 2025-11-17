import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  target: 'node20',
  outDir: 'dist',
  banner: {
    js: '#!/usr/bin/env node'
  }
})