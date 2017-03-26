<template>
	<div class="page">
		<div class="container">
			<div class="user-info">
				<div class="top-wrap">
					<div class="head-img text-center">
						<img :src="headSrc">
					</div>
					<div class="flex-center tel">{{userInfo.username || userInfo.mobilePhoneNumber}}</div>
				</div>
			</div>
			<mt-cell is-link title="我的订单" class="text-large" @click.native="go('/order_history')"></mt-cell>
			<mt-cell is-link title="收货地址" class="text-large" @click.native="go('/myAddress')"></mt-cell>
			<mt-cell is-link title="我的气瓶" class="text-large" @click.native="go('/myTank')"></mt-cell>
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

import agent from '../util/agent'
import { mapState, mapActions, mapMutations} from 'vuex'
import headSrc from '../assets/head.jpg'
export default {
	data () {
		return {
			selected: 'center',
			headSrc
		}
	},
	created() {
		this.saveLogSuccessCallback(null)
		this.getUserInfo()
	},
	computed: {
		...mapState(['userInfo']),
	},
  	methods:{
  		...mapMutations(['saveLogSuccessCallback']),
  		...mapActions(['getUserInfo']),
  		tabChange(link){
  			this.$transfer.noTransfer(self, link)
  		},
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			
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
			background-color: #eee;
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