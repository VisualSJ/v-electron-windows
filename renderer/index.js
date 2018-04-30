'use strict';

const { EventEmitter } = require('events');
const { ipcRenderer } = require('electron');

const ipcFlag = '__v-electron-windows__';

class Windows extends EventEmitter {

    constructor () {
        super();
        this.uuid = window.location.hash.substr(1);
    }

    /**
     * 获取当前的 userData
     */
    get userData () {
        if (!this.uuid) {
            return null;
        }
        return ipcRenderer.sendSync(`${ipcFlag}:call`, 'queryUserData', this.uuid);
    }

    /**
     * 更新一个窗口的 userData
     * @param {*} userData 
     */
    updateUserData (userData) {
        this.userData = userData;
        ipcRenderer.send(`${ipcFlag}:call`, 'updateUserData', this.uuid, this.userData);
    }

}

module.exports = new Windows();