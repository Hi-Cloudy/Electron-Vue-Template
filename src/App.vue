<template>
  <div id="app">

    <div class="app-container">
      <frame-action></frame-action>
      <section class="app-main-container">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
        <div @dragstart="dragStart" style="border:2px solid black;border-radius:3px;padding:5px;display:inline-block" draggable="true">Drag me</div>
        <router-view />
      </section>
    </div>
  </div>
</template>
<script>
import FrameAction from './components/Header/FrameAction'
export default {
  data () {
    return {}
  },
  components: {
    FrameAction
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
  },
  methods: {
    dragStart (event) {
      event.preventDefault()
      window.electron.startDrag('app.png')
    }
  }
}
</script>
<style lang="scss">
@import url('./styles/normalize');
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
