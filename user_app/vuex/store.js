import Vue from 'vue'
import Vuex from 'vuex'

// 告诉 vue “使用” vuex
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    transitionName: 'fade',
    isNotLogin: true,
    userInfo: null,
    currentOrder:null,
    orderList:null,
  },
  mutations: {
    nextPage: state => state.transitionName = 'slide-left',
    backPage: state => state.transitionName = 'slide-right',
    noTransfer: state => state.transitionName = '',
    loginSuccess: state => state.isNotLogin = false,
    notLogin: state => state.isNotLogin = true,
    saveUserInfo: (state, json) => {
    	state.userInfo = json
    },
    saveCurrentOrder: (state, json) => {
    	state.currentOrder = json
    },
    saveOrderList: (state, list) => {
    	state.orderList = list
    },
  }
})

export default store