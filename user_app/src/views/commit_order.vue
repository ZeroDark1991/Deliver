<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed :title="title">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top" v-if="loadOk">
			<div v-if="type=='ol'">
				<mt-cell title="收货人" :value="currentAddress.userName"></mt-cell>
				<mt-cell title="配送地址" :value="currentAddress.address"></mt-cell>
				<mt-field label="手机号" :placeholder="telPlaceholder" disableClear :disabled="telDisabled" 
				type="tel" v-model="tel" class="link-tel"></mt-field>
				<mt-cell title="预约时间" :is-link="!isLater" @click.native="openPicker()" :value="timeSlot"></mt-cell>
				<button class="bottom-btn bk-cyan text-extra" style="bottom: 3rem;" @click="changeTel()">{{telChangeText}}</button>
				<button class="bottom-btn text-extra" :disabled="isLater" @click="submitOrder()"
				v-bind:class="{ 'bk-grey': isLater }">确认下单</button>
				<div class="v-modal" style="z-index:2006" @click="timeSlotPicker=false" v-show="timeSlotPicker"></div>
				<mt-picker class="timeSlot-picker" :show-toolbar="true" :slots="slots" @change="onValuesChange" v-show="timeSlotPicker" >
					<div class="picker-title flex-middle flex-center">
						预约时间段<a class="ok-picker" @click="timeSlotPicker=false">完成</a>
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
import store from '../vuex/store'
export default {
	data () {
		return {
			title:null,
			type:null,
			timeSlot:null,
			timeSlotPicker: false,
			tel:'',
			telChangeText:'更换号码',
			telDisabled:true,
			slots: [
				{
					flex: 1,
					values: [],
					textAlign: 'center'
				}
			],
			isLater:false,
			loadOk:false
		}
	},
	created() {
		store.commit('saveLogSuccessCallback', null)
		let self = this
		if (store.state.timeSlots) {
			let date = self.$Moment(new Date()).format("HH")
			let arr = []
			self.timeSlots.forEach( function(item, index) {
				let timeSlot = item.split(' - ')[1].split(':')[0]
				if (timeSlot > date) {
					arr.push(item)
				}
			})
			self.slots[0].values = arr
			if (arr.length==0) {
				self.isLater = true
				self.timeSlot = '超过预约时间'
			}else {
				self.timeSlot = self.slots[0].values[0]
			}
			self.loadOk = true
		}else {
			this.getTimeSlot()
		}
		store.dispatch('getUserInfo')
		
	},
	computed: {
		userInfo () {
			return store.state.userInfo
		},
		telPlaceholder(){
			return store.state.telPlaceholder
		},
		currentAddress () {
			let currentAddress = {
				address:null,
				areaCode:null,
				userName:null
			}
			if (store.state.addressList) {
				store.state.addressList.forEach( function(item, index) {
					if (item.current) {
						currentAddress = item
					}
				})
			}
			return currentAddress
			
		},
		timeSlots () {
			return store.state.timeSlots
		}
	},
  	methods:{
		go (link, param) {
			this.$transfer.go(self, link, param)
		},
		back (link, param) {
			this.$transfer.back(self, link)
		},
		onValuesChange(picker, values) {
			console.log(values[0])
			this.timeSlot = values[0]
		},
		openPicker() {
			if (!this.isLater) {
				this.timeSlotPicker = true
			}
		},
		getTimeSlot() {
			let self = this 
			self.$Indicator.open()
			agent.get('/api/app/timeSlots', '')
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (res == false) return
				let date = self.$Moment(new Date()).format("HH")
				if (res.timeSlots) {
					let arr = []
					res.timeSlots.forEach( function(item, index) {
						let timeSlot = item.split(' - ')[1].split(':')[0]
						if (timeSlot > date) {
							arr.push(item)
						}
					})

					self.slots[0].values = arr
					store.dispatch('saveTimeSlot', res.timeSlots)
					if (arr.length==0) {
						self.isLater = true
						self.timeSlot = '超过预约时间'
					}else {
						self.timeSlot = self.slots[0].values[0]
					}
				}
				self.loadOk = true
			})
		},
		changeTel() {
			if (this.telChangeText=='更换号码') {
				store.commit('SAVETELPLACEHOLDER', '请输入手机号码')
				this.telChangeText=  '取消'
				this.telDisabled = false
			}else {
				this.telDisabled = true
				store.commit('SAVETELPLACEHOLDER', store.state.userInfo.mobilePhoneNumber)
				// this.telPlaceholder = '请输入手机号'
				this.telChangeText=  '更换号码'
			}
			
		},
		submitOrder() {
			let self = this 
			let s = {
				address:self.currentAddress.address,
				areaCode:self.currentAddress.areaCode,
				userName:self.currentAddress.userName,
				timeSlot:self.timeSlot,
				userPhone:self.tel
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
		this.telDisabled = false
		this.tel = ''
		store.commit('SAVETELPLACEHOLDER', store.state.userInfo.mobilePhoneNumber)
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
// .tel-btn{
// 	height: 2.5rem;
// 	background-color: #009BF7;
// 	color: #fff;
// 	width: 100%;
// 	border-radius: 0;
// 	border: none;
// }
</style>