const { ipcMain, Menu, BrowserWindow } = require('electron')
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
}
module.exports.registerMessage = registerMessage
