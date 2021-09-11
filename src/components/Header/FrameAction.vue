<template>
  <div class="frame-action">
    <div class="left"></div>
    <div class="right">
      <a @click="setFrame('window-min')" href="javascript:void(0)">-</a>
      <a class="max" @click="setFrame('window-max')" href="javascript:void(0)">口</a>
      <a @click="setFrame('window-close')" href="javascript:void(0)">x</a>
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
    setFrame (action) {
      window.electron.send(action)
    }
  }
}
</script>
<style lang="scss">
.frame-action {
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  line-height: 40px;
  background-color: transparent;
  .right {
    -webkit-app-region: no-drag;
    a {
      font-weight: bold;
      text-decoration: none;
      list-style: none;
      color: rgb(0, 0, 0);
      font-size: 23px;
      margin: 10px;
    }
    .max {
      font-size: 16px;
    }
  }
}
</style>
