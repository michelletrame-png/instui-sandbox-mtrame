import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import instui from './eslint-rules/index.js'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { instui },
    rules: {
      'instui/no-hardcoded-hex': 'warn',
      'instui/no-hardcoded-border-radius': 'warn',
      'instui/no-theme-name-detection': 'warn',
      'instui/no-style-color': 'warn',
      'instui/no-style-border': 'warn',
      'instui/no-primitives-access': 'warn',
      'instui/no-raw-div-layout': 'warn',
      'instui/no-pixel-spacing': 'warn',
      'instui/flex-item-shadow-clip': 'warn',
      'instui/no-flex-item-without-behavior': 'warn',
      'instui/view-background-needs-override': 'warn',
      'instui/button-text-max-words': 'warn',
    },
  },
])
