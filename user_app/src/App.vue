<template>
	<div class="page">
		<keep-alive>
			<transition :name="transitionName" mode="out-in">
				<router-view></router-view>
			</transition>
			<div class="home-mask" v-show="mask"></div>
		</keep-alive>
		<mt-popup v-model="isNotLogin" popup-transition="popup-fade">
			<div class="page">
				<mt-field label="Phone" placeholder="Input PhoneNumber" v-model='PhoneNumber'></mt-field>
				<mt-field label="VerifyCode" placeholder="Input VerifyCode" v-model='VerifyCode'></mt-field>
				<mt-button size='large' plain type='danger' @click="fetchVerifyCode()">Fetch VerifyCode</mt-button> 
				<mt-button size='large' plain @click="login()">Log In</mt-button> 
			</div>
			
		</mt-popup>
	</div>
</template>

<script>
import agent from './util/agent'
import store from '../vuex/store'
export default {
  name: 'app',
  data () {
	return {
		mask:false,
		show:false,
		PhoneNumber: '13588277370',
		VerifyCode: '438811'
	}
  },
  store,
  computed: {
    transitionName () {
	    return store.state.transitionName
    },
    isNotLogin (){
		return store.state.isNotLogin
    }
  },
  created() {
	let self = this
	// self.login () 

	this.$on('transfer', function (type) {
		this.transitionName = type
	})
  },
  methods:{
	login () {
		let self = this
		agent.post('/api/u/logIn', {
			phoneNumber: this.PhoneNumber,
			verifyCode: this.VerifyCode
		})
		.then(res => {
			console.log(res)
			if (res.success==true) {
				store.commit('checkLogin')
				$router.replace('/home')
			}
		})
	},
	fetchVerifyCode () {
		agent.post('/api/u/verifyCode', {
			phoneNumber: this.PhoneNumber
		})
		.then(res => {
			console.log(res)
		})
	},

  }

}
</script>

<style scoped>
.mint-popup{
	width: 100%;
	height: 100%;
	background-color: #f7f7f7;
}
</style>
