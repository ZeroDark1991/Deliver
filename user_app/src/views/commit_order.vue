<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed :title="title">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top" v-if="loadOk">
			<div v-if="type=='ol'" class="card">
				<div class="address-card card" >
					<mt-cell is-link @click.native="go('/chooseAddress')">
						<div slot="title" class="address-wrap">
							<div class="flex-middle" style=" height: 1.5rem;line-height: 1.5rem;">
								<div class="unit one-line">收货人：{{currentAddress.userName}}</div>
								<div class="unit text-right">{{currentAddress.phoneNumber}}</div>
							</div>
							<div class="flex-middle" style="margin: .5rem 0 .25rem 0;">
								<div class="two-line"style="line-height: 1rem;">收货地址：{{currentAddress.address}}</div>
							</div>
						</div>
					</mt-cell>
				</div>
				<!-- <mt-cell title="收货人" :value="currentAddress.userName" is-link @click.native="go('/myAddress', '1')"></mt-cell>
				<mt-cell title="配送地址" :value="currentAddress.address"></mt-cell>
				<mt-cell title="联系电话" :value="currentAddress.phoneNumber"></mt-cell> -->
				<!-- <mt-field label="手机号" :placeholder="telPlaceholder" disableClear :disabled="telDisabled" 
				type="tel" v-model="tel" class="link-tel"></mt-field> -->
				<!-- <mt-cell title="预约时间" @click.native="open('timeSlot1')" :value="timeSlot1"></mt-cell>
				<mt-cell title="预约时间" @click.native="open('timeSlot2')" :value="timeSlot2"></mt-cell> -->
				<div class="card">
					<mt-cell title="气瓶数量" @click.native="openPicker('tankAmountPicker')" :value="amount"></mt-cell>
					<mt-cell title="预约时间" @click.native="openPicker('timeSlotPicker')" :value="timeSlot"></mt-cell>
				
				</div>
				<button class="bottom-btn text-extra" :disabled="isLater" @click="submitOrder()"
				v-bind:class="{ 'bk-grey': isLater }">确认下单</button>
				
				<div class="v-modal" style="z-index:2006" @click="closePicker()" v-show="timeSlotPicker || tankAmountPicker"></div>
				<mt-picker class="timeSlot-picker" :show-toolbar="true" :slots="slots" @change="onValuesChange" v-show="timeSlotPicker" >
					<div class="picker-title flex-middle flex-center">
						预约时间段<a class="ok-picker" @click="timeSlotPicker=false">完成</a>
					</div>
				</mt-picker>
				<mt-picker class="timeSlot-picker" :show-toolbar="true" :slots="amountSlots" @change="onAmountChange" v-show="tankAmountPicker" >
					<div class="picker-title flex-middle flex-center">
						气瓶数量<a class="ok-picker" @click="tankAmountPicker=false">完成</a>
					</div>
				</mt-picker>
			</div>
			<div v-if="type=='tel'">
				<p style="padding: .5rem;text-align: center;">
					您可以直接拨打电话预约!
				</p>
				<a class="bottom-btn text-extra flex-middle flex-center" href="tel:13588277370">
					<i class="iconfont" style="margin-right: .5rem;">&#xe608;</i>电话预约
				</a>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import { mapState, mapActions, mapMutations} from 'vuex'

