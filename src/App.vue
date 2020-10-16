<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: auto;
}

::-webkit-scrollbar {
    width: 4px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #E0E3E7;
    height: 20px;
}
</style>
