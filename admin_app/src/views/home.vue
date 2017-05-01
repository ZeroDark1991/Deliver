<template>
	<div>
	</div>
</template>
<style lang="stylus">
html
	font-size 14px	
</style>	
<script>
import { mapState, mapActions } from 'vuex'
export default {
	data() {
		return {

		}
	},
	computed: {
	},
	created(){
		// console.log(this.$store.state)
	},
	methods: {
    ...mapActions(['increment'])
	}
}
</script>