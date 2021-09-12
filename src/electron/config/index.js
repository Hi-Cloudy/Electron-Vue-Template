import path from 'path'
import pk from '../../../package.json'

function getUserBasePath () {
  const userHome = process.env.USERPROFILE || process.env.HOME || '/'
  return path.resolve(userHome, './.tomato')
}
const SCHEME = 'app'
const LOAD_URL = `${SCHEME}://./index.html`
const configFileName = 'tomato.setting.json5'
const apiBaseURL = 'http://localhost:8080/'

export default {
  app: {
    appName: 'APP',
    version: pk.version,
    apiBaseURL,
    scheme: SCHEME,
    loadURL: LOAD_URL
  },
  setting: {
    configFileName,
    userBasePath: getUserBasePath()
  }
}
