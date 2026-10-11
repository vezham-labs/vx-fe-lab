/** @type {import('stylelint').Config} */
export default {
  defaultSeverity: 'error',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-prettier/recommended'
  ],
  rules: {
    'declaration-property-unit-allowed-list': {
      'font-size': ['rem'],
      '/^padding|^gap/': ['rem'],
      '/^animation/': ['ms']
    },
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:--[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?$',
      {
        severity: 'error',
        message:
          'Expected a BEM class: block, block__element, block--modifier, or block__element--modifier (kebab-case words)'
      }
    ],
    'unit-allowed-list': ['rem', 'vw', 'oklch', 'deg', '%', 'ms'],
    'color-no-hex': true,
    'color-no-invalid-hex': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          '/^tailwind/',
          'apply',
          'config',
          'custom-variant',
          'plugin',
          'reference',
          'source',
          'theme',
          'utility',
          'variant'
        ]
      }
    ],
    'hue-degree-notation': 'number',
    'color-function-notation': ['legacy'],
    'no-descending-specificity': null,
    'import-notation': null
  }
}
