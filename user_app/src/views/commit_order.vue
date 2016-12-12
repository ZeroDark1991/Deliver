<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed title="预约上门"></mt-header>
		<div class="container-top">
			

		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
export default {
	data () {
		return {
			selected: 'home'
		}
	},
	created() {
		// console.log(112)
	},
  	methods:{
		go (link, param) {
			this.$transfer.go(self, link, param)
			// this.$router.replace(link)
		},
		back (link, param) {
			this.$transfer.back(self, link)
		},
		submitOrder() {
			
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			console.log('我进来了111')
		})
	}
	
}
</script>

<style scoped lang="less">

</style>