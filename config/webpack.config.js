'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    background: PATHS.src + '/background.js',
    content: PATHS.src + '/content.js',
    devtools: PATHS.src + '/devtools.js',
    panel: PATHS.src + '/panel.js',
  },
});

module.exports = config;
