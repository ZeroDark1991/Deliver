<template>
	<div class="page">
		<div class="container">
			<div class="user-info">
				<div class="top-wrap">
					<div class="head-img flex-center">
						<img :src="head">
					</div>
					<div class="flex-center tel">{{userInfo.username || userInfo.tel}}</div>
				</div>
			</div>
			<mt-cell is-link title="我的订单" class="text-large" @click.native="go('/order_history')"></mt-cell>
			<mt-cell is-link title="收货地址" class="text-large" @click.native="go('/myAddress')"></mt-cell>
			<mt-cell is-link title="我的气罐" class="text-large" @click.native="go('/myTank')"></mt-cell>
		</div>
		<mt-tabbar v-model="selected">
			<mt-tab-item id="home" @click.native="tabChange('/home')">
				<span class="iconfont">&#xe691;</span>
				<span class="mt-tab-item-title">首页</span>
			</mt-tab-item>
			<mt-tab-item id="center">
				<span class="iconfont">&#xe606;</span>
				<span class="mt-tab-item-title">个人中心</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script type="text/javascript">
import store from '../vuex/store'
import agent from '../util/agent'
import head from '../assets/head.jpg'
export default {
	data () {
		return {
			selected: 'center',
			head,
			store,
			userInfo:{
				username: null,
				tel: null,
				address: null,
				areaCode: null
			}
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getUserInfo)
	},
  	methods:{
  		tabChange(link){
  			this.$transfer.noTransfer(self, link)
  		},
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		},
		getUserInfo() {
			let self = this
			if (store.state.userInfo == null) {
				agent.get('/api/u/info', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					self.userInfo.address = res.user.address
					self.userInfo.areaCode = res.user.areaCode
					self.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
					self.userInfo.username = res.user.username
					store.commit('saveUserInfo',self.userInfo)
				})
			}else {
				self.userInfo.username = store.state.userInfo.username || ''
				self.userInfo.tel = store.state.userInfo.mobilePhoneNumber || ''
			}
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.getUserInfo()
		})
	}
}
</script>

<style scoped lang="less">
.user-info{
	height: 8rem;
	background-color: #e7e7e7;
	position: relative;
	.head-img{
		position: absolute;
		bottom: 2.75rem;
		width: 100%;
		img{
			width: 3.5rem;
			height: 3.5rem;
			border-radius: 50%;
		}
	}
	.tel{
		width: 100%;
		position: absolute;
		bottom: 1.1rem;
	}
	.top-wrap{
		width: 100%;
		height: 100%;
		position: relative;
	}
}
</style>