export default {
	data () {
		return {
			currentTimePicker: null,
			title: null,
			type: null,
			timeSlot: null,
			amount: 1,
			timeSlotPicker: false,
			tankAmountPicker: false,
			slots: [
				{
					flex: 1,
					values: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
					textAlign: 'right'
				},
				{
					divider: true,
					content: ':',
				},
				{
					flex: 1,
					values: ['00', '10', '20', '30', '40', '50'],
					textAlign: 'left'
				},
				{
					divider: true,
					content: '-',
				},
				{
					flex: 1,
					values: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
					textAlign: 'right'
				},
				{
					divider: true,
					content: ':',
				},
				{
					flex: 1,
					values: ['00', '10', '20', '30', '40', '50'],
					textAlign: 'left'
				},
				
			],
			amountSlots:[
				{
					flex: 1,
					values: ['1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20'],
					textAlign: 'center'
				},
			],
			isLater: false,
			loadOk: false
		}
	},
	created() {
		this.saveLogSuccessCallback(null)
		let self = this
		let date = self.$Moment(new Date()).format("HH")
		let arr = []
		// self.timeSlot = self.slots[0].values[0] + ':' + self.slots[2].values[0] + ' - ' + self.slots[4].values[0] + ':' + self.slots[6].values[1]
		self.slots[0].values.forEach( function(item, index) {
			if (item > date) {
				arr.push(item)
			}
		})
		if (arr.length == 0) {
			self.isLater = true
			self.timeSlot = '超过预约时间'
		}else{
			self.slots[0].values = arr
			self.slots[4].values = arr
			self.timeSlot = self.slots[0].values[0] + ':' + self.slots[2].values[0] + ' - ' + self.slots[4].values[0] + ':' + self.slots[6].values[1]
		}
		
		// if (store.state.timeSlots) {
		// 	console.log(store.state.timeSlots)
		// 	let date = self.$Moment(new Date()).format("HH")
		// 	let arr = []
		// 	store.state.timeSlots.forEach( function(item, index) {
		// 		let timeSlot = item.split(' - ')[1].split(':')[0]
		// 		if (timeSlot > date) {
		// 			arr.push(item)
		// 		}
		// 	})
		// 	self.slots[0].values = arr
		// 	if (arr.length==0) {
		// 		self.isLater = true
		// 		self.timeSlot = '超过预约时间'
		// 	}else {
		// 		self.timeSlot = self.slots[0].values[0]
		// 	}
		// 	self.loadOk = true
		// }else {
		// 	this.getTimeSlot()
		// }
		console.log('1234')
		this.getUserInfo()
		self.loadOk = true
		
	},
	computed: {
		...mapState(['userInfo']),
		...mapState(['orderAddress']),
		...mapState(['addressList']),
		currentAddress () {
			let currentAddress = {
				address: null,
				areaCode: null,
				userName: null,
				phoneNumber: null
			}
			if (!this.orderAddress) {
				let count = 0
				if (this.addressList) {
					this.addressList.forEach( function(item, index) {
						console.log(item)
						if (item.current) {
							currentAddress = item
							count++
						}
					})
				}else{
					if (count===0) {
						this.loadOk = false
						this.$MessageBox.alert('请先设置地址').then(action => {
							this.go('/myAddress')
						})
					}
				}
			}else{
				currentAddress = this.orderAddress
			}
			return currentAddress
			
		},
		// timeSlots () {
		// 	return store.state.timeSlots
		// }
	},
  	methods:{
  		...mapActions(['getUserInfo']),
  		...mapMutations(['saveLogSuccessCallback', 'saveOrderAddress']),
		go (link, param) {
			this.$transfer.go(self, link, param)
		},
		back (link, param) {
			this.$transfer.back(self, link)
		},
		closePicker(){
			this.timeSlotPicker = false
			this.tankAmountPicker = false
		},
		onAmountChange(picker, values) {
			this.amount = values[0]
		},
		onValuesChange(picker, values) {
			let self = this
			let arr = [], arr1 = []
			self.slots[0].values.forEach( function(item, index) {
				if (item >= values[0]) {
					arr.push(item)
				}
			})
			if (values[0] == values[2]) {
				self.slots[2].values.forEach( function(item1, index1) {
					if (Number(item1) > Number(values[1])) {
						arr1.push(item1)
					}
				})
				self.slots[6].values = arr1
			}else{
				self.slots[6].values = self.slots[2].values
			}
			self.slots[4].values = arr
			self.timeSlot = values[0] + ':' + values[1] + ' - ' + values[2] + ':' +values[3]
		},
		openPicker(type) {
			if (type == 'timeSlotPicker') {
				if (!this.isLater) {
					this.timeSlotPicker = true
				}
			}else {
				if (!this.isLater) {
					this.tankAmountPicker = true
				}
			}
		},
		submitOrder() {
			let self = this 
			let s = {
				address:self.currentAddress.address,
				areaCode:self.currentAddress.areaCode,
				userName:self.currentAddress.userName,
				userPhone:self.currentAddress.phoneNumber,
				amount:self.amount+'',
				timeSlot:self.timeSlot
			}
			console.log(s)
			agent.post('/api/order/create', s )
			.then(res => {
				console.log(res)
				if (res == false) return
				self.go('/order_current')
			})
		}	
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.type = to.params.type
			vm.title = to.params.type=='ol' ? '预约上门' : '电话预约'
		})
	},
	beforeRouteLeave (to, from, next) {
		this.isLater = false
		this.timeSlot = null
		this.loadOk = false
		this.saveOrderAddress(null)
		next()
	}
	
}
</script>

<style scoped lang="less">
	.timeSlot-picker{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2007;
		width: 100%;
		background-color: #fff;
		.picker-title{
			background-color: #FAFAFA;
			position: relative;
			height: 2rem;
			.ok-picker{
				position: absolute;
				right: .5rem;
			}
		}
	}
	input.mint-field-core{
		text-align: right;
	}
	.address-card{
		margin-bottom: .5rem;
	}
	.card{
		box-shadow: 0 1px 3px 1px #e9e9e9;
	}
</style>