<template>
	<div class="page">
		<mt-header fixed title="订单列表">
			<mt-button icon="back" slot="left" @click="back(backPath)"></mt-button>
		</mt-header>
		<div class="container-top" v-if="loadOk">
			<mt-cell title="我的订单" v-for="item in list">
				<div slot="title">
					<div style="height: 1rem;">{{item.status}}</div>
					<div style="height: 1rem;" class="flex-middle">
						地址:{{item.address}}
					</div>
					<div style="height: 1rem;" class="flex-middle text-large">
						预约时间:{{item.timeSlot}}
					</div>
					<div style="height: 1rem;" class="flex-middle text-large" v-if="item.createAt">
						下单时间:{{item.createAt}}
					</div>
					<div style="height: 1rem;" class="flex-middle text-large" v-if="deliver">
						配送员:{{deliver.name}}
					</div>
					<div style="height: 1rem;" class="flex-middle text-large" v-if="deliver">
						联系方式:{{deliver.phoneNumber}}
					</div>
				</div>
			</mt-cell>
			<div class="tip" v-if="list.lenght==0">目前暂无订单</div>

		</div>

	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
export default {
	data () {
		return {
			list:[],
			type:'',
			backPath:'',
			deliver: null,
			loadOk:false
		}
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
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
		getData () {
			let self = this
			self.$Indicator.open();
			agent.get('/api/order/userList', {
				type: 0
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				let data = res
				if (data.success==true) {
					if (data.list) {
						let buffer = {
							address: data.list[0].address,
							status: self.stringStatus(data.list[0].status),
							timeSlot: data.list[0].timeSlot,
							// objectId: item.objectId
						}
						if (data.list[0].deliver) {
							self.getDeliver(data.list[0].objectId)
						}else{
							self.loadOk = true
						}
						self.list.push(buffer)
					}
				}
			})
		},
		getData2 () {
			let self = this
			self.$Indicator.open();
			agent.get('/api/order/userList', {
				type: 1
			})
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (res.success==true) {
					if (res.list) {
						self.list = res.list.map(item => {
							return {
								address: item.address,
								status: self.stringStatus(item.status),
								timeSlot: item.timeSlot,
								createAt: self.$Moment(res.list[0].createdAt).format("YYYY-MM-DD HH:mm:ss")
								// objectId: item.objectId
							}
						})
					}
					self.loadOk = true
				}
			})
		},
		getDeliver(id) {
			console.log(id)
			let self = this
			agent.get('/api/d/info', {
				id: '58451ae60ce46300577fb0d4'//id
			})
			.then(res => {
				console.log(res)
				if (res.success==true) {
					self.deliver  = {
						name: res.info.name,
						phoneNumber: res.info.phoneNumber
					}
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
				vm.getData2()
			}else if (vm.type == 0) {
				vm.backPath = '/home'
				vm.getData()
			}
		})
	},
	beforeRouteLeave (to, from, next) {
		this.list = []
		this.type = ''
		this.deliver = null
		this.loadOk = false
		next()
	}
}
</script>

<style scoped>
.tip{
	height: 2rem;
	line-height: 2rem;
	text-align: center;
}
</style>