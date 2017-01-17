<template>
	<div class="page">
		<mt-header fixed title="我的地址">
			<mt-button icon="back" slot="left" @click="back('/commit_order','ol')"></mt-button>
			<span class="text-right" slot="right" @click="go('/myAddress')">管理</span>
		</mt-header>
		<div class="container-top">
			<mt-cell class="address-list" v-for="item in addressList" @click.native="chooseOrderAddress(item.id)">
				<div slot="title" class="address-wrap">
					<div class="flex-middle" style="margin-top: .5rem;">
						<div class="unit one-line">{{item.userName}}</div>
						<div class="unit text-right">{{item.phoneNumber}}</div>
					</div>
					<div class="flex-middle" style="margin: .75rem 0 .5rem 0;line-height: .9rem;">
						<div class="two-line">
						<div class="text-orange" style="display: inline-block" v-show="item.current">
							[<span style="font-size: .7rem">默认地址</span>]
						</div>
							{{item.address}}
						</div>
					</div>
				</div>
				
			</mt-cell>
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

		}
	},
	created() {
		store.commit('saveLogSuccessCallback', null)
		store.dispatch('getUserInfo')
	},
	computed: {
		addressList () {
			return store.state.addressList
		},
	},
  	methods:{
		go(link, param)  {
			this.$transfer.go(self, link, param)
		},
		back(link, param)  {
			this.$transfer.back(self, link, param)
		},
		chooseOrderAddress(addressId){
			let self = this
			store.state.addressList.every( function(item, index) {
				console.log(item.id)
				if (item.id == addressId ) {
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
}
</script>

<style scoped lang="less">

</style>