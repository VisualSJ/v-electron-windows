'use stirct';

const { join } = require('path');
const { EventEmitter } = require('events');
const { BrowserWindow, ipcMain } = require('electron');
const uuidV4 = require('uuid/v4');

const utils = require('./utils');

const ipcFlag = '__v-electron-windows__';

class WindowManager extends EventEmitter {

    constructor () {
        super();
        
        this.uuid2win = {};
        this.uuid2info = {};
        this.setTmpDir(join(__dirname, '../.tmp'));
    }

    /**
     * 设置存储一些临时数据的文件夹
     * @param {string} path 临时目录，需要外部保证目录存在
     */
    setTmpDir (path) {
        this._jsonPath = path;
        this.cache = utils.readJson(path);
    }

    /**
     * 恢复上次关闭前的 windows 状态
     */
    restore () {
        if (!this.cache || !this.cache.windows || !this.cache.windows.length) {
            return false;
        }

        this.cache.windows.forEach((info) => {
            let win = new BrowserWindow(info.options);
            win.loadURL(`${info.url}#${info.uuid}`);
            win.setSize(info.bounds.width, info.bounds.height);
            win.setPosition(info.bounds.x, info.bounds.y);

            this.uuid2win[info.uuid] = win;
            this.uuid2info[info.uuid] = info;

            // 监听事件
            utils.mountEvent(this, info.uuid);
        });

        return true;
    }

    /**
     * 打开一个新窗口
     * @param {string} url 窗口加载的页面地址
     * @param {object} options electron 窗口的参数
     * @param {object} userData 窗口携带的自定义数据
     */
    open (url, options, userData) {
        options = options || {};
        userData = userData || {};
        let uuid = uuidV4();

        // 打开窗口
        let win = new BrowserWindow(options);
        win.loadURL(`${url}#${uuid}`);

        // 缓存信息
        let info = {
            uuid: uuid,
            url: url,
            options: JSON.parse(JSON.stringify(options)),
            userData: userData,
            bounds: null,
        };
        this.cache.windows.push(info);
        this.uuid2win[uuid] = win;
        this.uuid2info[uuid] = info;

        // 监听事件
        utils.mountEvent(this, uuid);
        return uuid;
    }

    /**
     * 查询一个窗口的 userData
     * @param {*} uuid 
     */
    queryUserData (uuid) {
        let info = this.uuid2info[uuid];
        return info ? info.userData : {};
    }

    /**
     * 更新一个窗口的 userData
     * @param {*} uuid 
     * @param {*} userData 
     */
    updateUserData (uuid, userData) {
        let info = this.uuid2info[uuid];
        info.userData = userData || {};
    }
}

module.exports = new WindowManager();

// 渲染进程需要调用主进程的方法
ipcMain.on(`${ipcFlag}:call`, (event, func, ...args) => {
    event.returnValue = module.exports[func](...args);
});