<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	   <el-tab-pane label="订单列表" name="first">
		   <el-table :data="aduitList" style="width: 100%">
		  	 <el-table-column
					prop="userName"
					label="收货人"
					width="100">
					</el-table-column>
					<el-table-column
					prop="userPhone"
					label="联系电话"
					width="150">
					</el-table-column>
					<el-table-column
						prop="deliver.name"
						label="送气工"
						width="100">
					</el-table-column>
					<el-table-column
					prop="createdAt"
					label="下单时间"
					width="180">
					</el-table-column>
					<el-table-column
					prop="address"
					label="收货地址">
					</el-table-column>
			    <el-table-column label="操作">
			      <template scope="scope">
			        <el-button
			          size="small"
			          type='primary'
			          @click="handleAduit(scope.row)">审核通过</el-button>
			      </template>
			    </el-table-column>	      
				</el-table>
	    </el-tab-pane>
			<el-tab-pane label="新增员工" name="second">
				123  	
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
		}
	},
	computed: {
		...mapState(['aduitList'])
	},
	created(){
		this.fetchAduitList()
	},
	methods: {
		handleAduit(row){
			console.log(row.objectId)
			agent
			.post('/api/order/finish', {
				id: row.objectId
			})
			.then( data => {
				console.log(data)
				this.$message({
					type: 'success',
					message: data.message
				})
				this.fetchAduitList()
			})
			.catch(e => {
				console.log(e.message)
			})
		},
		...mapActions(['fetchAduitList'])
	}
}
</script>