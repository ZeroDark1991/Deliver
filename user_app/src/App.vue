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
				<div class="login-wrap bk-white">
					<div class="flex-middle login-form">
						<label class="text-large">手机号码</label>
						<input type="" name="" v-model='PhoneNumber' placeholder="请输入短信验证码">
					</div>
					<div class="flex-middle login-form">
						<div class="unit flex-middle">
							<label class="text-large">验证码</label>
							<input type="number" class="code-input" v-model='VerifyCode' placeholder="请输入短信验证码">
						</div>
						<div class="login-messageBtn flex-center unit-0">
							<button @click="fetchVerifyCode()" class="text-cyan" :disabled="isGetCheck">{{ hint }}</button>
						</div>
					</div>
				</div>
				<mt-button size='large' class="bk-cyan no-radius no-border text-white" @click="login()">登录</mt-button>
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
		isNotLogin: false
	}
  },
  store,
  computed: {
	transitionName () {
		return store.state.transitionName
	},
  },
  created() {
	let self = this
	if(!store.state.isNotLogin){
		agent.get('/api/u/info', '')
		.then(res => {
			console.log(res)
			if (res == false) return
			self.userInfo.address = res.user.address
			self.userInfo.areaCode = res.user.areaCode
			self.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
			self.userInfo.username = res.user.username
			store.commit('saveUserInfo',self.userInfo)
			store.commit('loginSuccess')
			self.isNotLogin = false
			$router.replace('/home')
		})
	}else{
		self.isNotLogin = true
	}

	this.$on('transfer', function (type) {
		this.transitionName = type
	})
  },
  methods:{
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
		agent.post('/api/u/logIn', {
			phoneNumber: this.PhoneNumber,
			verifyCode: this.VerifyCode
		})
		.then(res => {
			console.log(res)
			if (res == false) return
			store.commit('loginSuccess')
			$router.replace('/home')
		})
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
	.login-messageBtn{
		width: 100px;
	}
}
</style>
