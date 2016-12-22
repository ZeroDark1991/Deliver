<template>
	<div class="page">
		<mt-header fixed title="我的地址">
			<mt-button icon="back" slot="left" @click="back('/center')"></mt-button>
		</mt-header>
		<div class="container-top">
			<mt-cell class="address-list" v-if="userInfo">
				<div slot="title" class="address-wrap">
					<div class="flex-middle text-extra">
						<div style="padding-right: 1rem;">{{userInfo.username}}</div>
						<div>{{userInfo.mobilePhoneNumber}}</div>
					</div>
					<div class="flex-middle" style="margin-top: .5rem;">
						<div class="one-line">{{userInfo.address}}</div>
					</div>
				</div>
				<div class="flex-middle flex-right text-large edit-btn" @click="editAddress()">
					<i class="iconfont">&#xe63d;</i>
				</div>
			</mt-cell>
			<div class="add-btn flex-middle flex-center" v-if="!userInfo">
				<i class="unit-0 iconfont" @click="newAddress()">&#xe634;</i>
			</div>
		</div>
		
		<!-- <mt-button size="large" class="bottom-btn" @click="newAddress()"><i class="iconfont">&#xe62b;</i>新建地址</mt-button> -->
		<mt-popup v-model="popupVisible" position="right">
			<mt-header fixed title="修改地址">
				<mt-button icon="back" slot="left" @click="popupVisible = false"></mt-button>
			</mt-header>
			<div class="container-top">
				<!-- <mt-field label="昵称" placeholder="（可选）" v-model="editAddressData.name"></mt-field> -->
				<mt-cell class="invoice-cell" title="街道" is-link @click.native="addressPicker = true" :value="editAddressData.street"></mt-cell>
				<mt-field label="详细地址" placeholder="请输入详细地址" type="textarea" rows="2" v-model="editAddressData.detail_address"></mt-field>
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
			store,
			userInfo:{
				username: null,
				tel: null,
				address: null,
				areaCode: null
			},
			areaCodeList: [],
			popupVisible:false,
			addressPicker:false,
			editAddressData:{
				street:'',
				areaCode:'',
				detail_address:''
			},
			district:[],
			slots: [
				{
					flex: 1,
					values: ['白杨街道1','白杨街道2','白杨街道3','白杨街道4','白杨街道5'],
					textAlign: 'center',
					className: 'slot1'
				}
			]
		}
	},
	created() {
		store.commit('saveLogSuccessCallback',this.getUserInfo)
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
			this.popupVisible = true
			this.editAddressData.street = ''
			this.editAddressData.detail_address = ''
		},
		editAddress() {
			this.getAreaCodes()
			this.popupVisible = true
		},
		saveAddress() {
			let self = this
			let s = {
				'address': self.editAddressData.street+self.editAddressData.detail_address,
				'areaCode': self.editAddressData.areaCode+''
			}
			console.log(s)
			agent.post('/api/u/setAddress', s)
			.then(res => {
				console.log(res)
				if (res == false) return
				self.userInfo.address = self.editAddressData.street+self.editAddressData.detail_address
				self.userInfo.areaCode = self.editAddressData.areaCode+''
				store.commit('saveUserInfo',self.userInfo)
				self.go('/center')
			})
		},
		onValuesChange(picker, values) {
			let index = this.slots[0].values.indexOf(values[0])
			this.editAddressData.areaCode = this.areaCodeList[index]
			this.editAddressData.street = values[0]
		},
		closePicker() {
			this.addressPicker=false
		},
		getAreaCodes() {
			let self = this 
			agent.get('/api/app/areaCodes', '')
			.then(res => {
				console.log(res)
				if (res == false) return
				let areaCodeList = []
				self.district = res.district
				self.slots[0].values = self.district.map( item => {
					areaCodeList.push(item.areaCode)
					return item.name
				})
				self.areaCodeList =  areaCodeList
				self.district.forEach( function(item, index) {
					if (item.areaCode == self.userInfo.areaCode) {
						self.editAddressData.street = item.name
						self.editAddressData.areaCode = item.areaCode
						self.editAddressData.detail_address = 
						self.userInfo.address.split(item.name)[1]
						return
					}
				});
			})
		},
		getUserInfo() {
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
			}else {
				self.userInfo.address = store.state.userInfo.address || ''
				self.userInfo.areaCode = store.state.userInfo.areaCode || ''
				self.userInfo.username = store.state.userInfo.username || ''
				self.userInfo.tel = store.state.userInfo.mobilePhoneNumber || ''
			}
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.getUserInfo()
		})
	}
}
</script>

<style scoped lang="less">
.container-top{
	height: 80%;
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
		width: 85%;
		max-width: 250px;
	}
}
.edit-btn{
	width: 2.4rem;
	i{
		font-size: 1.5rem;
	}
}
.add-btn i{
	font-size: 3rem;
	color: red;
}
</style>