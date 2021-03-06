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
			mobilePhoneNumber:null,
			username:null,
			objectId:null
		},
		// telPlaceholder:null,
		addressList:null,
		currentOrderList:null,
		currentOrder:null,
		orderList:null,
		logSuccessCallback:null,
		timeSlots:null,
		district:null,
		areaNameList:null,
		areaCodeList:null,
		tank:null,
		orderAddress:null
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
		openPopup (state) {
			state.open = true
		},
		closePopup (state) {
			state.open = false
		},
		//发现未登录，更改状态
		notLogin (state) {
			state.isNotLogin = true
		},
		//登录成功，更改状态
		loginSuccess (state) {
			state.isNotLogin = false
		},
		//保存登录成功回调
		saveLogSuccessCallback (state, cb) {
			state.logSuccessCallback = cb
		},
		//保存用户信息
		saveUserInfo (state, json) {
			state.userInfo = json
		},
		//保存当前订单列表
		saveCurrentOrderList (state, array) {
			state.currentOrderList = array
		},
		//保存上次进入的当前订单详情
		saveCurrentOrder (state, json) {
			state.currentOrder = json
		},
		//保存历史订单列表
		saveOrderList(state, list) {
			state.orderList = list
		},
		// //保存下单时默认手机placeholder
		// SAVETELPLACEHOLDER(state, string) {
		// 	state.telPlaceholder = string
		// },
		//保存地址列表
		saveAddressList(state, array) {
			state.addressList = array 
		},
		//保存预约时间列表
		saveTimeSlot(state, array) {
			state.timeSlots = array 
		},
		//保存地区列表
		saveDistrict(state, array) {
			state.district = array 
		},
			// SAVEAREANAMELIST(state, array) {
			// 	state.areaNameList = array 
			// },
			// SAVEAREACODELIST(state, array) {
			// 	state.areaCodeList = array 
			// },
		//保存煤气瓶信息
		saveTank(state, json) {
			state.tank = json 
		},
		saveOrderAddress(state, json) {
			state.orderAddress = json 
		},

	},
	actions: {
		getData ({dispatch, state}, pointer) {
			console.log('登录成功回调')
			if (state.logSuccessCallback) {
				state.logSuccessCallback()
			}else{
				console.log(pointer)
				dispatch('getUserInfo', pointer)
			}
		},
		getUserInfo ({ state, dispatch, commit }, pointer) {
			if (!state.userInfo.objectId) {
				agent.get('/api/u/info', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					if (res.user) {
						let userInfo = {
							mobilePhoneNumber: res.user.mobilePhoneNumber,
							username: res.user.username,
							objectId: res.user.objectId
						}
						commit('loginSuccess')
						console.log('getUserInfo-store')
						commit('saveUserInfo', userInfo)
						commit('saveAddressList', res.user.addressList)
						commit('closePopup')
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