const { app, Menu } = require('electron')
function createMenu () {
  let menu = [
    {
      label: 'Help',
      submenu: [
        {
          label: 'dev-tool',
          accelerator: 'CmdOrCtrl+Shift+i',
          click: (item, focusedWindow) => {
            if (focusedWindow) { focusedWindow.toggleDevTools() }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'about',
          label: 'About'
        }
      ]
    }
  ]
  menu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click (item, focusedWindow) {
          app.quit(0)
        }
      }
    ]
  })
  // darwin表示macOS，针对macOS的设置，应用菜单的第一个菜单项是应用程序的名字
  if (process.platform === 'darwin') {
    menu.unshift({
      label: `${app.getName()} v${app.getVersion()}`,
      submenu: [
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click (item, focusedWindow) {
            app.quit(0)
          }
        }
      ]
    })
  }
  menu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(menu)
}

module.exports.createMenu = createMenu
