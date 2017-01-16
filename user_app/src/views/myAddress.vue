<template>
	<div class="page">
		<mt-header fixed title="我的地址">
			<mt-button icon="back" slot="left" @click="back(backPath)"></mt-button>
		</mt-header>
		<div class="container-top">
			<mt-cell class="address-list" v-for="item in addressList" @click.native="chooseOrderAddress(item.id)">
				<div slot="title" class="address-wrap">
					<div class="flex-middle" style="margin-top: .5rem;">
						<div class="unit one-line">{{item.userName}}</div>
						<div class="unit">{{item.phoneNumber}}</div>
					</div>
					<div class="flex-middle" style="margin-top: .5rem;">
						<div class="one-line">{{item.address}}</div>
					</div>
					<div class="flex-middle" style="margin-top: 1rem;" v-show="type1 != 1">
						<div class="unit-1-2 flex-middle" @click="changeCurrentAddress(item.id)">
							<span class="checked iconfont" :class="{'is-checked': item.current, 'not-checked': !item.current}">&#xe627;</span>默认地址
						</div>
						<div class="flex-middle flex-right unit-1-2">
							<i class="iconfont edit-btn" @click="editAddress(item.id)">&#xe63d;</i>
							<i class="iconfont delete-btn" @click="deleteAddress(item.id,item.current)">&#xe601;</i>
						</div>
					</div>
				</div>
				
			</mt-cell>
			<div class="add-btn text-theme-blue flex-middle flex-center">
				<i class="unit-0 iconfont" @click="newAddress()">&#xe634;</i>
			</div>
		</div>
		
		<!-- <mt-button size="large" class="bottom-btn" @click="newAddress()"><i class="iconfont">&#xe62b;</i>新建地址</mt-button> -->
		<mt-popup v-model="popupVisible" position="right">
			<mt-header fixed :title="popupTitle">
				<mt-button icon="back" slot="left" @click="popupVisible = false"></mt-button>
			</mt-header>
			<div class="container-top">
				<mt-field label="收货人" placeholder="收货人姓名" v-model="editAddressData.userName"></mt-field>
				<mt-field label="联系电话" placeholder="联系电话" type="tel" v-model="editAddressData.phoneNumber"></mt-field>
				<mt-field label="地区" v-model="place" disabled></mt-field>
				<!-- <mt-cell title="地区" :value="place"></mt-cell> -->
				<mt-cell class="invoice-cell" title="街道" is-link @click.native="addressPicker = true" :value="editAddressData.street"></mt-cell>
				<mt-field label="详细地址" placeholder="详细地址" type="textarea" rows="2" v-model="editAddressData.detail_address"></mt-field>
			</div>
			<mt-button size="large" class="bottom-btn" @click="saveAddress()">保存</mt-button>
		</mt-popup>
		<div class="v-modal" style="z-index:2006" @click="closePicker()" v-show="addressPicker"></div>
		<mt-picker class="address-picker" :show-toolbar="true" :slots="slots" @change="onValuesChange" v-show="addressPicker" >
			<div class="picker-title flex-middle flex-center">
				省份<a class="ok-picker" @click="closePicker()">完成</a>
			</div>
		</mt-picker>
	</div>
</template>

