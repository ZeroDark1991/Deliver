<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed title="首页"></mt-header>
		<div class="container-top">
<!-- 			<mt-swipe :auto="4000" style="height: 200px;">
				<mt-swipe-item style="background-color: red;">1</mt-swipe-item>
				<mt-swipe-item style="background-color: yellow;">2</mt-swipe-item>
				<mt-swipe-item style="background-color: blue;">3</mt-swipe-item>
			</mt-swipe> -->
			<mt-cell @click.native="go('/commit_order')">
			<div slot="title">
					<div class="flex-middle">
						<div class="media flex-center">
							<!-- <img :src="logo"> -->
							<i class="iconfont">&#xe732;</i>
						</div>
						<div>预约上门充煤气</div>
					</div>
				</div>
			</mt-cell>
			<mt-cell @click.native="go('/order_list', '0')">
				<div slot="title">
					<div class="flex-middle">
						<div class="media flex-center">
							<!-- <img :src="logo"> -->
							<i class="iconfont">&#xe603;</i>
						</div>
						<div>当前订单状态</div>
					</div>
				</div>
			</mt-cell>
		</div>
		
		<mt-tabbar v-model="selected">
			<mt-tab-item id="home">
				<span class="iconfont">&#xe600;</span>
				<span>首页</span>
			</mt-tab-item>
			<mt-tab-item id="center" @click.native="go('/center')">
				<span class="iconfont">&#xe606;</span>
				<span>个人中心</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import logo from '../assets/logo.png'
import store from '../../vuex/store'
export default {
	data () {
		return {
			logo:logo,
			selected: 'home',
			userInfo: {
				address:'',
				areaCode:'',
			}
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
		getData() {
			let self = this
			agent.get('/api/u/info', '')
			.then(res => {
				console.log(res)
				if (res.success==true) {
					self.userInfo.address = res.user.address
					self.userInfo.areaCode = res.user.areaCode
					self.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
					self.userInfo.username = res.user.username
					store.commit('saveUserInfo',self.userInfo)
				}
			})
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
	width: 2.5rem;
	// margin-right: 1rem;
	img{
		width: 100%;
	}
}
</style>