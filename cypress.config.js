const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Testihakemisto, muokkaa tarpeen mukaan
    specPattern: 'wikipediateht/tests3/**/*.test.js',
    baseUrl: 'https://fi.wikipedia.org',
    supportFile: false
  }
})