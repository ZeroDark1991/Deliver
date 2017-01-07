'use strict'

import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Deliver from './views/Deliver.vue'
import TankMap from './views/Map.vue'
import Tank from './views/Tank.vue'
import Aduit from './views/Aduit.vue'
import User from './views/User.vue'
import OrderList from './views/OrderList.vue'
import OrderDetail from './views/OrderDetail.vue'
import TankList from './views/TankList.vue'
import TankDetail from './views/TankDetail.vue'
import UserDetail from './views/UserDetail.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/deliver', component: Deliver },
  { path: '/user', component: User },
  { path: '/userDetail/:objectId', component: UserDetail },
  { path: '/orderlist', component: OrderList },
  { path: '/orderDetail/:objectId', component: OrderDetail },
  { path: '/map', component: TankMap },
  { path: '/aduit', component: Aduit },
  { path: '/tankList', component: TankList },
  { path: '/tankDetail/:objectId', component: TankDetail },
  // { path: '/tank', component: Tank },
  { path: '/', component: Home }
]

export default new VueRouter({
	routes
})