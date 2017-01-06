<template>
	<div>
		<el-form label-position="top" :model="newTank" class="demo-form-stacked">
		  <el-form-item label="编号">
		    <el-input v-model='newTank.signId'></el-input>
		  </el-form-item>
		  <el-form-item label="待加信息">
		    <el-input v-model='newTank.other'></el-input>
		  </el-form-item>
		</el-form>
		<el-button type='primary' @click='addTank()'>提交</el-button>
	</div>
</template>

<script>
import agent from '../util/agent'
export default{
	data() {
		return {
			newTank: {
				signId: '',
				other: ''
			}
		}
	},
	methods: {
		addTank() {
			agent
				.post('/api/t/create',{
					signId: this.newTank.signId
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