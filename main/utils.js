'use strict';

const { statSync, exists, existsSync, writeFile, readFileSync } = require('fs');
const { join } = require('path');

/**
 * 保存 json 信息
 * @param {*} dir 
 * @param {*} json 
 */
let _saveJsonLock = false;
let saveJson = function (dir, json) {
    if (_saveJsonLock) {
        return;
    }
    _saveJsonLock = true;
    exists(dir, (exists) => {
        if (!exists) {
            return;
        }
        writeFile(join(dir, 'v-electron-windows.json'), JSON.stringify(json, null, 4));
        _saveJsonLock = false;
    });
};

/**
 * 读取 json 文件
 * @param {*} dir 
 */
let readJson = function (dir) {
    if (!existsSync(dir)) {
        console.warn(`Folder does not exist, Windows data cannot be saved. (${dir})`);
    }
    let stat = statSync(dir);
    if (!stat.isDirectory()) {
        console.warn(`The incoming temporary path is not a folder, Windows data cannot be saved. (${dir})`);
    }

    let path = join(dir, 'v-electron-windows.json');
    if (!existsSync(path)) {
        return {
            version : 1,
            windows: [],
        };
    }

    return JSON.parse(readFileSync(path));
};

/**
 * 在 window 上监听事件
 * @param {*} manager 
 * @param {*} uuid 
 */
let mountEvent = function (manager, uuid) {
    let win = manager.uuid2win[uuid];
    let info = manager.uuid2info[uuid];

    win.on('close', () => {
        let index = manager.cache.windows.indexOf(info);

        if (index > 0) {
            delete manager.uuid2win[info.uuid];
            delete manager.uuid2info[info.uuid];
            manager.cache.windows.splice(index, 1);
            saveJson(manager._jsonPath, manager.cache);
        } else if (index === 0) {
            Object.keys(manager.uuid2win).forEach((uuid) => {
                let win = manager.uuid2win[uuid];
                let info = manager.uuid2info[uuid];
                info.bounds = win.getBounds();
                win.removeAllListeners('close');
                win.close();
            });
            saveJson(manager._jsonPath, manager.cache);
        }
    });
};

module.exports = {
    saveJson,
    readJson,
    mountEvent,
};