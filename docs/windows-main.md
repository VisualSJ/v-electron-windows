# Electron 窗口管理（主进程）

模块在主进程主要是负责窗口的管理以及数据的管理。

## methods

### windows.setTmpDir(path)

- path 文件夹的路径

这个方法用于设置一个临时目录，存储运行过程中产生的一些临时文件。

### windows.restore

恢复上一次关闭前保存的窗口

### windows.open(url, options, userData)

- url 窗口需要家在的页面路径
- options electron 窗口的参数
- userData 用户可以自定义的窗口携带数据

Returns `uuid` - 窗口的唯一 id，用于查询和设置数据等操作

打开一个新窗口，第一个打开的窗口为主窗口，主窗口关闭的时候，会关闭所有的子窗口，并且记录下当前的状态

### windows.queryUserData(uuid)

- uuid 窗口的 id

Returns `userData` - 用户数据对象

查询某个窗口的用户数据

### windows.updateUserData(uuid, userData)

- uuid 窗口的 id
- userData 用户数据

更新某个窗口的用户数据