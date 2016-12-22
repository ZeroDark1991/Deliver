// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'normalize.css'
import 'mobi.css'
import 'mint-ui/lib/style.css'
import MintUI from 'mint-ui'
import { Toast } from 'mint-ui'
import { Indicator } from 'mint-ui'
import { MessageBox } from 'mint-ui'
import VueRouter from "vue-router"
import VueResource from 'vue-resource'
import Moment from 'moment'
import './assets/trainsition.css'
import './assets/common.css'
import './assets/icon.css'
import './assets/mint_cover.css'
//transition control
// remove click delay
import Fastclick from 'fastclick'
Fastclick.attach(document.body)

import transfer from './transfer'
Vue.prototype.$transfer = new transfer()
// Vue.prototype.$MessageBox = MessageBox
Vue.prototype.$Toast = _MyToast
// Vue.prototype.$imgHandler = imgHandler
Vue.prototype.$Indicator = Indicator
Vue.prototype.$Moment = Moment
// var $Moment = require('moment');
// $Moment().format()

Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(VueResource)

function _MyToast(message){
	Toast({
		message: message,
		duration: 2000
	})
}

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: [
 	{
      path: '/home',
      component: require('./views/home.vue')
    },
    {
      path: '/center',
      component: require('./views/center.vue')
    },
    {
      path: '/order_current',
      component: require('./views/order_current.vue')
    },
    {
      path: '/order_history',
      component: require('./views/order_history.vue')
    },
    {
      path: '/myAddress',
      component: require('./views/myAddress.vue')
    },
    {
      path: '/commit_order',
      component: require('./views/commit_order.vue')
    },
    {
      path: '/myTank',
      component: require('./views/myTank.vue')
    }
  ]
})

/* eslint-disable no-new */
const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
window.$router = router
// $router.replace('/home')

