<template>
	<div class="page">
		<mt-header fixed title="当前订单">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top">
			<div v-if="loadOk">
				<mt-cell title="我的订单" v-for="item in orderList" @click.native="go('/order_detail',item.objectId)">
					<div slot="title">
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">地址:</span>{{item.address}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">预约时间:</span>{{item.timeSlot}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">下单时间:</span>{{item.createdAt}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">订单状态:</span>{{item.status}}
						</div>
					</div>
				</mt-cell>
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
			orderList:[],
			loadOk: false,
			tip: false
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getCurrentOrderList)
		if (store.state.currentOrderList) {
			this.orderList = store.state.currentOrderList
			this.loadOk = true
		}else{
			this.getCurrentOrderList()
		}
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		stringStatus(status) {
			let state
			switch (status) {
				case -1:
					state = '待送气工接单'
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
		// getDeliver(id) {
		// 	let self = this
		// 	if (!store.state.currentOrder) {
		// 		self.$Indicator.open();
		// 	}
		// 	agent.get('/api/d/info', {
		// 		id: id
		// 	})
		// 	.then(res => {
		// 		self.$Indicator.close();
		// 		console.log(res)
		// 		if (res == false) return
		// 		self.currentOrder.name = res.info.name,
		// 		self.currentOrder.phoneNumber = res.info.phoneNumber
		// 		store.commit('saveCurrentOrder', self.currentOrder)
		// 		self.loadOk = true
		// 	})
		// },
		getCurrentOrderList () {
			let self = this
			if (!store.state.currentOrderList) {
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
					self.orderList = data.list.map( item => {
						return {
							address: item.address,
							timeSlot: item.timeSlot,
							objectId: item.objectId,
							deliver:item.deliver ? item.deliver : null,
							createdAt: self.$Moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
							status: self.stringStatus(item.status)
						}
					})
					store.commit('saveCurrentOrderList', self.orderList)
					self.loadOk = true
					// self.currentOrder.address = data.list[0].address,
					// // self.currentOrder.status = self.stringStatus(data.list[0].status)
					// self.currentOrder.statusCode = data.list[0].status
					// self.currentOrder.timeSlot = data.list[0].timeSlot
					// if (data.list[0].deliver) {
					// 	self.getDeliver(data.list[0].deliver.objectId)
					// }else{
					// 	store.commit('saveCurrentOrder', self.currentOrder)
					// 	self.loadOk = true
					// }
				}else {
					self.tip = true
				}
			})
		},
	}
}
</script>

<style scoped lang="less">
.tip{
	height: 2rem;
	line-height: 2rem;
	text-align: center;
}
.item-title{
	width: 85px;
}

</style>