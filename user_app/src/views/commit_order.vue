<template>
	<div class="page">
	<!-- Header -->
		<mt-header fixed title="预约上门">
			<mt-button icon="back" slot="left" @click="back('/home')"></mt-button>
		</mt-header>
		<div class="container-top" v-if="loadOk">
			<mt-cell title="配送地址" :value="userInfo.address"></mt-cell>
			<mt-cell title="预约时间" :is-link="!isLater" @click.native="openPicker()" :value="userInfo.timeSlot"></mt-cell>
			<button class="bottom-btn text-extra" :disabled="isLater" @click="submitOrder()"
			v-bind:class="{ 'bk-grey': isLater }">确认下单</button>
			<div class="v-modal" style="z-index:2006" @click="timeSlotPicker=false" v-show="timeSlotPicker"></div>
			<mt-picker class="timeSlot-picker" :show-toolbar="true" :slots="slots" @change="onValuesChange" v-show="timeSlotPicker" >
				<div class="picker-title flex-middle flex-center">
					预约时间段<a class="ok-picker" @click="timeSlotPicker=false">完成</a>
				</div>
			</mt-picker>
		</div>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import store from '../vuex/store'
export default {
	data () {
		return {
			userInfo: {
				address: '',
				areaCode: '',
				timeSlot: ''
			},
			timeSlot:null,
			timeSlotPicker: false,
			slots: [
				{
					flex: 1,
					values: [],
					textAlign: 'center',
					className: 'slot1'

				}
			],
			isLater:false,
			loadOk:false
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getUserInfo)
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
			this.userInfo.timeSlot = values[0]
		},
		openPicker() {
			if (!this.isLater) {
				this.timeSlotPicker = true
			}
		},
		closePicker() {

		},
		getTimeSlot() {
			let self = this 
			self.$Indicator.open();
			agent.get('/api/app/timeSlots', '')
			.then(res => {
				self.$Indicator.close();
				console.log(res)
				if (res == false) return
				let date = self.$Moment(new Date()).format("HH")
				let arr = []
				res.timeSlots.forEach( function(item, index) {
					let timeSlot = item.split(' - ')[1].split(':')[0]
					if (timeSlot > date) {
						arr.push(item)
					}
				})
				self.slots[0].values = arr
				if (arr.length==0) {
					self.isLater = true
					self.userInfo.timeSlot = '超过预约时间'
				}
				self.loadOk = true
			})
		},
		submitOrder() {
			let self = this 
			agent.post('/api/order/create', self.userInfo)
			.then(res => {
				console.log(res)
				if (res == false) return
				self.go('/order_list','0')
			})
		},
		getUserData() {
			let self = this
			if (store.state.userInfo == null) {
				agent.get('/api/u/info', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					self.userInfo.address = res.user.address
					self.userInfo.areaCode = res.user.areaCode
					self.userInfo.mobilePhoneNumber = res.user.mobilePhoneNumber
					self.userInfo.username = res.user.username
					store.commit('saveUserInfo',self.userInfo)
				})
			}
		}
			
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.userInfo.address = store.state.userInfo ? store.state.userInfo.address : ''
			vm.userInfo.areaCode = store.state.userInfo ? store.state.userInfo.areaCode : ''
			vm.getTimeSlot()
			vm.getUserData()
		})
	},
	beforeRouteLeave (to, from, next) {
		this.isLater = false
		this.timeSlot = null
		this.loadOk = false
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
</style>