export default {
  singleAttributePerLine: false,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  semi: false,
  trailingComma: 'none',
  bracketSameLine: true,
  arrowParens: 'avoid',
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '^@vezham/(.*)$',
    '^@vx-oss/(.*)$',
    '^@vx-pro/(.*)$',
    '^@vx/(.*)$',
    '^(?:@/|@src/|@app/|@config/|@pages/|@layouts/|@components/|@routes/|@store/|@generated/)(.*)$',
    '^[./]'
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindAttributes: ['className'],
  tailwindFunctions: ['tv', 'cva', 'cn', 'clsx']
}
