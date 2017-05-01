<template>
  <div id="app">
	  <div class="wrapper">
	  	<nav-bar></nav-bar>
	  	<side-bar :level="level" :active="activedPath"></side-bar>
	  	<div class="content">
	   		<router-view></router-view>
	  	</div>
  	</div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import agent from './util/agent'

export default {
  name: 'app',
  data(){
  	return {
  		activedPath: '/home',
      level: {
        home: true,
        user: false,
        deliver: false,
        orderList: false,
        aduit: false,
        tankList: false,
        map: false
      }
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

    agent.get('/api/app/adminLevel')
      .then(res => {
        console.log(res)
        if(!res.success) {
          window.location = '/login.html'
        } else {
          if(res.type === 'Admin') {
            this.level = {
              home: true,
              tankList: true,
              map: true,
              deliver: true
            }
          }
          if(res.type === 'Super') {
            this.level = {
              home: true,
              user: true,
              deliver: true,
              orderList: true,
              aduit: true,
              tankList: true,
              map: true
            }
          }
        }
      })
      .catch(e => {
        alert(e)
        window.location = '/admin/login.html'
      })
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
