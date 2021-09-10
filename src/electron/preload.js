import { contextBridge, ipcRenderer } from 'electron'
window.ipcRenderer = ipcRenderer
console.log('Add IPC Support')

// eslint-disable-next-line no-unused-vars
const flatten = (obj) => Object.keys(obj)
  .reduce((acc, key) => {
    const val = obj[key]
    return acc.concat(typeof val === 'object' ? flatten(val) : val)
  }, [])

/**
   *  renderer中使用方式
      window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        window.electron.send('show-context-menu')
      })
      window.electron.receive('context-menu-command', (data) => {
        console.log(data)
      })
   */
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  send: (channel, data) => {
    const validChannels = ['toMain', 'show-context-menu']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain', 'context-menu-command']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
// https://stackoverflow.com/questions/55164360/with-contextisolation-true-is-it-possible-to-use-ipcrenderer/59675116#59675116

// document.addEventListener('DOMNodeInserted', (event) => {
//   // 页面内容加载之前
// })

// document.addEventListener('DOMContentLoaded', (event) => {
//   // 页面内容加载之后

// })
