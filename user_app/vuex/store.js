import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    transitionName: 'fade',
    isNotLogin: true,
    userInfo: null
  },
  mutations: {
    nextPage: state => state.transitionName = 'slide-left',
    backPage: state => state.transitionName = 'slide-right',
    checkLogin: state => state.isNotLogin = false,
    saveUserInfo: (state, user) => (
    	state.userInfo = user
    ),
  }
})

export default store