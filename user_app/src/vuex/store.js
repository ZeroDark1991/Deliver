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
		userInfo: {
			address:null,
			areaCode:null,
			mobilePhoneNumber:null,
			username:null
		},
		currentOrder:null,
		orderList:null,
		logSuccessCallback:null,
		timeSlots:null,
		tank:null
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
			state.timeSlots = array 
		},
	},
	actions: {
		saveTimeSlot({commit}, array) {
			commit('SAVETIMESLOT',array)
		},
		getData ({dispatch, state}, pointer) {
			console.log('登录成功回调')
			if (state.logSuccessCallback) {
				state.logSuccessCallback()
			}else{
				console.log(pointer)
				dispatch('getUserInfo',pointer)
			}
		},
		openPopup ({state}) {
			state.open = true
		},
		closePopup ({state}) {
			state.open = false
		},
		getUserInfo ({ state, dispatch, commit }, pointer) {
			if (!state.userInfo.address || 
				!state.userInfo.areaCode || 
				!state.userInfo.mobilePhoneNumber || 
				!state.userInfo.username ) {
				agent.get('/api/u/info', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					if (res.user) {
						let userInfo = {
							address: res.user.address,
							areaCode: res.user.areaCode,
							mobilePhoneNumber: res.user.mobilePhoneNumber,
							username: res.user.username
						}
						commit('loginSuccess')
						commit('saveUserInfo', userInfo)
						dispatch('closePopup')
						if (pointer) {
							if (pointer.$route.path == '/') {
								$router.replace('/home')
							}
						}
					}
				})
			}
		}
	}
})

export default store