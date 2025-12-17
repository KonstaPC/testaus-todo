import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests2/**/*.test.{js,ts}'], // ajetaan vain tests2-kansion testit
    exclude: ['**/node_modules/**'],        // normaali ignore
  },
})