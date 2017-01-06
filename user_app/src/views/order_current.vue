<template>
	<div class="page">
		<mt-header fixed title="当前订单">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="loadOk">
				<mt-navbar v-model="selected" fixed style="top: 2.2rem;">
					<mt-tab-item id="订单状态">订单状态</mt-tab-item>
					<mt-tab-item id="订单详情">订单详情</mt-tab-item>
				</mt-navbar>

				<mt-tab-container v-model="selected" style="margin-top: 2.2rem;">
					<mt-tab-container-item id="订单状态" class="tree">
						<div class="tree-item" v-if="currentOrder.statusCode==-1">
							<div class="text-extra">订单被取消</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="currentOrder.statusCode>=0">
							<div class="text-extra">订单待确认</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="currentOrder.statusCode>=1" style="position: relative">
							<div class="text-extra">订单已确认</div>
							<div class="text-grey text-large">送气工赶往你家路上</div>
						</div>
						<div class="tree-item" v-if="currentOrder.statusCode>=2">
							<div class="text-extra">气罐已被取走</div>
							<div class="text-grey text-large">新气罐装配中</div>
						</div>
						<div class="tree-item tree-item-ok" v-if="currentOrder.statusCode>=10">
							<!-- <i class="iconfont tree-icon">&#xe6cd;</i> -->
							<div class="text-extra">订单已完成</div>
							<div class="text-grey text-large">气罐已送达</div>
						</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="订单详情" style="margin-top: 1rem;">
						<mt-cell title="我的订单">
							<div slot="title">
								<div style="height: 1.5rem;" class="flex-middle">
									<span class="item-title">地址:</span>{{currentOrder.address}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle">
									<span class="item-title">预约时间:</span>{{currentOrder.timeSlot}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="currentOrder.createAt">
									<span class="item-title">下单时间:</span>{{currentOrder.createAt}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="currentOrder.name">
									<span class="item-title">配送员:</span>{{currentOrder.name}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="currentOrder.phoneNumber">
									<span class="item-title">联系方式:</span>{{currentOrder.phoneNumber}}
								</div>
							</div>
						</mt-cell>
					</mt-tab-container-item>
				</mt-tab-container>	
			</div>
			<div class="tip" v-if="tip">当前无订单</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import store from '../vuex/store'
export default {
	store,
	data () {
		return {
			currentOrder:{
				address:null,
				status:null,
				statusCode:null,
				timeSlot:null,
				name:null,
				phoneNumber:null
			},
			selected: '订单状态',
			loadOk: false,
			tip: false
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getCurrentOrder)
		if (store.state.currentOrder) {
			this.currentOrder = store.state.currentOrder
			this.loadOk = true
		}else{
			this.getCurrentOrder()
		}
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		// stringStatus(status) {
		// 	let state
		// 	switch (status) {
		// 		case -1:
		// 			state = '待送气工接单'
		// 			break;
		// 		case 0:
		// 			state = '待送气工接单'
		// 			break;
		// 		case 1:
		// 			state = '送气工赶往你家路上'
		// 			break;
		// 		case 2:
		// 			state = '新气罐装配中'
		// 			break;
		// 		case 10:
		// 			state = '气罐已送达 订单完成'
		// 			break;
		// 		default:
		// 			// statements_def
		// 			break;
		// 	}
		// 	return state
		// },
		getDeliver(id) {
			let self = this
			if (!store.state.currentOrder) {
				self.$Indicator.open();
			}
			agent.get('/api/d/info', {
				id: '58451ae60ce46300577fb0d4'//id
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (res == false) return
				self.currentOrder.name = res.info.name,
				self.currentOrder.phoneNumber = res.info.phoneNumber
				store.commit('saveCurrentOrder', self.currentOrder)
				self.loadOk = true
			})
		},
		getCurrentOrder () {
			let self = this
			if (!store.state.currentOrder) {
				self.$Indicator.open();
			}
			agent.get('/api/order/userList', {
				type: 0
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				let data = res
				if (res == false) return
				if (data.list && data.list.length!=0) {
					self.currentOrder.address = data.list[0].address,
					// self.currentOrder.status = self.stringStatus(data.list[0].status)
					self.currentOrder.statusCode = data.list[0].status
					self.currentOrder.timeSlot = data.list[0].timeSlot
					if (data.list[0].deliver) {
						self.getDeliver(data.list[0].objectId)
					}else{
						store.commit('saveCurrentOrder', self.currentOrder)
						self.loadOk = true
					}
				}else {
					self.tip = true
				}
			})
		},
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {

		})
	},
	beforeRouteLeave (to, from, next) {
		next(vm => {
			vm.loadOk = false
		})
		
	}
}
</script>

<style scoped lang="less">
.tip{
	height: 2rem;
	line-height: 2rem;
	text-align: center;
}
.tree{
	margin: 1rem .5rem .5rem 1rem;
	padding-left: 1rem;
	position: relative;
	&:before{
		content: ' ';
		width: 1px;
		height: calc(~"100% - 1rem");
		position: absolute;
		background-color: #009BF7;
		left: 0;
		top: .4rem;
	}
	.tree-item{
		position: relative;
		background-color: #f0f0f0;
		overflow: visible;
		height: 70px;
		line-height: 30px;
		&:before{
			content: ' ';
			width: .5rem;
			height: .5rem;
			border-radius: 50%;
			position: absolute;
			background-color: #009BF7;
			left: -1.25rem;
			top: .4rem;
		}
	}
	// .tree-icon{
	// 	position: absolute;
	// 	left: -1.5rem;
	// 	background-color: #f7f7f7;
	// 	font-size: 1.3rem;
	// 	color: #009BF7;
	// }
}
.item-title{
	width: 85px;
}

</style>