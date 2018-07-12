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
    'arrow-parens': ['error', 'as-needed'],
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    'no-param-reassign': ['error', { props: false }],
    'operator-linebreak': ['error', 'after'],
  },
  globals: {
    window: true,
    document: true,
  },
};
