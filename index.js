'use strict';

const { isMainProcess } = require('electron-platform');

if (isMainProcess) {
    module.exports = require('./main');
} else {
    module.exports = require('./renderer');
}