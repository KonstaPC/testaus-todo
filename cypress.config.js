// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'public/e2etestit/cypress/e2e/**/*.cy.{js,ts}', // kaikki testit tässä kansiossa
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
})