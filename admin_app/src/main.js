// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Element from 'element-ui'

import 'normalize.css'
import 'element-ui/lib/theme-default/index.css'

Vue.use(Element)
Vue.use(VueRouter)

/* eslint-disable no-new */
import router from './router'
import store from './store'

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
