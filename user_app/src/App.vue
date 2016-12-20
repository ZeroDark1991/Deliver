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
				<div class="container" style="padding-top: 1rem;">
					<mt-field label="手机号码" placeholder="输入验证码" type="tel" v-model='PhoneNumber'></mt-field>
					<mt-field label="验证码" placeholder="输入验证码" type="number" v-model='VerifyCode'>
						<div class="login-messageBtn">
							<button @click="fetchVerifyCode()" class="get-code text-cyan bk-white no-radius no-border" :disabled="isGetCheck">{{ hint }}</button>
						</div>
					</mt-field>
					<mt-button size='large' class="bk-cyan no-radius no-border text-white" @click="login()">登录</mt-button>
				</div>
			</div>
		</mt-popup>
	</div>
</template>

<script>
import agent from './util/agent'
import store from '../vuex/store'
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
		hint: '获取验证码',
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
	}
  },
  created() {
	let self = this
	store.commit('saveLogSuccessCallback',this.getUserInfo)
	if(!self.isNotLogin){
		store.commit('loginSuccess')
		if (self.$route.path == '/') {
			self.$router.replace('/home')
		}
	}else{
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
		let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
		if (self.timer == null) {
			if (!self.PhoneNumber) {
				self.$Toast("请输入手机号码");
				return
			} else if (!reg.test(self.PhoneNumber)) {
				self.$Toast("手机号码不正确");
				return
			}else {
				self.canGet = true
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
						self.hint = time+" s";
						if (time<=0) {
							clearInterval(t);
							self.hint = "重新获取";
					  	self.canGet = false;
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
.login-form{
	padding: .5rem;
	width: 100%;
	height: 2.5rem;
	line-height: 2.5rem;
	label{
		width: 70px;
	}
	input{
		height: 1.5rem;
		line-height: 1.5rem;
		font-size: .8rem;
		&::-webkit-input-placeholder{
			font-size: .7rem;
		}
	}
	.code-input{
		width: 130px;
	}

}
.get-code{
	width: 120px;
	height: 46px;
}
.login-messageBtn{
	margin-top: 1px;
	height: 46px;
	width: 100px;
	line-height: 46px;
}
</style>
