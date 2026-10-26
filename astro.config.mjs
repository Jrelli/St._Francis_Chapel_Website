// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import { site } from './src/config/site.ts';
import { unconfirmedFacts } from './src/lib/config.ts';

/** Prints unconfirmed config facts at the end of every build, as a standing reminder. */
const unconfirmedReport = {
  name: 'unconfirmed-facts-report',
  hooks: {
    /** @param {{ logger: import('astro').AstroIntegrationLogger }} options */
    'astro:build:done': ({ logger }) => {
      const pending = unconfirmedFacts(site);
      if (pending.length === 0) return;
      logger.warn(
        `${pending.length} site facts are still unconfirmed (see CONTENT_TO_CONFIRM.md):\n` +
          pending.map(({ path }) => `  - ${path}`).join('\n'),
      );
    },
  },
};

export default defineConfig({
  site: site.url.value,
  trailingSlash: 'always',

  integrations: [sitemap(), unconfirmedReport],

  // Typed, validated environment variables. Only `context: 'client'` values can reach
  // the browser; the build-time key is a server secret and never appears in page output.
  env: {
    schema: {
      GOOGLE_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_GOOGLE_CALENDAR_BROWSER_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },

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
