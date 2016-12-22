'use strict'

import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Deliver from './views/Deliver.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/deliver', component: Deliver },
  { path: '/', component: Home }
]

export default new VueRouter({
	routes
})