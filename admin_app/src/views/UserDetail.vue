<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="用户详情" name="first">
		  	<div @click='backToList()' class="back-btn"><i class="el-icon-arrow-left"></i>返回</div>

				<el-collapse v-model="activeNames" @change="handleChange">
					<el-collapse-item title="用户ID" name="1">
						<div v-text="userDetail.objectId"></div>
					</el-collapse-item>
					<el-collapse-item title="联系方式" name="2">
						<div v-text="userDetail.mobilePhoneNumber"></div>
					</el-collapse-item>
					<el-collapse-item title="创建时间" name="3">
						<div v-text="userDetail.createdAt"></div>
					</el-collapse-item>
					<el-collapse-item title="气罐信息" name="4">
						<div @click="go('/tankDetail',userDetail.tank.objectId)">
							气罐ID：<span style="color: #20A0FF;">{{userDetail.tank.objectId}}</span>
						</div>
					</el-collapse-item>
					<el-collapse-item title="地址列表" name="5">
						<div v-for="item in userDetail.addressList" style="margin-bottom: 1rem;">
								<div>地址ID：{{item.id}}</div>
								<div>地址：{{item.address}}</div>
								<div>是否默认：{{item.current ? '是' : '否'}}</div>
						</div>
					</el-collapse-item>
				</el-collapse>
	  	</el-tab-pane>
	  	<el-tab-pane label="历史订单" name="second">
			<el-table :data="historyOrderList" style="width: 100%" @row-click="tableGo">
		  		<el-table-column
					prop="userName"
					label="收货人"
					width="150">
					</el-table-column>
		  		<el-table-column
					prop="userPhone"
					label="联系电话"
					width="150">
					</el-table-column>
					<el-table-column
					prop="timeSlot"
					label="预约时间"
					width="150">
					</el-table-column>
					<el-table-column
					prop="address"
					label="地址">
					</el-table-column>
				</el-table>
	  	</el-tab-pane>
		</el-tabs>	
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import agent from '../util/agent'
export default{
	data() {
		return {
			activeTab: 'first',
			objectId:'',
			activeNames: ['1', '2', '3', '4', '5'],
			historyOrderList: []
		}
	},
	computed: {
		...mapState(['userDetail'])
	},
	created(){
		this.objectId = this.$route.params.objectId
		this.fetchUserDetail(this.objectId)
		this.historyOrder()
	},
	methods: {
		handleChange(){

		},
		go(path, id){
			if (id) {
				this.$router.push(path + '/' + id)
			}else{
				this.$router.push(path)
			}
		},
		tableGo(row){
			console.log(row.objectId)
			this.$router.push('/orderDetail/'+row.objectId)
		},
		historyOrder() {
			agent
			.get('/api/order/userList',{
				type: 1,
				id: this.objectId
			})
			.then(data => {
				console.log(data)
				if (data.list) {
					this.historyOrderList = data.list
				}

			})
			.catch(e => {
				console.log(e)
			})
		},
		backToList() {
			this.$router.push('/user')
		},
		...mapActions(['fetchUserDetail'])
	}
}
</script>
<style lang="stylus" scoped>
	.back-btn
		cursor pointer
		margin-bottom 1rem
</style>