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
		logSuccessCallback:null,
		timeSlot:null
	},
	mutations: {
		nextPage (state) {
			state.transitionName = 'slide-left'
		},
		backPage (state) {
			state.transitionName = 'slide-right'
		},
		noTransfer (state) {
			state.transitionName = ''
		},
		notLogin (state) {
			state.isNotLogin = true
		},
		loginSuccess (state) {
			state.isNotLogin = false
		},
		saveLogSuccessCallback (state, cb) {
			state.logSuccessCallback = cb
		},
		saveUserInfo (state, json) {
			state.userInfo = json
		},
		saveCurrentOrder (state, json) {
			state.currentOrder = json
		},
		saveOrderList(state, list) {
			state.orderList = list
		},
		SAVETIMESLOT(state, array) {
			state.timeSlot = array 
		},
	},
	actions: {
		saveTimeSlot({commit}, array) {
			commit('SAVETIMESLOT',array)
		},
		getData ({state}) {
			console.log('登录成功回调')
			state.logSuccessCallback()
		},
		openPopup ({state}) {
			state.open = true
		},
		closePopup ({state}) {
			state.open = false
		},
		getUserInfo ({ dispatch, commit }, pointer) {
			agent.get('/api/u/info', '')
			.then(res => {
				console.log(res)
				if (res == false) return
				if (res.user) {
					pointer.userInfo.address = res.user.address
					pointer.userInfo.areaCode = res.user.areaCode
					pointer.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
					pointer.userInfo.username = res.user.username
					commit('loginSuccess')
					commit('saveUserInfo', pointer.userInfo)
					dispatch('closePopup')
					if (pointer.$route.path == '/') {
						pointer.$router.replace('/home')
					}
				}
			})
		}
	}
})

export default store