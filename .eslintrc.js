module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 要求使用骆驼拼写法
    camelcase: [
      'error',
      {
        properties: 'never', // 不检查属性名称
        ignoreDestructuring: true // 不检查解构标识符
      }
    ]
  }
}
