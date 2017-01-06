<template>
	<div class="page">
		<div class="container">
		<div class="flex-center" style="margin-top: 1rem;">
			<div class="unit-1-2 text-center text-white item-block"
				@click="go('/commit_order','ol')" style="background-color: #8E97C5;">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe605;</i>
				<div class="text-extra">在线预约</div>
			</div>
			<!-- !!! -->
			<div class="unit-1-2 text-center text-white item-block"
				@click="go('/commit_order','tel')"
				style="background-color: #C970CA;">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe608;</i>
				<div class="text-large">电话预约</div>
			</div>
		</div>
		<div class="flex-center">
			<div class="unit-1-2 text-center text-white item-block" @click="go('/myAddress')"
				style="background-color: #FF6655;">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe60b;</i>
				<div class="text-extra">收货地址</div>
			</div>
			<div class="unit-1-2 text-center text-white item-block" @click="go('/myTank')" 
				style="background-color: #FBD44E;">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe604;</i>
				<div class="text-extra">我的气罐</div>
			</div>
		</div>
		<div class="flex-left">
			<div class="unit-1-2 bk-blue text-center text-white item-block" @click="go('/order_current')">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe603;</i>
				<div class="text-extra">当前订单</div>
			</div>
			<div class="unit-1-2 bk-cyan text-center text-white item-block" @click="go('/order_history')">
				<i class="iconfont" style="font-size: 1.3rem;">&#xe652;</i>
				<div class="text-extra">历史订单</div>
			</div>
		</div>
		
<!-- 			<div>
				<mt-cell @click.native="go('/commit_order')" class="card">
					<div slot="title">
						<div class="flex-middle" style="padding: .5rem 0;">
							<div class="media flex-center">
								<div class="circle flex-middle flex-center">
									<i class="iconfont">&#xe602;</i>
								</div>
							</div>
							<div class="text-extra">预约换气</div>
						</div>
					</div>
				</mt-cell>
			</div>
			<div  style="margin-top: 1rem;">
				<mt-cell @click.native="go('/order_current')" class="card">
					<div slot="title">
						<div class="flex-middle">
							<div class="media flex-center" style="padding: .5rem 0;">
								<div class="circle flex-middle flex-center">
									<i class="iconfont">&#xe603;</i>
								</div>
							</div>
							<div class="text-extra">当前订单</div>
						</div>
					</div>
				</mt-cell>
			</div> -->
			
		</div>
		<!-- <mt-tabbar v-model="selected">
			<mt-tab-item id="home">
				<span class="iconfont">&#xe691;</span>
				<span class="mt-tab-item-title">首页</span>
			</mt-tab-item>
			<mt-tab-item id="center" @click.native="tabChange('/center')">
				<span class="iconfont">&#xe606;</span>
				<span class="mt-tab-item-title">个人中心</span>
			</mt-tab-item>
		</mt-tabbar> -->
	</div>
</template>
<script type="text/javascript">
import agent from '../util/agent'
import store from '../vuex/store'
export default {
	store,
	data () {
		return {
			selected: 'home',
		}
	},
	created() {
		store.commit('saveLogSuccessCallback', null)
	},
  	methods:{
  		tabChange(link){
  			this.$transfer.noTransfer(self, link)
  		},
		go (link, param) {
			this.$transfer.go(self, link, param)
		},
		back (link, param) {
			this.$transfer.back(self, link)
		}
	}
	
}
</script>

<style scoped lang="less">
.media{
	width: 3.5rem;
	margin-right: .5rem;
	img{
		width: 100%;
	}
}
.circle{
	width: 3rem;
	height: 3rem;
	background-color: #009BF7;
	border-radius: 50%;
	i{
		font-size: 1.2rem;
		color: #fff;
		font-weight: 800;
	}
}
.card{
	box-shadow: 0 0.15rem 0.3rem rgb(230, 230, 230);
}
.item-block{
	padding: 1rem 0rem;
	border: 5px solid #f7f7f7;
	// margin: .25rem;

}
// .mt-tab-item-title{
// 	line-height: 25px;
// 	height: 21px;
// 	display: inline-block;
// }
</style>