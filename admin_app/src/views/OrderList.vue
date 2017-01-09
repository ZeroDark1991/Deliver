<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="订单列表" name="first">
	  		<el-input v-model="keyword" placeholder="请输入用户ID" class="search-btn"></el-input>
		  	<el-button type="primary" @click="search()">搜索</el-button>
		  	<el-table :data="orderList" :row-style="{'cursor': 'pointer'}" @row-click="go">
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
					prop="createdAt"
					label="下单时间"
					width="200">
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
import Moment from 'moment'

export default{
	data() {
		return {
			activeTab: 'first',
			keyword:''
		}
	},
	computed: {
		...mapState(['orderList'])
	},
	created(){
		this.fetchOrderList()
	},
	methods: {
		go(row){
			console.log(row.objectId)
			this.$router.push('/orderDetail/'+row.objectId)
		},
		search() {
			this.fetchTankList(this.keyword)
		},
		...mapActions(['fetchOrderList'])
	}
}
</script>
<style lang="stylus" scoped>
.search-btn
	width 40%
	margin-bottom 1rem

</style>