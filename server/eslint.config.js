import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'all', argsIgnorePattern: '^_' },
      ],
    },
  },
]);
