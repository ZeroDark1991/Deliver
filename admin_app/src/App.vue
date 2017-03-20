<template>
  <div id="app">
	  <div class="wrapper">
	  	<nav-bar></nav-bar>
	  	<side-bar :active="activedPath"></side-bar>
	  	<div class="content">
	   		<router-view></router-view>
	  	</div>
  	</div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'

export default {
  name: 'app',
  data(){
  	return {
  		activedPath: '/home'
  	}
  },
  components: {
  	NavBar,
  	SideBar
  },
  created(){
  	this.activedPath = this.$route.path == '/'
      ? '/home'
      : this.$route.path
  }
}
</script>

<style lang="stylus" scoped>
#app
  height 100%
  width 100%
.wrapper
	height 100%
	min-height 600px
  position relative
  overflow hidden
.content
  position absolute
  top 56px
  left 200px
  right 0
  bottom 0
  background-color #fcfcfc
  overflow hidden
  overflow-y auto
  padding 10px
</style>
