<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed title="首页"></mt-header>
		<div class="container-top">
			<div  style="margin-top: .5rem;">
				<mt-cell @click.native="go('/commit_order')">
					<div slot="title">
						<div class="flex-middle">
							<div class="media flex-center">
								<!-- <img :src="logo"> -->
								<div class="circle flex-middle flex-center">
									<i class="iconfont">&#xe602;</i>
								</div>
							</div>
							<div class="text-extra">预约换气</div>
						</div>
					</div>
				</mt-cell>
			</div>
			<div  style="margin-top: .5rem;">
				<mt-cell @click.native="go('/order_current')">
					<div slot="title">
						<div class="flex-middle">
							<div class="media flex-center">
								<!-- <img :src="logo"> -->
								<div class="circle flex-middle flex-center">
									<i class="iconfont">&#xe603;</i>
								</div>
							</div>
							<div class="text-extra">当前订单</div>
						</div>
					</div>
				</mt-cell>
			</div>
			
		</div>
		<mt-tabbar v-model="selected">
			<mt-tab-item id="home">
				<span class="iconfont">&#xe600;</span>
				<span>首页</span>
			</mt-tab-item>
			<mt-tab-item id="center" @click.native="tabChange('/center')">
				<span class="iconfont">&#xe606;</span>
				<span>个人中心</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>
<script type="text/javascript">
import agent from '../util/agent'
import store from '../../vuex/store'
export default {
	data () {
		return {
			store,
			selected: 'home',
			userInfo: {
				address:'',
				areaCode:'',
				mobilePhoneNumber:'',
				username:''
			},
		}
	},
  	methods:{
  		tabChange(link){
  			this.$transfer.noTransfer(self, link)
  		},
		go (link, param) {
			this.$transfer.go(self, link, param)
			// this.$router.replace(link)
		},
		back (link, param) {
			this.$transfer.back(self, link)
		},
		getData() {
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
					console.log(12121212121212)
					store.commit('saveUserInfo',self.userInfo)
				})
			}
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.getData()
		})
	}
	
}
</script>

<style scoped lang="less">
.media{
	width: 3.5rem;
	margin-right: .5rem;
	// margin-right: 1rem;
	img{
		width: 100%;
	}
}
.circle{
	width: 3.5rem;
	height: 3.5rem;
	background-color: #009BF7;
	border-radius: 50%;
	i{
		font-size: 1.2rem;
		color: #fff;
		font-weight: 800;
	}
}
</style>