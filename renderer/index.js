'use strict';

const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');

const ipcFlag = '__v-electron-windows__';

class WindowManager extends EventEmitter {

    constructor () {
        super();
        this.uuid = window.location.hash.substr(1);
        this.userData = ipcRenderer.sendSync(`${ipcFlag}:call`, 'queryUserData', this.uuid);
    }

    updateUserData (userData) {
        this.userData = userData;
        ipcRenderer.send(`${ipcFlag}:call`, 'updateUserData', this.uuid, this.userData);
    }

}

module.exports = new WindowManager();