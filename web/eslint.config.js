import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      'react/button-has-type': 'error',
      'react/checked-requires-onchange-or-readonly': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/no-array-index-key': 'error',
      'react/void-dom-elements-no-children': 'error',
      'react/forward-ref-uses-ref': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'no-shadow': 'error',
      'no-console': 'warn',
    },
  },
);
