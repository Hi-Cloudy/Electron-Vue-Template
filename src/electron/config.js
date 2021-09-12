import fs from 'fs'
import path from 'path'
import JSON5 from 'json5'
import lodash from 'lodash'
import baseConfig from './config/index.js'

let config = lodash.cloneDeep(baseConfig)

function get () {
  return config
}

const getDefaultConfigBasePath = () => {
  return get().setting.userBasePath
}

/**
 * 获取配置文件名
 * @returns
 */
const getConfigFileName = () => {
  return get().setting.configFileName
}

/**
 * 获取配置文件位置
 * @returns
 */
function getConfigFullPath () {
  const dir = getDefaultConfigBasePath()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  const fileFullPath = path.join(dir, getConfigFileName())
  return fileFullPath
}
/**
 * 删除空属性
 * @param {*} target
 */
function deleteDisabledItem (target) {
  lodash.forEach(target, (item, key) => {
    if (item == null) {
      delete target[key]
    }
    if (lodash.isObject(item)) {
      deleteDisabledItem(item)
    }
  })
}

export default {
  get,
  set (newConfig) {
    if (newConfig == null) {
      return
    }
    const merged = lodash.cloneDeep(newConfig)
    const clone = lodash.cloneDeep(baseConfig)
    function customizer (objValue, srcValue) {
      if (lodash.isArray(objValue)) {
        return srcValue
      }
    }
    lodash.mergeWith(merged, clone, customizer)
    lodash.mergeWith(merged, newConfig, customizer)
    deleteDisabledItem(merged)
    config = merged
    return config
  },
  getDefault () {
    return lodash.cloneDeep(baseConfig)
  },
  getConfigFullPath,
  /// //////////////////////////// /////////////////////////
  save (newConfig) {
    const sourceConfig = this.getDefault()
    const saveConfig = lodash.assign(sourceConfig, newConfig)
    fs.writeFileSync(getConfigFullPath(), JSON5.stringify(saveConfig, null, 2))
    this.reload()
    return saveConfig
  },
  reload () {
    const path = getConfigFullPath()
    if (!fs.existsSync(path)) {
      return this.get()
    }
    const file = fs.readFileSync(path)
    const userConfig = JSON5.parse(file.toString())
    this.set(userConfig)
    return this.get() || {}
  }
}