<script type="text/javascript">
import agent from '../util/agent'
import store from '../vuex/store'
export default {
	data () {
		return {
			place: '东阳市',
			backPath: null,
			store,
			popupTitle:'',
			type:null,
			type1:null,
			areaCodeList:null,
			popupVisible:false,
			addressPicker:false,
			editAddressData:{
				userName:'',
				street:'',
				areaCode:'',
				detail_address:'',
				id:'',
				phoneNumber:''
			},
			slots: [
				{
					flex: 1,
					values: ['白杨街道1','白杨街道2','白杨街道3','白杨街道4','白杨街道5'],
					textAlign: 'center',
					defaultIndex: 5,
					className: 'slot1'
				}
			]
		}
	},
	created() {
		store.commit('saveLogSuccessCallback', null)
		store.dispatch('getUserInfo')
		this.getAreaCodes()
	},
	computed: {
		addressList () {
			return store.state.addressList
		},
		district(){
			return store.state.district
		},
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		},
		newAddress() {
			this.getAreaCodes()
			this.type = 'new'
			this.popupTitle = '新增地址'
			this.popupVisible = true
			this.editAddressData.userName = ''
			this.editAddressData.street = '请选择'
			this.editAddressData.detail_address = ''
			this.editAddressData.phoneNumber = ''
		},
		editAddress(addressId) {
			let self = this
			self.type = 'edit'
			self.popupTitle = '修改地址'
			self.getAreaCodes()
			self.popupVisible = true
			self.editAddressData.id = addressId
			store.state.addressList.forEach( function(item, index) {
				if (item.id == addressId) {
					self.editAddressData.phoneNumber = item.phoneNumber ? item.phoneNumber : ''
					self.editAddressData.areaCode = item.areaCode ? item.areaCode : ''
					self.editAddressData.userName = item.userName ? item.userName : ''
					self.district.forEach( function(item1, index1) {
						if (item.areaCode == item1.areaCode) {
							self.editAddressData.street = item1.name
							self.editAddressData.detail_address = item.address.split(item1.name)[1]
						}
					});
				}
			})
		},
		deleteAddress(addressId, isCurrent) {
			let self = this
			self.$MessageBox.confirm('确定要删除改地址吗?').then(action => {
				if (isCurrent) {
					self.$Toast('不能删除默认地址')
					return
				}else{
					self.$Indicator.open()
					agent.post('/api/u/removeAddress', {id:addressId})
					.then(res => {
						self.$Indicator.close()
						console.log(res)
						if (res == false) return
						let arr = []
						store.state.addressList.forEach( function(item, index) {
							if (item.id != addressId) {
								arr.push(item)
							}
						})
						store.commit('SAVEADDRESSLIST',arr)
						self.$Toast('删除成功')
					})
				}
			});
		},
		chooseOrderAddress(addressId){
			// console.log(addressId)
			let self = this
			if (self.type1 == 1) {
				console.log(store.state.addressList.length)
				store.state.addressList.every( function(item, index) {
					console.log(item.id)
					if (item.id == addressId ) {
						console.log(addressId)
						let orderAddress = {
							address: item.address,
							areaCode: item.areaCode,
							current: addressId==item.id ? true: false,
							id: item.id,
							userName: item.userName,
							phoneNumber: item.phoneNumber
						}
						store.commit('saveOrderAddress', orderAddress)
						self.back('/commit_order/ol')
						return false
					}
					return true
				})
			}
		},
		changeCurrentAddress(addressId) {
			let self = this
			self.$Indicator.open()
			agent.post('/api/u/currentAddress', {id:addressId})
			.then(res => {
				self.$Indicator.close()
				console.log(res)
				if (res == false) return
				store.state.addressList = self.addressList.map( item => {
					return {
						address: item.address,
						areaCode: item.areaCode,
						current: addressId==item.id ? true: false,
						id: item.id,
						userName: item.userName,
						phoneNumber: item.phoneNumber
					}
				})
			})
		},
		saveAddress() {
			let self = this
			let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
			if(!self.editAddressData.phoneNumber){
				self.$Toast("请输入手机号码");
				return
			}else if(!reg.test(self.editAddressData.phoneNumber)){
				self.$Toast("手机号码不正确");
				return
			}
			if (self.type == 'new') {
				let s = {
					'address': self.place + self.editAddressData.street + self.editAddressData.detail_address,
					'areaCode': self.editAddressData.areaCode+'',
					'userName': self.editAddressData.userName,
					'phoneNumber': self.editAddressData.phoneNumber
				}
				self.$Indicator.open()
				agent.post('/api/u/setAddress', s)
				.then(res => {
					self.$Indicator.close()
					console.log(res)
					if (res == false) return
					self.addressList = res.addressList
					store.commit('SAVEADDRESSLIST',res.addressList)
					self.popupVisible = false
				})
			}else if (self.type == 'edit') {
				let s = {
					'address': self.place + self.editAddressData.street+self.editAddressData.detail_address,
					'areaCode': self.editAddressData.areaCode+'',
					'id': self.editAddressData.id,
					'userName': self.editAddressData.userName,
					'phoneNumber': self.editAddressData.phoneNumber
				}
				self.$Indicator.open()
				agent.post('/api/u/editAddress', s)
				.then(res => {
					self.$Indicator.close()
					console.log(res)
					if (res == false) return
					self.addressList = res.addressList
					store.commit('SAVEADDRESSLIST',res.addressList)
					self.popupVisible = false
					self.$Toast('修改成功')

				})
			}
			
		},
		onValuesChange(picker, values) {
			let index = this.slots[0].values.indexOf(values[0])
			this.editAddressData.areaCode = this.areaCodeList[index]
			this.editAddressData.street = values[0]
		},
		closePicker() {
			this.addressPicker=false
		},
		getAreaList(district) {
			let self = this
			let areaCodeList = [], areaNameList = []
			district.forEach( function(item, index) {
				areaCodeList.push(item.areaCode)
				areaNameList.push(item.name)
			});
			this.areaCodeList = areaCodeList
			this.slots[0].values = areaNameList
		},
		getAreaCodes() {
			let self = this 
			if (!store.state.district) {
				agent.get('/api/app/areaCodes', '')
				.then(res => {
					console.log(res)
					if (res == false) return
					if (res.district) {
						store.dispatch('saveDistrict', res.district)
						self.getAreaList(res.district)
					}
				})
			}else{
				self.getAreaList(self.district)
			}
			
			
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			let self = vm
			self.type1 = to.params.type
			self.backPath = to.params.type==1
							? '/commit_order/ol'
							:'/home'
		})
	},
}
</script>

<style scoped lang="less">
.container-top{
	// height: 80%;
}
.mint-popup{
	width: 100%;
	height: 100%;
	background-color: #f7f7f7;
}
.address-picker{
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
.address-list{
	min-height: 4rem;
	.address-wrap{
		// width: 85%;
		// max-width: 250px;
	}
}
.edit-btn{
	font-size: 1.25rem;
	width: 2.4rem;
}
.delete-btn{
	font-size: 1.25rem;
}
.add-btn i{
	font-size: 3rem;
}
.checked{
	display: inline-block;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	margin-right: .5rem;
	color: #009BF7;
	font-size: 1.1rem;
}
.is-checked{
	// background-color: #009BF7;
}
.not-checked{
	background-color: #fff;
	text-indent: 99999px;
	border: 1px solid #333;
}
</style>