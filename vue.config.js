const path = require('path')
// 引入package.json 以获取文件中的项目信息
const PACKAGE = require('./package.json')
const config = {
  productName: PACKAGE.name,
  version: PACKAGE.version
}

function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = 8520

module.exports = {
  publicPath: './',
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('components', resolve('src/components'))
  },
  pluginOptions: {
    electronBuilder: {
      // 渲染进程默认禁止使用node模块
      nodeIntegration: false,
      preload: './src/electron/preload.js',
      builderOptions: {
        asar: false,
        productName: `${config.productName}`, // 项目、exe的名称
        appId: 'com.tomato.template', // 应用程序id
        copyright: 'Copyright © 2021 Tomato', // 应用程序版权行
        publish: [
          {
            provider: 'generic', // 可为github
            url: 'http://127.0.0.1:8080/'
          }
        ],
        directories: {
          output: 'dist_electron' // 打包输出的目录，相对于项目根路径
        },
        win: {
          legalTrademarks: 'Copyright © 2021 Tomato', // 商标注册
          publisherName: 'Tomato', // 发行者名称，与代码签名证书中的名称完全相同
          requestedExecutionLevel: 'highestAvailable', // 应用程序请求执行的安全级别。
          icon: './public/icons/icon.ico',
          target: [
            {
              target: 'nsis', // 目标包类型
              arch: ['ia32'] // ia32:属于X86体系结构的du32位版本, x64:64位版本
            }
          ],
          // 没有配置 nsis 的时候的安装包名，此配置项会被 nsis 覆盖
          artifactName: `${config.productName}.exe`
        },
        mac: {
          identity: 'com.tomato.template',
          target: ['dmg'],
          icon: './public/icons/256x256.png'
        },
        dmg: {
          title: `${config.productName}`,
          // artifactName: `${config.productName}.dmg`,
          icon: './public/icons/256x256.png',
          contents: [
            { x: 410, y: 150, type: 'link', path: '/Applications' },
            { x: 130, y: 150, type: 'file' }
          ]
        },
        linux: {
          icon: './public/icons/256x256.png'
        },
        nsis: {
          // 创建一键安装程序还是辅助安装程序
          oneClick: false,
          // 是否允许用户更改安装目录。
          allowToChangeInstallationDirectory: true,
          // 是否为辅助安装程序显示安装模式安装程序页(选择每台计算机或每用户)。或者是否总是按所有用户(每台机器)安装
          perMachine: true,
          // 允许申请提升。如果为false，用户将不得不以提升的权限重启安装程序
          allowElevation: true,
          // 打出的安装包名称，默认 ${productName} Setup ${version}.${ext}，${productName} 对应productName 或 package.json 中的name， ${version}对应 package.json 中的 version
          artifactName: `${config.productName}-Setup-V${config.version}.exe`,
          // 完成后是否运行已安装的应用程序。对于辅助安装程序，相应的复选框将被删除
          runAfterFinish: true,
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true,
          // 用于所有快捷方式的名称。默认为应用程序名称，即 productName 的值，如果 productName 没有设置，则默认是 package.json 中的 name，如果name 也没有设置，将报错
          shortcutName: `${config.productName}`
        }
      }
    }
  }
}
