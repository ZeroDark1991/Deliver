import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    transitionName: 'fade',
    isNotLogin: true,
    userInfo: null,
    currentOrder:[],
    orderList:[],
    deliver: null
  },
  mutations: {
    nextPage: state => state.transitionName = 'slide-left',
    backPage: state => state.transitionName = 'slide-right',
    loginSuccess: state => state.isNotLogin = false,
    saveUserInfo: (state, user) => (
    	state.userInfo = user
    ),
    saveCurrentOrder: (state, array) => (
    	state.currentOrder = array
    ),
    saveOrderList: (state, array) => (
    	state.orderList = array
    ),
    saveDeliver: (state, json) => (
    	state.deliver = json
    ),
  }
})

export default store