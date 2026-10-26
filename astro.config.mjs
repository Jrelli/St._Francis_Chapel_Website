// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://saintfrancischapel.com',
  trailingSlash: 'always',

  integrations: [sitemap()],

  build: {
    // Always emit CSS as files (never inline <style>) so our CSP can forbid inline styles.
    inlineStylesheets: 'never',
  },

  vite: {
    build: {
      // Same reason for scripts: Astro inlines small scripts unless this is 0.
      assetsInlineLimit: 0,
    },
  },
});
