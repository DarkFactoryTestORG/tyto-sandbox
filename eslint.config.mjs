// One flat config for every TS package. Rust is linted by clippy (crates/textkit's lint script).
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      'target/**',
      'reports/**',
      '**/test-results/**',
      '**/playwright-report/**',
      'packages/textkit/index.js',
      'packages/textkit/index.d.ts',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      eqeqeq: ['error', 'smart'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui-kit/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // Playwright fixtures call `use()`, which is not React's hook.
    files: ['apps/web/e2e/**'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    // Nest resolves constructor parameters from emitted type metadata, so injected classes must be
    // value imports, not `import type`.
    files: ['apps/api/src/**/*.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': 'off' },
  },
  {
    files: ['**/*.{js,mjs,cjs}', 'scripts/**', 'packages/db/src/cli/**'],
    rules: { 'no-console': 'off' },
  },
);
