<template>
	<div class="page">
		<mt-header fixed title="订单列表">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top" v-show="loadOk">
			<div v-infinite-scroll="loadMore"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="50"
			infinite-scroll-immediate-check="false">
				<mt-cell title="我的订单" v-for="(item,index) in filteredList" v-bind:key="item.objectId" @click.native="go('/order_detail',item.objectId+1)">
					<div slot="title" class="">
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">收货人:</span>{{item.userName}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">联系电话:</span>{{item.userPhone}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">收货地址:</span>{{item.address}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle">
							<span class="item-title">预约时间:</span>{{item.timeSlot}}
						</div>
						<div style="height: 1.5rem;" class="flex-middle" v-if="item.createAt">
							<span class="item-title">下单时间:</span>{{item.createAt}}
						</div>
					</div>
				</mt-cell>
				<p v-show="loading" class="flex-center bk-white">
					<mt-spinner type="fading-circle"></mt-spinner>
				</p>
			</div>
			<div v-if="lists.length==0" class="tip">暂无历史订单</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import agent from '../util/agent'
import { mapState, mapActions, mapMutations} from 'vuex'
export default {
	data () {
		return {
			loadOk: false,
			lists:[],
			filteredList:[],
			loading: false,
			limit:10,
			selected: '订单状态',
			noMore: false
		}
	},
	computed: {
		...mapState(['orderList']),
	},
	created() {
		this.saveLogSuccessCallback(this.getOrderList)
		if (this.orderList) {
			this.lists = this.orderList
			this.filteredList = this.lists.slice(0, this.limit)
			this.loadOk = true
		}else{
			this.getOrderList()
		}
	},
  	methods:{
  		...mapMutations(['saveLogSuccessCallback', 'saveOrderList']),
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param) {
			this.$transfer.back(self, link)
		},
		loadMore() {
			this.loading = true
			if(this.lists.length>this.limit){
				setTimeout(() => {
					this.limit += 10
					this.filteredList = this.lists.slice(0, this.limit)
					this.loading = false
				}, 1000);
			}else{
				this.loading = false
				this.noMore = true
			}
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
		// 			state = '新气瓶装配中'
		// 			break;
		// 		case 10:
		// 			state = '气瓶已送达 订单完成'
		// 			break;
		// 		default:
		// 			// statements_def
		// 			break;
		// 	}
		// 	return state
		// },
		getOrderList() {
			let self = this
			if (!this.orderList) {
				self.$Indicator.open();
			}
			agent.get('/api/order/userList', {
				type: 1
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (res == false) return
				if (res.list && res.list.length!=0) {
					self.lists = res.list.map(item => {
						return {
							address: item.address,
							// status: self.stringStatus(item.status),
							userPhone:item.userPhone,
							userName:item.userName,
							statusCode:item.status,
							timeSlot: item.timeSlot,
							createAt: self.$Moment(res.list[0].createdAt).format("YYYY-MM-DD HH:mm:ss"),
							objectId: item.objectId
						}
					})
					self.filteredList = self.lists.slice(0, this.limit)
					self.saveOrderList(self.lists)
				}
				self.loadOk = true
			})
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {

		})
	},
	beforeRouteLeave (to, from, next) {
		this.lists = []
		this.loadOk = false
		this.noMore = false
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