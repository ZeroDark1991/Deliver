<template>
	<div>
		<el-form label-position="top" :model="newTank" style="width: 50%;">
		  <el-form-item label="编号">
		    <el-input v-model='newTank.signId'></el-input>
		  </el-form-item>
		  <el-form-item label="生产日期">
		     <el-date-picker type="date" placeholder="选择日期" 
		     v-model="newTank.producedAt" style="width: 100%;"></el-date-picker>
		  </el-form-item>
			<el-form-item label="规格">
				<el-select v-model="newTank.standard" placeholder="请选择活动区域" style="width: 100%;">
					<el-option label="15kg" value="15kg"></el-option>
					<el-option label="20kg" value="20kg"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-button type='primary' @click='addTank()'>提交</el-button>
	</div>
</template>

<script>
import agent from '../util/agent'
import Moment from 'moment'

export default{
	data() {
		return {
			newTank: {
				signId: '',
				standard: '15kg',
				producedAt: ''
			}
		}
	},
	methods: {
		addTank() {
			agent
				.post('/api/tank/create',{
					signId: this.newTank.signId,
					standard: this.newTank.standard,
					producedAt: this.newTank.producedAt
				})
				.then(data => {
					console.log(data)
					this.newTank.signId = ''
					this.$message({
						type: 'success',
						message: data.message
					})
				})
				.catch(e => {
					this.$message({
						type: 'error',
						message: e.message
					})
				})
		}
	}
}
</script>