<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="气罐列表" name="first">
	  		<el-input v-model="keyword" placeholder="请输入nfcId" class="search-btn"></el-input>
		  	<el-button type="primary" @click="search()">搜索</el-button>
		  	<el-table :data="tankList" :row-style="{'cursor': 'pointer'}" @row-click="go">
		  		<el-table-column
					prop="signId"
					label="signId"
					width="300">
					</el-table-column>
					<el-table-column
					prop="objectId"
					label="objectId"
					width="300">
					</el-table-column>
		<!-- 			<el-table-column
					prop="standard"
					label="规格"
					width="200">
					</el-table-column> -->
					<el-table-column
					prop="producedAt"
					label="生产日期">
					</el-table-column>
		   
				</el-table>
	  	</el-tab-pane>
			<el-tab-pane label="气罐录入" name="second">
				<el-form label-position="top" :model="newTank" style="width: 50%;">
				  <el-form-item label="编号">
				    <el-input v-model='newTank.signId' placeholder="选择输入编号" ></el-input>
				  </el-form-item>
				  <el-form-item label="生产日期">
						<el-date-picker
							v-model="newTank.producedAt"
							type="datetime"
							placeholder="选择日期时间"
							align="right"
							style="width: 100%;">
						</el-date-picker>
				  </el-form-item>
				<!-- 	<el-form-item label="规格">
						<el-select v-model="newTank.standard" placeholder="请选择活动区域" style="width: 100%;">
							<el-option label="15kg" value="15kg"></el-option>
							<el-option label="20kg" value="20kg"></el-option>
						</el-select>
					</el-form-item> -->
				</el-form>
				<el-button type='primary' @click='addTank()'>提交</el-button>
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
			keyword:'',
			newTank: {
				signId: '',
				standard: '15kg',
				producedAt: ''
			}
		}
	},
	computed: {
		...mapState(['tankList'])
	},
	created(){
		this.fetchTankList()
	},
	methods: {
		go(row){
			console.log(row.objectId)
			this.$router.push('/tankDetail/'+row.objectId)
		},
		search() {
			this.fetchTankList(this.keyword)
		},
		addTank() {
			console.log(this.newTank.standard)
			agent
				.post('/api/t/create',{
					signId: this.newTank.signId,
					standard: this.newTank.standard,
					producedAt: Moment(this.newTank.producedAt).format("YYYY-MM-DD HH:mm:ss")
				})
				.then(data => {
					console.log(data)
					this.newTank.signId = ''
					this.newTank.standard = ''
					this.newTank.producedAt = ''
					this.$message({
						type: 'success',
						message: data.message
					})
					this.fetchTankList()
				})
				.catch(e => {
					this.$message({
						type: 'error',
						message: e.message
					})
				})
		},
		...mapActions(['fetchTankList'])
	}
}
</script>
<style lang="stylus" scoped>
.search-btn
	width 40%
	margin-bottom 1rem

</style>