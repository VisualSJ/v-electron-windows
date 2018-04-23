'use strict';

const { mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const windows = require('../../index');

let tmpDir = join(__dirname, '../../.examples');
if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir);
}
windows.setTmpDir(tmpDir);

app.on('ready', function () {
    if (windows.restore()) {
        return;
    }

    windows.open(`file://${__dirname}/main.html`, {
        center: true,
        width: 400,
        height: 320,
    });
});

ipcMain.on('button:create-window', (event, userData) => {
    // win.webContents.send(`${channel}:say`, msg);
    windows.open(`file://${__dirname}/sub.html`, {
        center: true,
        width: 400,
        height: 320,
    }, userData);
});
