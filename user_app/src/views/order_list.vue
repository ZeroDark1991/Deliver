<template>
	<div class="page">
		<mt-header fixed title="订单列表">
			<mt-button icon="back" slot="left" @click="back(backPath)"></mt-button>
		</mt-header>
		<div class="container-top" v-if="loadOk && type == 0">
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
					<div class="tip" v-if="!currentOrder">目前暂无订单</div>
				</mt-tab-container-item>
			</mt-tab-container>	
		</div>

		<div class="container-top" v-if="loadOk && type == 1" >
			<div :infinite-scroll-listen-for-event="loadMore()"
  				infinite-scroll-disabled="loading"
  				infinite-scroll-distance="50"
  				infinite-scroll-immediate-check="false">
				<mt-cell title="我的订单" v-for="(item,index) in filteredItems" v-bind:key="index">
					<div slot="title" class="">
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">地址:</span>{{item.address}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">预约时间:</span>{{item.timeSlot}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle" v-if="item.createAt">
							<span class="item-title">下单时间:</span>{{item.createAt}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle" v-if="deliver">
							<span class="item-title">配送员:</span>{{deliver.name}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle" v-if="deliver">
							<span class="item-title">联系方式:</span>{{deliver.phoneNumber}}
						</div>
					</div>
				</mt-cell>
			</div>
			
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import store from '../../vuex/store'
export default {
	data () {
		return {
			store,
			list:[],
			currentOrder:{
				address:null,
				status:null,
				statusCode:null,
				timeSlot:null,
				name:null,
				phoneNumber:null
			},
			loading: false,
			limit:10,
			type:'',
			backPath:'',
			deliver: null,
			selected: '订单状态',
			isOk: false
		}
	},
	computed: {
		loadOk () {
			if (this.type == 0) {
				return store.state.currentOrder ? true : false
			}else{
				return store.state.orderList.length==0 ? false : true
			}
		},
		filteredItems() {
			let listssss = []
			console.log(this.isOk)
			if (this.isOk) {
				listssss = this.list.slice(0, this.limit)
			}
			return listssss
		}
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		loadMore(){
			console.log(12333)
			let self = this 
			self.loading = true
			self.limit += 10
			// self.loading = false
		},
		stringStatus(status) {
			let state
			switch (status) {
				case -1:
					state = '待送气工接单'
					console.log(state)
					break;
				case 0:
					state = '待送气工接单'
					break;
				case 1:
					state = '送气工赶往你家路上'
					break;
				case 2:
					state = '新气罐装配中'
					break;
				case 10:
					state = '气罐已送达 订单完成'
					break;
				default:
					// statements_def
					break;
			}
			return state
		},
		getDeliver(id) {
			console.log(id)
			let self = this
			console.log(self.loadOk)
			if (!store.state.currentOrder) {
				self.$Indicator.open();
			}
			agent.get('/api/d/info', {
				id: '58451ae60ce46300577fb0d4'//id
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (!res.success) {self.$Toast(res.message);return}
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
				if (!res.success) {self.$Toast(res.message);return}
				if (data.list) {
					self.currentOrder.address = data.list[0].address,
					self.currentOrder.status = self.stringStatus(data.list[0].status)
					self.currentOrder.statusCode = data.list[0].status
					self.currentOrder.timeSlot = data.list[0].timeSlot
					if (data.list[0].deliver) {
						self.getDeliver(data.list[0].objectId)
					}else{
						store.commit('saveCurrentOrder', self.currentOrder)
						self.loadOk = true
					}
				}
			})
		},
		getOrderList() {
			let self = this
			if (store.state.orderList.length == 0) {
				self.$Indicator.open();
			}
			agent.get('/api/order/userList', {
				type: 1
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (!res.success) {self.$Toast(res.message);return}
				if (res.list) {
					let array = res.list.map(function(item, index) {
						return {
							address: item.address,
							status: self.stringStatus(item.status),
							statusCode:item.status,
							timeSlot: item.timeSlot,
							objectId: item.objectId,
							createAt: self.$Moment(res.list[0].createdAt).format("YYYY-MM-DD HH:mm:ss")
						}

					});
					console.log(self.isOk)
					self.isOk = true
					self.list = ([]).concat(array)
					console.log(self.list)
					// self.list = res.list.map(item => {
					// 	return {
					// 		address: item.address,
					// 		status: self.stringStatus(item.status),
					// 		statusCode:item.status,
					// 		timeSlot: item.timeSlot,
					// 		createAt: self.$Moment(res.list[0].createdAt).format("YYYY-MM-DD HH:mm:ss")
					// 		// objectId: item.objectId
					// 	}
					// })



					store.commit('saveOrderList', self.list)
				}
				self.loadOk = true
			})
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.type = to.params.type
			if (vm.type == 1) {
				vm.backPath = '/center'
				if (store.state.orderList) {
					vm.list = store.state.orderList
				}
				vm.getOrderList()
			}else if (vm.type == 0) {
				vm.backPath = '/home'
				if (store.state.currentOrder) {
					vm.currentOrder = store.state.currentOrder
				}
				vm.getCurrentOrder()
			}
		})
	},
	beforeRouteLeave (to, from, next) {
		this.type = ''
		this.list = []
		this.deliver = null
		this.loadOk = false
		next()
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
		background-color: #f7f7f7;
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