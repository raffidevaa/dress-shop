import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1024,
  chromeWebSecurity: false,
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000/',
  },
});
