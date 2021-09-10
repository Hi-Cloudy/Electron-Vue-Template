<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  mounted () {
    // renderer
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      window.electron.send('show-context-menu')
    })

    window.electron.receive('context-menu-command', (data) => {
      console.log(data)
    })
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.drag {
  -webkit-app-region: drag;
  user-select: none;
}
</style>
