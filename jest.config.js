const { jsWithTs: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    ...tsjPreset.transform,
  },
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
};
