<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed title="首页"></mt-header>
		<div class="container-top">
			<mt-swipe :auto="4000" style="height: 200px;">
				<mt-swipe-item style="background-color: red;">1</mt-swipe-item>
				<mt-swipe-item style="background-color: yellow;">2</mt-swipe-item>
				<mt-swipe-item style="background-color: blue;">3</mt-swipe-item>
			</mt-swipe>
			<mt-cell @click.native="go('/commit_order')">
			<div slot="title">
					<div class="flex-middle">
						<div class="media">
							<img :src="logo">
						</div>
						<div>预约上门充煤气</div>
					</div>
				</div>
			</mt-cell>
			<mt-cell @click.native="go('/order_list', '0')">
				<div slot="title">
					<div class="flex-middle">
						<div class="media">
							<img :src="logo">
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
export default {
	data () {
		return {
			logo:logo,
			selected: 'home'
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
		
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			console.log('我进来了')
		})
	}
	
}
</script>

<style scoped lang="less">
.media{
	width: 2.5rem;
	margin: .5rem 1rem .5rem 0;
	img{
		width: 100%;
	}
}
</style>