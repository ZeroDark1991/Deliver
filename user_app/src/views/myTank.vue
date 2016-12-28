<template>
	<div class="page">
		<mt-header fixed title="当前煤气罐">
			<mt-button icon="back" slot="left" @click="back('/center')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="!tank" class="tip">暂无信息</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import store from '../vuex/store'
export default {
	store,
	data () {
		return {
			tank:null,
		}
	},
	computed: {
		userInfo () {
			console.log('tank')
			return store.state.tank
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getData)
		this.getData()
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		},
		getData() {
			let self = this
			if (!store.state.tank) {
				agent.get('/api/u/currentTank', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					self.tank = res.tank
				})
			}
			
		}
	},
	beforeRouteEnter (to, from, next) {
		next()
	},
}
</script>

<style scoped>
.tip{
	height: 2em;
	line-height: 2rem;
	text-align: center;
}
</style>