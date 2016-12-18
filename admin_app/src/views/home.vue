<template>
	<div>
		hello i am home {{hello}}
		<button @click='increment()'>++</button>
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
    ...mapState(['hello'])
	},
	created(){
		console.log(this.$store.state)
	},
	methods: {
    ...mapActions(['increment'])
	}
}
</script>