import log4js from 'log4js'
import path from 'path'

import config from './config'

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info'
const filename = path.join(config.get().setting.userBasePath, '/logs/log.log')
log4js.configure({
  appenders: {
    std: { type: 'stdout' },
    file: { type: 'file', pattern: 'yyyy-MM-dd', daysToKeep: 30, filename }
  },
  categories: {
    default: {
      appenders: ['file', 'std'], level
    }
  }
})
const logger = log4js.getLogger('app')
export default logger
