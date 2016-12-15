<template>
	<div class="page">
		<mt-header fixed title="个人中心"></mt-header>
		<div class="container-top">
			<mt-cell is-link title="我的订单" class="text-large" @click.native="go('/order_list','1')"></mt-cell>
			<mt-cell is-link title="收货地址" class="text-large" @click.native="go('/myAddress')"></mt-cell>
			<mt-cell is-link title="我的气罐" class="text-large" @click.native="go('/myTank')"></mt-cell>
		</div>
		<mt-tabbar v-model="selected">
			<mt-tab-item id="home" @click.native="back('/home')">
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
import agent from '../util/agent'
export default {
	data () {
		return {
			selected: 'center',
		}
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		}
	}
}
</script>

<style scoped>
</style>