import Vue from 'vue'
import Vuex from 'vuex'
// 告诉 vue “使用” vuex
Vue.use(Vuex)
import agent from '../util/agent'

const store = new Vuex.Store({
	state: {
		transitionName: 'fade',
		isNotLogin: true,
		open: false,
		userInfo: null,
		currentOrder:null,
		orderList:null,
		logSuccessCallback:null
	},
	mutations: {
		nextPage (state) {
			state.transitionName = 'slide-left'
		},
		backPage: state => state.transitionName = 'slide-right',
		noTransfer: state => state.transitionName = '',
		notLogin: state => state.isNotLogin = true,
		loginSuccess: (state) => state.isNotLogin = false,
		saveLogSuccessCallback: (state,cb) => {
			state.logSuccessCallback = cb
		},
		saveUserInfo: (state, json) => {
			state.userInfo = json
		},
		saveCurrentOrder: (state, json) => {
			state.currentOrder = json
		},
		saveOrderList: (state, list) => {
			state.orderList = list
		},
		getUserInfo: (state) => {
			console.log(123)
			agent.get('/api/u/info', '')
			.then(res => {
				console.log(res)
				if (res == false) return
			})
		}
	},
	actions: {
		getData ({state}) {
			console.log('登录成功回调')
			state.logSuccessCallback()
		},
		openPopup ({state}) {
			state.open = true
		}
	}
})

export default store