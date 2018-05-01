module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parser: 'babel-eslint',
  plugins: [
    'import',
    'flowtype',
  ],
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    'no-param-reassign': ['error', { props: false }],
  },
  globals: {
    window: true,
    document: true,
  },
};
