<template>
	<div class="page">
		<mt-header fixed title="订单列表">
			<mt-button icon="back" slot="left" @click="back('/order_current')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="loadOk">
				<mt-navbar v-model="selected" fixed style="top: 2.2rem;">
					<mt-tab-item id="订单状态">订单状态</mt-tab-item>
					<mt-tab-item id="订单详情">订单详情</mt-tab-item>
				</mt-navbar>

				<mt-tab-container v-model="selected" style="margin-top: 2.2rem;">
					<mt-tab-container-item id="订单状态" class="tree">
						<div class="tree-item" v-if="currentOrder.status==-1">
							<div class="text-extra">订单被取消</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="currentOrder.status>=0">
							<div class="text-extra">订单待确认</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="currentOrder.status>=1" style="position: relative">
							<div class="text-extra">订单已确认</div>
							<div class="text-grey text-large">送气工赶往你家路上</div>
						</div>
						<div class="tree-item" v-if="currentOrder.status>=2">
							<div class="text-extra">气罐已被取走</div>
							<div class="text-grey text-large">新气罐装配中</div>
						</div>
						<div class="tree-item tree-item-ok" v-if="currentOrder.status>=10">
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
								<div style="height: 1.5rem;" class="flex-middle" v-if="currentOrder.deliver">
									<span class="item-title">配送员:</span>{{currentOrder.deliver.name}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="currentOrder.deliver">
									<span class="item-title">联系方式:</span>{{currentOrder.deliver.phoneNumber}}
								</div>
							</div>
						</mt-cell>
					</mt-tab-container-item>
				</mt-tab-container>	
			</div>
			<div class="tip" v-if="tip">无此订单</div>
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
			id:null,
			currentOrder:{
				objectId:null,
				address:null,
				status:null,
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
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		getCurrentOrder () {
			let self = this
			if (!store.state.currentOrder || store.state.currentOrder.objectId!=self.id) {
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
					data.list.every( function(item, index) {
						if (item.objectId == self.id) {
							self.currentOrder.objectId = item.objectId
							self.currentOrder.address = item.address
							self.currentOrder.status = item.status
							self.currentOrder.timeSlot = item.timeSlot
							self.currentOrder.deliver = item.deliver
							self.currentOrder.createdAt = self.$Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
							store.commit('saveCurrentOrder', self.currentOrder)
							self.loadOk = true
							self.tip = false
							return false
						}else {
							self.tip = true
							return true
						}
					});
				}else {
					self.tip = true
				}
			})
		},
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			let self = vm
			self.id = to.params.id
			if (store.state.currentOrder) {
				console.log(store.state.currentOrder.objectId)
				console.log(self.id)
				if (store.state.currentOrder.objectId==self.id) {
					self.currentOrder = store.state.currentOrder
					self.loadOk = true
				}else{
					self.getCurrentOrder()
				}
			}else{
				self.getCurrentOrder()
			}
		})
	},
	beforeRouteLeave (to, from, next) {
		next(vm => {
			vm.loadOk = false
			vm.tip = false
			vm.id = null
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
}
.item-title{
	width: 85px;
}
</style>