const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    ...tsjPreset.transform,
  },
};
