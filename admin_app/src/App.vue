<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store'
export default {
  name: 'app',
  store
}
</script>

<style lang="stylus" scoped>
#app
  font-size 22px
</style>
