<template>
	<div class="page">
		<mt-header fixed title="个人中心">
			<mt-button icon="back" slot="left" @click="back('/center')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="!tank" class="tip">暂无信息</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
export default {
	data () {
		return {
			tank:null
		}
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
			agent.get('/api/u/currentTank', '')
			.then(res => {
				console.log(res)
				if (!res.success) {self.$Toast(res.message);return}
				self.tank = res.tank

			})
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.getData()
		})
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