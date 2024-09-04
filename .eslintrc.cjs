const { rule } = require('postcss')

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // recommended rules
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  // ignore files
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // check Node synax
  env: {
    node: true
  },
  // customize rules
  rule: {
    'multi-word-component-names': 'off'
  }
}
