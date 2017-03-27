<template>
	<div class="page">
		<mt-header fixed title="当前煤气瓶">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="!tank" class="tip">暂无信息</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import { mapState, mapMutations} from 'vuex'
export default {
	data () {
		return {
			tank:null,
		}
	},
	computed: {
		...mapState(['tank'])
	},
	created() {
		this.saveLogSuccessCallback(this.getData)
		this.getData()
	},
  methods:{
  	...mapMutations(['saveLogSuccessCallback', 'saveTank']),
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		},
		getData() {
			let self = this
			if (!self.tank) {
				agent.get('/api/u/currentTank', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					if (res.tank) {
						self.tank = res.tank
						this.saveTank(res.tank)
					}
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