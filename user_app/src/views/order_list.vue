<template>
	<div class="page">
		<mt-header fixed title="订单列表">
			<mt-button icon="back" slot="left" @click="back(backPath)"></mt-button>
		</mt-header>
		<div class="container-top">
			<mt-cell title="我的订单" value="" v-for="item in list" style="min-height: 4.5rem;">
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
				</div>
			</mt-cell>

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
			backPath:''
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
			agent.get('/api/order/userList', {
				type: 0
			})
			.then(res => {
				console.log(res)
				if (res.success==true) {
					if (res.list) {
						self.list = res.list.map(item => {
							
							return {
								address: item.address,
								status: self.stringStatus(item.status),
								timeSlot: item.timeSlot,
								// objectId: item.objectId

							}
						})
					}
				}
			})
		},
		getData2 () {
			let self = this
			agent.get('/api/order/userList', {
				type: 1
			})
			.then(res => {
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
				}
			})
		},
	},
	beforeRouteEnter (to, from, next) {
		console.log(12)
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
	}
}
</script>

<style scoped>
</style>