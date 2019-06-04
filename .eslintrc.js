module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'standard',
    'prettier',
    'prettier/standard',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: false,
    },
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  rules: {
    'lines-between-class-members': 'off',
    /*
     * https://github.com/typescript-eslint/typescript-eslint/issues/389#issuecomment-478389548
     */
    '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    // ======================================================
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
  },
  globals: {
    window: true,
    document: true,
  },
};
