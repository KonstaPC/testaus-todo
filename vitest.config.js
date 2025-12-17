import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['public/tests2/**/*.test.{js,ts}'], // oikea polku
    exclude: ['**/node_modules/**'],
  },
})