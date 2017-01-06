import Vue from 'vue'
import Vuex from 'vuex'
import agent from '../util/agent'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
    hello: 0,
    delivers: []
	},
	mutations: {
    increment(state) {
      state.hello ++
    },
    updateDelivers(state, delivers) {
      state.delivers = delivers
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
		}
	}
})

export default store
