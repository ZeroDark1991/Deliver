<template>
	<div class="page">
		<mt-header fixed title="个人中心"></mt-header>
		<div class="container-top">
			<div class="user-info">
				<div class="top-wrap">
					<div class="head-img flex-center">
						<img :src="head">
					</div>
					<div class="flex-center tel">{{addressInfo.username || addressInfo.tel}}</div>
				</div>
			</div>
			<mt-cell is-link title="我的订单" class="text-large" @click.native="go('/order_history')"></mt-cell>
			<mt-cell is-link title="收货地址" class="text-large" @click.native="go('/myAddress')"></mt-cell>
			<mt-cell is-link title="我的气罐" class="text-large" @click.native="go('/myTank')"></mt-cell>
		</div>
		<mt-tabbar v-model="selected">
			<mt-tab-item id="home" @click.native="tabChange('/home')">
				<span class="iconfont">&#xe600;</span>
				<span>首页</span>
			</mt-tab-item>
			<mt-tab-item id="center">
				<span class="iconfont">&#xe606;</span>
				<span>个人中心</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script type="text/javascript">
import store from '../../vuex/store'
import agent from '../util/agent'
import head from '../assets/head.jpg'
export default {
	data () {
		return {
			selected: 'center',
			head,
			store,
		}
	},
	computed: {
		addressInfo () {
			return {
				username:store.state.userInfo.username || '',
				tel:store.state.userInfo.mobilePhoneNumber || ''
			}
		}
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
		}
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