// ESLint "flat config". Lints TypeScript and .astro files, including accessibility rules
// (missing alt text, unlabeled controls, invalid ARIA, etc.).
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'media/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // Safari drops list semantics for screen readers when `list-style: none` is set,
      // so role="list" on unstyled <ul>s is intentional, not redundant.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'] }],
    },
  },
];
