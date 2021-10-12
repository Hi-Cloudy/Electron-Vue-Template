import { spawn } from 'child_process'
import path from 'path'
import logger from './log'

export default class Install {
  constructor(app) {
    this.app = app
    this.quitAndInstallCalled = false
  }

  quitAndInstall (isSilent = false, isForceRunAfter = false, isAdminRightsRequired = false) {
    let isInstalled
    try {
      isInstalled = this.doInstall({ isSilent, isForceRunAfter, isAdminRightsRequired })
      if (isInstalled) {
        setImmediate(() => {
          this.app.quit()
        })
      } else {
        this.quitAndInstallCalled = false
      }
    } catch (e) {
      this.quitAndInstallCalled = false
    }
  }

  doInstall (options) {
    this.quitAndInstallCalled = true
    const args = ['--updated']
    if (options.isSilent) {
      args.push('/S')
    }
    if (options.isForceRunAfter) {
      args.push('--force-run')
    }

    // /NCRC disables the CRC check, unless CRCCheck force was used in the script.
    // /S runs the installer or uninstaller silently.See section 4.12 for more information.
    // /D sets the default installation directory ($INSTDIR), overriding InstallDir and InstallDirRegKey. It must be the last parameter used in the command line and must not contain any quotes, even if the path contains spaces.Only absolute paths are supported.
    const callUsingElevation = () => {
      this._spawn(path.join(process.resourcesPath, 'elevate.exe'), [options.installerPath].concat(args)).catch(e => {
        logger.info(e)
        return false
      })
    }
    if (options.isAdminRightsRequired) {
      logger.info('isAdminRightsRequired is set to true, run installer using elevate.exe')
      callUsingElevation()
      return true
    }
    this._spawn(options.installerPath, args).catch((e) => {
      // https://github.com/electron-userland/electron-builder/issues/1129
      // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
      const errorCode = e.code
      logger.info(`Cannot run installer: error code: ${errorCode}, error message: "${e.message}", will be executed again using elevate if EACCES"`)
      if (errorCode === 'UNKNOWN' || errorCode === 'EACCES') {
        callUsingElevation()
      } else {
        logger.info(e)
      }
      return false
    })
    return true
  }

  _spawn (exe, args) {
    return new Promise((resolve, reject) => {
      try {
        const process = spawn(exe, args, {
          detached: true,
          stdio: 'ignore'
        })
        process.on('error', error => {
          reject(error)
        })
        process.unref()
        if (process.pid !== undefined) {
          resolve(true)
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}
