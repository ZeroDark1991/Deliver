<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="用户列表" name="first">
	  		<el-input v-model="keyword" placeholder="请输入手机号" class="search-btn"></el-input>
		  	<el-button type="primary" @click="search()">搜索</el-button>
		  	<el-table :data="userList" style="width: 100%" @row-click="go">
		  		<el-table-column
					prop="objectId"
					label="用户编号"
					width="300">
					</el-table-column>
					<el-table-column
					prop="mobilePhoneNumber"
					label="联系电话"
					width="300">
					</el-table-column>
					<el-table-column
					prop="createdAt"
					label="创建日期">
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
			keyword:'',
		}
	},
	computed: {
		...mapState(['userList'])
	},
	created(){
		this.fetchUserList()
	},
	methods: {
		go(row){
			console.log(row.objectId)
			this.$router.push('/userDetail/'+row.objectId)
		},
		search() {
			this.fetchUserList(this.keyword)
		},
		...mapActions(['fetchUserList'])
	}
}
</script>
<style lang="stylus" scoped>
.search-btn
	width 40%
	margin-bottom 1rem

</style>