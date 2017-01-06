'use strict'

import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Deliver from './views/Deliver.vue'
import TankMap from './views/Map.vue'
import Tank from './views/Tank.vue'
import Aduit from './views/Aduit.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/deliver', component: Deliver },
  { path: '/map', component: TankMap },
  { path: '/aduit', component: Aduit },
  { path: '/tank', component: Tank },
  { path: '/', component: Home }
]

export default new VueRouter({
	routes
})