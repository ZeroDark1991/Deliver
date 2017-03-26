<template>
	<div class="page">
		<mt-header fixed title="订单详情">
			<mt-button icon="back" slot="left" @click="back(backPath)"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="loadOk">
				<mt-navbar v-model="selected" fixed style="top: 2.2rem;">
					<mt-tab-item id="订单状态">订单状态</mt-tab-item>
					<mt-tab-item id="订单详情">订单详情</mt-tab-item>
				</mt-navbar>

				<mt-tab-container v-model="selected" style="margin-top: 2.2rem;">
					<mt-tab-container-item id="订单状态" class="tree">
					<div class="tree2">
						<div class="tree-item" v-if="orderData.status==-1">
							<div class="text-extra">订单被取消</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="orderData.status>=0">
							<div class="flex-middle">
								<span class="text-extra unit-0">订单待确认</span>
								<span class="flex-right unit statusTime text-grey">{{orderData.createdAt2}}</span>
							</div>
							<div class="text-grey text-large">待送气工接单</div>
						</div>
						<div class="tree-item" v-if="orderData.status>=1" style="position: relative">
							<div class="flex-middle">
								<span class="text-extra unit-0">订单已确认</span>
								<span class="flex-right unit statusTime text-grey">{{orderData.confirmedAt2}}</span>
							</div>
							<div class="text-grey text-large">送气工赶往你家路上</div>
						</div>
						<div class="tree-item" v-if="orderData.status>=2">
							<div class="flex-middle">
								<span class="text-extra unit-0">气瓶已被取走</span>
								<span class="flex-right unit statusTime text-grey">{{orderData.receivedAt2}}</span>
							</div>
							<div class="text-extra"></div>
							<div class="text-grey text-large">新气瓶装配中</div>
						</div>
						<div class="tree-item tree-item-ok" v-if="orderData.status>=10">
							<div class="flex-middle">
								<span class="text-extra unit-0">订单已完成</span>
								<span class="flex-right unit statusTime text-grey">{{orderData.finishedAt2}}</span>
							</div>
							<!-- <i class="iconfont tree-icon">&#xe6cd;</i> -->
							<div class="text-extra"></div>
							<div class="text-grey text-large">气瓶已送达</div>
						</div>
					</div>
					</mt-tab-container-item>
					<mt-tab-container-item id="订单详情" style="margin-top: 1rem;">
						<mt-cell title="我的订单">
							<div slot="title">
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.userName">
									<span class="item-title">收货人:</span>{{orderData.userName}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.userPhone">
									<span class="item-title">联系电话:</span>{{orderData.userPhone}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.price">
									<span class="item-title">金额:</span>{{orderData.price}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.amount">
									<span class="item-title">气瓶数量:</span>{{orderData.amount}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle">
									<span class="item-title">收货地址:</span>{{orderData.address}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.deliver">
									<span class="item-title">配送员:</span>{{orderData.deliver.name}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.deliver">
									<span class="item-title">联系方式:</span>{{orderData.deliver.phoneNumber}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle">
									<span class="item-title">预约时间:</span>{{orderData.timeSlot}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.createdAt">
									<span class="item-title">下单时间:</span>{{orderData.createdAt}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.confirmedAt">
									<span class="item-title">确认时间:</span>{{orderData.confirmedAt}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.receivedAt">
									<span class="item-title">取罐时间:</span>{{orderData.receivedAt}}
								</div>
								<div style="height: 1.5rem;" class="flex-middle" v-if="orderData.finishedAt">
									<span class="item-title">完成时间:</span>{{orderData.finishedAt}}
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
import { mapState, mapActions, mapMutations} from 'vuex'
export default {
	data () {
		return {
			id:null,
			backPath: null,
			orderData:{
				objectId:null,
				address:null,
				status:null,
				amount:null,
				timeSlot:null,
				name:null,
				userPhone:null,
				createdAt:null,
				createdAt2:null
			},
			selected: '订单状态',
			loadOk: false,
			tip: false
		}
	},
	computed: {
		...mapState(['currentOrder']),
	},
	created() {
		console.log(1111111)
		this.saveLogSuccessCallback(this.getOrder)
	},
  	methods:{
  		...mapMutations(['saveLogSuccessCallback', 'saveCurrentOrder']),
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		getOrder (type) {
			console.log('type'+ type)
			let self = this
			if (!self.currentOrder || self.currentOrder.objectId!=self.id) {
				self.$Indicator.open();
			}
			agent.get('/api/order/userList', {
				type: type
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				let data = res
				if (res == false) return
				if (data.list && data.list.length!=0) {
					data.list.every( function(item, index) {
						if (item.objectId == self.id) {
							console.log(1212)
							self.orderData.userName = item.userName
							self.orderData.price = item.price
							self.orderData.objectId = item.objectId
							self.orderData.address = item.address
							self.orderData.status = item.status
							self.orderData.amount = item.amount
							self.orderData.timeSlot = item.timeSlot
							self.orderData.deliver = item.deliver
							self.orderData.userPhone = item.userPhone

							self.orderData.createdAt = item.createdAt
														? self.$Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
														:''
							self.orderData.createdAt2 = item.createdAt
														? self.$Moment(item.createdAt).format("MM/DD HH:mm:ss")
														:''
							self.orderData.confirmedAt = item.confirmedAt
														? self.$Moment(item.confirmedAt).format("YYYY-MM-DD HH:mm:ss")
														:''
							self.orderData.confirmedAt2 = item.confirmedAt
														? self.$Moment(item.confirmedAt).format("MM/DD HH:mm:ss")
														:''
							self.orderData.receivedAt = item.receivedAt
														? self.$Moment(item.receivedAt).format("YYYY-MM-DD HH:mm:ss")
														:''
							self.orderData.receivedAt2 = item.receivedAt
														? self.$Moment(item.receivedAt).format("MM/DD HH:mm:ss")
														:''
							self.orderData.finishedAt = item.finishedAt
														? self.$Moment(item.finishedAt).format("YYYY-MM-DD HH:mm:ss")
														:''
							self.orderData.finishedAt2 = item.finishedAt
														? self.$Moment(item.finishedAt).format("MM/DD HH:mm:ss")
														:''		
							self.loadOk = true
							self.tip = false	
							self.saveCurrentOrder(self.orderData)
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
		let type = Number(to.params.id.charAt(to.params.id.length - 1))
		next(vm => {
			let self = vm
			self.backPath = type==1 ? '/order_history' : '/order_current'
			self.id = to.params.id.substring(0,to.params.id.length-1)
			console.log(self.id)
			if (self.currentOrder) {
				if (self.currentOrder.objectId==self.id) {
					self.orderData = self.currentOrder
					self.loadOk = true
				}else{
					self.getOrder(type)
				}
			}else{
				self.getOrder(type)
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
	margin: 1rem 0 .5rem 0rem;
	padding-left: 1rem;
	position: relative;
	.tree2{
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
			.statusTime{
				padding-right: 1rem;
			}
		}
	}
}
.item-title{
	width: 85px;
}
</style>