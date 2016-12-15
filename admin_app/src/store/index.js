import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
    xxxx: 0
	},
	mutations: {
    increment(state){
      state.hello++
    }
	},
	actions: {
		increment(ctx) {
			ctx.commit('increment')
		}
	}
})

export default store