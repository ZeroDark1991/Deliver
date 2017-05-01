import Vue from 'vue'
import Vuex from 'vuex'
import agent from '../util/agent'
import Moment from 'moment'
import { Message } from 'element-ui';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
    hello: 0,
    delivers: [],
    aduitList: [],
    tankList: [],
    tankMap: [],
    tankDetail: {
			objectId: null,
			signId: null,
			latitude: null,
			longitude: null,
			manufactureDate: null,
			ownerObjectId: null
		},
		userList: [],
		userDetail: {
			createdAt:null,
			phoneNumberde:null,
			objectId:null,
			username:null,
			tank:{
				objectId: null,
			},
			addressList:[]
		},
		orderList: [],
		orderDetail:{
			address: null,
			areaCode: null,
			objectId: null,
			price: null,
			user: {
				objectId: null,
				phoneNumber: null
			},
			objectId:null,
			payment: null,
			status: null,
			timeSlot: null,
			userName: null,
			userPhone: null,
			createdAt: null,
			receivedAt: null,
			finishedAt: null,
		}
	},
	mutations: {
    increment(state) {
      state.hello ++
    },
    updateDelivers(state, delivers) {
      state.delivers = delivers
    },
    updateAduitList(state, aduitList) {
      state.aduitList = aduitList
    },
    updateTankList(state, tankList) {
      state.tankList = tankList
    },
    updateTankMap(state, tankMap) {
      state.tankMap = tankMap
    },
    updateTankDetail(state, tankDetail) {
      state.tankDetail = tankDetail
    },
    updateUserList(state, userList) {
      state.userList = userList
    },
    updateUserDetail(state, userDetail) {
    	state.userDetail = userDetail
    },
    updateOrderList(state, orderList) {
      state.orderList = orderList
    },
    updateOrderDetail(state, orderDetail) {
    	state.orderDetail = orderDetail
    }
	},
	actions: {
		increment(ctx) {
			ctx.commit('increment')
		},
		fetchDelivers(ctx) {
			agent
				.get('/api/d/list')
				.then(data => {
					console.log(data)
					let delivers = data.list.map(deliver => {
						return {
							id: deliver.objectId,
							name: deliver.name,
							phoneNumber: deliver.phoneNumber
						}
					})
					ctx.commit('updateDelivers', delivers)
				})
		},
		fetchAduitList(ctx) {
			agent
			.get('/api/order/auditList')
			.then(data => {
				console.log(data)
				let aduitList = data.list.map(item => {
					return {
						objectId: item.objectId,
						address: item.address,
						areaCode: item.areaCode,
						timeSlot: item.timeSlot,
						userName: item.userName,
						userPhone: item.userPhone,
						status: item.status,
						createdAt: Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
						deliver :{
							name: item.deliver.name,
							phoneNumber: item.deliver.phoneNumber
						}
						
					}
				})
				ctx.commit('updateAduitList', aduitList)
			})
		},
		fetchDeliverList(ctx) {
			agent
			.get('/api/order/deliverList')
			.then(data => {
				console.log(data)

			})
		},
		fetchTankList(ctx, signId) {
			console.log(signId)
			agent
			.get('/api/t/list',{signId:signId||''})
			.then(data => {
				console.log(data)
				if (data.list.length==0) {
					Message({
						message: '无相关数据',
						type: 'warning'
					});
					return
				}
				let tankList = data.list.map(item => {
					return {
						objectId: item.objectId,
						signId: item.signId,
						latitude: item.latitude,
						longitude: item.longitude,
						standard: item.standard,
						manufactureDate: Moment(item.manufactureDate).format("YYYY-MM-DD HH:mm:ss"),
					}
				})
				ctx.commit('updateTankList', tankList)
			})
			.catch(e => {
				console.log(e.message)
			})
		},
		// 气瓶地图
		fetchTankMap(ctx, signId) {
			agent
			.get('/api/t/list', { map: true })
			.then(data => {
				console.log(data)
				if (data.list.length==0) {
					Message({
						message: '无相关数据',
						type: 'warning'
					});
					return
				}
				let tankMap = data.list.map(item => {
					return {
						objectId: item.objectId,
						signId: item.signId,
						latitude: item.latitude,
						longitude: item.longitude,
						standard: item.standard,
						manufactureDate: Moment(item.manufactureDate).format("YYYY-MM-DD HH:mm:ss"),
					}
				})
				ctx.commit('updateTankMap', tankMap)
			})
			.catch(e => {
				console.log(e.message)
			})
		},
		fetchTankDetail(ctx,objectId) {
			console.log(objectId)
			agent
			.get('/api/t/info',{id:objectId || ''})
			.then(data => {
				console.log(data)
				let tankDetail = {
					objectId: data.info.objectId || '暂无',
					signId: data.info.signId || '暂无',
					latitude: data.info.latitude || '暂无',
					longitude: data.info.longitude || '暂无',
					manufactureDate: data.info.manufactureDate || '暂无',
					ownerObjectId: data.owner ? data.owner.objectId : ''
				}
				ctx.commit('updateTankDetail', tankDetail)
			})
			.catch(e => {
				console.log(e.message)
			})
		},
		fetchUserList(ctx, phoneNumber) {
			agent
			.get('/api/u/list',{phoneNumber: phoneNumber||''})
			.then(data => {
				console.log(data)
				if (data.list.length==0) {
					Message({
						message: '无相关数据',
						type: 'warning'
					});
					return
				}
				let userList = data.list.map(item => {
					return {
						tank: item.tank || '暂无',
						mobilePhoneNumber: item.mobilePhoneNumber || '暂无',
						objectId: item.objectId || '暂无',
						username: item.username || '暂无',
						createdAt: Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss") || '暂无',
					}
				})
				ctx.commit('updateUserList', userList)

			})
		},
		fetchUserDetail(ctx, objectId) {
			agent
			.get('/api/u/adminInfo', {id: objectId || ''})
			.then(data => {
				console.log(data)
				let userDetail = {
						tank: data.user.tank || '暂无',
						mobilePhoneNumber: data.user.mobilePhoneNumber || '暂无',
						objectId: data.user.objectId || '暂无',
						username: data.user.username || '暂无',
						addressList: data.user.addressList || [],
						createdAt: Moment(data.user.createdAt).format("YYYY-MM-DD HH:mm:ss") || '暂无',
					}
				ctx.commit('updateUserDetail', userDetail)
			})
		},
		fetchOrderList(ctx, userId) {
			agent
			.get('/api/order/list', {userId: userId || ''})
			.then(data => {
				console.log(data)
					let orderList = data.list.map(item => {
					return {
						address: item.address || '暂无',
						areaCode: item.areaCode || '暂无',
						objectId: item.objectId || '暂无',
						price: item.price || '暂无',
						user: item.user || '暂无',
						payment: item.payment || '暂无',
						status: item.status+'' || '暂无',
						timeSlot: item.timeSlot || '暂无',
						userName: item.userName || '暂无',
						userPhone: item.userPhone || '暂无',
						createdAt: Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss") || '暂无',
						receivedAt: Moment(item.receivedAt).format("YYYY-MM-DD HH:mm:ss") || '暂无',
						finishedAt: Moment(item.finishedAt).format("YYYY-MM-DD HH:mm:ss") || '暂无'
					}
				})
				ctx.commit('updateOrderList', orderList)

			})
		},
		fetchOrderDetail(ctx, objectId) {
			agent
			.get('/api/order/Info', {id: objectId || ''})
			.then(data => {
				console.log(data)
				let orderState = ''
				switch (data.info.status) {
				case -1:
					orderState = '待送气工接单'
					break;
				case 0:
					orderState = '待送气工接单'
					break;
				case 1:
					orderState = '送气工赶往你家路上'
					break;
				case 2:
					orderState = '新气罐装配中'
					break;
				case 10:
					orderState = '气罐已送达 订单完成'
					break;
				default:
					// orderStatements_def
					break;
				}
				let orderDetail = {
						address: data.info.address || '暂无',
						areaCode: data.info.areaCode || '暂无',
						objectId: data.info.objectId || '暂无',
						price: data.info.price || '暂无',
						user: data.info.user || '暂无',
						payment: data.info.payment || '暂无',
						status: orderState || '暂无',
						timeSlot: data.info.timeSlot || '暂无',
						userName: data.info.userName || '暂无',
						userPhone: data.info.userPhone || '暂无',
						createdAt: data.info.createdAt 
												? Moment(data.info.createdAt).format("YYYY-MM-DD HH:mm:ss")
												: '暂无',
						receivedAt: data.info.receivedAt 
												? Moment(data.info.receivedAt).format("YYYY-MM-DD HH:mm:ss")
												: '',
						finishedAt: data.info.finishedAt 
												? Moment(data.info.finishedAt).format("YYYY-MM-DD HH:mm:ss")
												: ''
					}
				ctx.commit('updateOrderDetail', orderDetail)

			})
		}


	}
})

export default store
