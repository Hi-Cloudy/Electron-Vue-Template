<template>
  <div class="title-bar">
    <div class="title-bar-left">
      <strong>App</strong>
    </div>
    <div class="title-bar-right">
      <div class="window-controls-container">
        <a-icon type="minus" class="item" @click="setFrameAction('window-min')" />
        <a-icon type="border" class="item" @click="setFrameAction('window-max')" />
        <a-icon type="close" class="item close" @click="setFrameAction('window-close')" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    setFrameAction (action) {
      window.electron.send(action)
    }
  }
}
</script>
<style lang="scss">
.title-bar {
  background-color: #fff;
  height: 36px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-app-region: drag;
  .title-bar-right {
    .window-controls-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      -webkit-app-region: no-drag;
      .item {
        padding: 0 4px;
        line-height: 36px;
        width: 32px;
        height: 32px;
        vertical-align: unset;
        font-size: 18px;
        cursor: pointer;
        &:hover {
          background-color: #d0d2d5;
        }
      }
      & .close:hover {
        background-color: #e81123;
        color: #fff;
      }
    }
  }
}
</style>
