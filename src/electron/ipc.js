const { ipcMain, Menu, BrowserWindow, app } = require('electron')
const path = require('path')
const registerMessage = () => {
  ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: 'Menu Item 1',
        click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
      },
      { type: 'separator' },
      {
        label: 'Menu Item 2',
        click: () => { event.sender.send('context-menu-command', 'menu-item-2') }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  })

  ipcMain.on('ondragstart', (event, fileName) => {
    event.sender.startDrag({
      /**
       * The path(s) to the file(s) being dragged.
       */
      file: path.join(__dirname, fileName),
      /**
        * The image must be non-empty on macOS.
        * 文件预览
        */
      // eslint-disable-next-line no-undef
      icon: path.join(__dirname, fileName)
    })
  })

  ipcMain.on('window-min', () => {
    global.mainWindow.minimize()
  })

  ipcMain.on('window-max', () => {
    if (global.mainWindow.isMaximized()) {
      global.mainWindow.restore()
    } else {
      global.mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    const wins = BrowserWindow.getAllWindows()
    for (let i = 0; i < wins.length; i++) {
      wins[i].hide()
      wins[i].close()
    }
    app.exit()
  })
}
module.exports.registerMessage = registerMessage
