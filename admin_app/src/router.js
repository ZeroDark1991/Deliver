'use strict'

import VueRouter from 'vue-router'

import Home from './views/Home.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/', component: Home }
]

export default new VueRouter({
	routes
})