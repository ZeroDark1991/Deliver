<template>
	<div class="page">
		<mt-header fixed title="我的地址">
			<mt-button icon="back" slot="left" @click="back('/center')"></mt-button>
		</mt-header>
		<div class="container-top">
			<mt-cell v-for="(item, index) in addressList" class="address-list" >
				<div slot="title" class="address-wrap">
					<div class="flex-middle">
						<div style="padding-right: 1rem;">{{item.name}}</div>
						<div>{{item.tel}}</div>
					</div>
					<div class="flex-middle text-small" style="margin-top: .5rem;">
						<div class="one-line">{{item.street}}{{item.detail_address}}</div>
					</div>
				</div>
				<div class="flex-middle flex-right text-large edit-btn" @click="editAddress(index)">
					<i class="iconfont">&#xe63d;</i>
				</div>
			</mt-cell>
			<div class="add-btn flex-middle flex-center" v-if="addressList.lenght==0">
				<i class="unit-0 iconfont" @click="newAddress()">&#xe634;</i>
			</div>
		</div>
		
		<!-- <mt-button size="large" class="bottom-btn" @click="newAddress()"><i class="iconfont">&#xe62b;</i>新建地址</mt-button> -->
		<mt-popup v-model="popupVisible" position="right">
			<mt-header fixed title="修改地址">
				<mt-button icon="back" slot="left" @click="popupVisible = false"></mt-button>
			</mt-header>
			<div class="container-top">
				<mt-field label="用户名" placeholder="请输入收货人姓名" v-model="editAddressData.name"></mt-field>
				<mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="editAddressData.tel"></mt-field>
				<mt-cell class="invoice-cell" title="街道" is-link @click.native="addressPicker=true" :value="editAddressData.street"></mt-cell>
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
export default {
	data () {
		return {
			addressList:[
				{name:'张三1',tel:'13511111111',street:'白杨街道1',detail_address:'皮市巷18弄'},
				{name:'张三2',tel:'13522222222',street:'白杨街道2',detail_address:'皮市巷28弄'},
				{name:'张三3',tel:'13533333333',street:'白杨街道3',detail_address:'皮市巷38弄'},
				{name:'张三4',tel:'13544444444',street:'白杨街道4',detail_address:'皮市巷48弄'},
				{name:'张三5',tel:'13555555555',street:'白杨街道5',detail_address:'皮市巷58弄'}
			],
			popupVisible:false,
			addressPicker:false,
			editAddressData:{
				name:'',
				tel:'',
				street:'',
				detail_address:''
			},
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
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link)
		},
		back(link, param)  {
			this.$transfer.back(self, link)
		},
		newAddress() {
			this.popupVisible = true
			this.editAddressData.name = ''
			this.editAddressData.tel = ''
			this.editAddressData.street = ''
			this.editAddressData.detail_address = ''
		},
		editAddress(index) {
			this.popupVisible = true
			this.editAddressData.name = this.addressList[index].name
			this.editAddressData.tel = this.addressList[index].tel
			this.editAddressData.street = this.addressList[index].street
			this.editAddressData.detail_address = this.addressList[index].detail_address
		},
		saveAddress() {
			if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(this.editAddressData.tel)){ 
				this.$Toast('请正确输入手机号')
			}else {
				this.$messagebox('提示', '测试---保存成功');
			}
		},
		onValuesChange(picker, values) {
			this.editAddressData.street = values[0]
		},
		closePicker() {
			this.addressPicker=false
		},
		getData() {
			let self = this
			agent.get('/api/u/info', '')
			.then(res => {
				console.log(res)
				if (res.success==true) {
					
				}
			})
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			vm.getData()
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
	min-height: 3rem;
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
	color: #ff6632;
}
</style>