# Electron 窗口管理（渲染进程）

模块在渲染进程主要是负责当前窗口的数据查询以及操作。

## methods

### windows.userData

当前窗口的 userData 数据，每次都会从主进程查询一次数据，所以需要避免频繁的调用这个方法。

### window.updateUserData(userData)

- userData 当前窗口携带的用户数据

更新当前窗口上的用户数据记录