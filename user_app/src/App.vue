<template>
	<div class="page">
		<keep-alive>
			<transition :name="transitionName" mode="out-in">
				<router-view></router-view>
			</transition>
			<div class="home-mask" v-show="mask"></div>
		</keep-alive>
		<mt-popup v-model="open" popup-transition="popup-fade">
			<div class="page">
				<div class="container">
					<div class="flex-center">
						<img class="logo-img" :src="logo">
					</div>
					<div class="login-form">
						<div class="input-wrap">
							<input type="tel" name="" placeholder="输入手机号" v-model='PhoneNumber'>
						</div>
						<div class="input-wrap flex-center">
							<input type="tel" name="" placeholder="输入验证码" v-model='VerifyCode'>
							<div class="login-messageBtn">
								<button @click="fetchVerifyCode()" class="get-code text-theme-blue bk-white no-radius no-border" :disabled="isGetCheck">{{ hint }}</button>
							</div>
						</div>
						<mt-button size='large' class="login-btn bk-theme-blue no-border text-white" @click="login()">登录</mt-button>
					</div>
				</div>
			</div>
		</mt-popup>
	</div>
</template>

<script>
import agent from './util/agent'
import store from './vuex/store'
import logo from './assets/logo.png'
export default {
  name: 'app',
  data () {
	return {
		mask:false,
		show:false,
		PhoneNumber: '',//13588277370
		VerifyCode: '',//438811
		isGetCheck:false,
		hint: '获取短信验证码',
		timer: null,
		canGet: false,
		userInfo: {
			address:'',
			areaCode:'',
			mobilePhoneNumber:'',
			username:''
		},
		logo,
	}
  },
  store,
  computed: {
	transitionName () {
		return store.state.transitionName
	},
	isNotLogin () {
		return store.state.isNotLogin
	},
	open () {
		return store.state.open
	}
  },
  created() {
	let self = this
	store.commit('saveLogSuccessCallback',this.getUserInfo)
	if(!self.isNotLogin){
		console.log(111)
		store.commit('loginSuccess')
		// store.commit('getUserInfo')
		if (self.$route.path == '/') {
			self.$router.replace('/home')
		}
	}else{
		console.log(222)
    	self.getUserInfo()
	}
  },
  methods:{
  	getUserInfo() {
  		let self = this
  		agent.get('/api/u/info', '')
		.then(res => {
			console.log(res)
			if (res == false) return
			if (res.user) {
				self.userInfo.address = res.user.address
				self.userInfo.areaCode = res.user.areaCode
				self.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
				self.userInfo.username = res.user.username
				store.commit('saveUserInfo',self.userInfo)
				store.commit('loginSuccess')
				$router.replace('/home')

			}
		})
  	},
	login () {
		let self = this
		let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
		if(!self.PhoneNumber){
			self.$Toast("请输入手机号码");
			return
		}else if(!reg.test(self.PhoneNumber)){
			self.$Toast("手机号码不正确");
			return
		}else if(!self.VerifyCode){
			self.$Toast("请输入验证码");
			return
		}
		console.log(this.VerifyCode+'')
		self.$Indicator.open();
		agent.post('/api/u/logIn', {
			phoneNumber: this.PhoneNumber,
			verifyCode: this.VerifyCode+''
		})
		.then(res => {
			self.$Indicator.close();
			console.log(res)
			if (res == false) return
			store.commit('loginSuccess')
			if (self.$route.path == '/') {
				$router.replace('/home')
			}
		}).then(store.dispatch('getData'))
	},
	fetchVerifyCode () {
		let self = this
		self.isGetCheck = true
		let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
		if (self.timer == null) {
			if (!self.PhoneNumber) {
				self.$Toast("请输入手机号码");
				self.isGetCheck = false
				return
			} else if (!reg.test(self.PhoneNumber)) {
				self.isGetCheck = false
				self.$Toast("手机号码不正确");
				return
			}else {
				// self.canGet = true
				agent.post('/api/u/verifyCode', {
					phoneNumber: this.PhoneNumber
				})
				.then(res => {
					console.log(res)
					if (res == false) return
					self.$Toast("发送成功");
					var time=60;
					var t=setInterval(function() {
						time--;
						self.hint = time+"秒后重新发送";
						if (time<=0) {
							clearInterval(t)
							self.hint = "重新获取?";
							self.isGetCheck = false
					  	// self.canGet = false;
						}
					},1000);
				})

			}
		}
	},

  }

}
</script>

<style scoped lang='less'>
.mint-popup{
	width: 100%;
	height: 100%;
	background-color: #f7f7f7;
}
.container{
	padding: 2rem 1rem 0 1rem;
}
.login-form{
	margin-top: 2rem;
}
.logo-img{
	height: 6rem;
	width: 7rem;
	/*background-color: #009BF7;*/
}
.get-code{
	width: 130px;
	height: 2.4rem;
}
.login-messageBtn{
	line-height: 2.4rem;
}
.input-wrap{
	font-size: .8rem;
	margin-bottom: 1rem;
	input{
		height: 2.4rem;
		width: 100%;
		padding: .25rem .5rem;
		border-radius: 3px;
	}
}
.login-btn{
	border-radius: 3px;
	margin-top: 3rem;
}
</style>
