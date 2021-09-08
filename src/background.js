'use strict'

import { app, protocol, BrowserWindow, Menu, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win = null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      webSecurity: false, // 取消跨域限制
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // 在渲染进程使用 node 模块,ELECTRON_NODE_INTEGRATION对应 vue.config.js 中的 nodeIntegration 属性
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      /**
      *
      * remote 模块默认是被禁用的，需要在主进程的 BrowserWindow中
      * 通过设置 enableRemoteModule 选项为 true 来开启
      * remote 模块提供了一种在渲染进程（网页）和主进程之间进行进程间通讯（IPC）的简便途径。
      * Electron中, 与GUI相关的模块（如dialog, menu等)只存在于主进程，而不在渲染进程中。
      * 为了能从渲染进程中使用它们，需要用ipc模块来给主进程发送进程间消息。
      * 使用remote模块，可以调用主进程对象的方法，而无需显式地发送进程间消息。
      *
      *   如下
      *     const { BrowserWindow } = require('electron').remote
      *     let win = new BrowserWindow({ width: 800, height: 600 })
      *     win.loadURL('https://github.com')
      */
      enableRemoteModule: true
      // fullscreen: true,
      // skipTaskbar: false,
      // fullscreenable: true,
      // simpleFullscreen: true
    },
    // windows: app.ico 最小尺寸：256x256 macOS: app.png或app.icns 最小尺寸：512x512
    // eslint-disable-next-line no-undef
    icon: `${__static}/icons/icon.ico` // __static 项目的 public 目录的绝对路径
    // frame: false // 取消外边框
  })
  // 去掉窗口顶部菜单
  win.setMenu(null)

  // 全屏时不能挡住下方任务栏
  win.maximize()
  // 全屏时可以挡住下方任务栏
  // win.setFullScreen(true)

  // 注册菜单
  createMenu()

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode

    // process.env.WEBPACK_DEV_SERVER_URL对应本地启动服务的url地址，如：http://localhost:8080
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // 开发环境下注册快捷键，切换打开 开发者工具
      // 在windows下，按Ctrl + Shift + i即可打开devTools
      // 在macOS下，按Commond + Shift + i即可打开devTools
      globalShortcut.register('CommandOrControl+Shift+i', function () {
        // win.webContents.openDevTools()
        // 在当前窗口打开 开发者工具
        BrowserWindow.getFocusedWindow().webContents.toggleDevTools()
      })
      // await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindow()
})

/**
 * 设置菜单栏
 */
function createMenu () {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'APP',
        submenu: [
          {
            role: 'about'
          },
          {
            role: 'quit'
          }]
      }]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null)
  }
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
