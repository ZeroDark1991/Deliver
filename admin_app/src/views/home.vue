<template>
	<div>
		hello i am home
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {

		}
	},
	computed: {
    hello() {
    	return this.$store.state.hello
    }
	},
	created(){
		console.log(this.$store.state)
	},
	methods: {
    ...mapActions(['increment'])
	}
}
</script>