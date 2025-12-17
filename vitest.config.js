import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['public/tests2/**/*.test.{js,ts}'], // vain tests2
    exclude: ['**/node_modules/**', '**/public/other-tests/**'], // muut pois
  },
})