<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="气罐列表" name="first">
	  		<el-input v-model="keyword" placeholder="请输入nfcId" class="search-btn"></el-input>
		  	<el-button type="primary" @click="search()">搜索</el-button>
		  	<el-table :data="tankList" :row-style="{'cursor': 'pointer'}" @row-click="go">
		  		<el-table-column
					prop="signId"
					label="电子标签号"
					width="300">
					</el-table-column>
					<el-table-column
					prop="objectId"
					label="编号"
					width="300">
					</el-table-column>
		<!-- 			<el-table-column
					prop="standard"
					label="规格"
					width="200">
					</el-table-column> -->
					<el-table-column
					prop="manufactureDate"
					label="生产日期">
					</el-table-column>
		   
				</el-table>
	  	</el-tab-pane>
			<el-tab-pane label="气罐批量导入" name="second">
				<input id="excelFile" type="file"
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					name="file"
					style=""/>
				<el-button @click="submitExcel()">提交</el-button>
	  	</el-tab-pane>
			<el-tab-pane label="充装信息导入" name="third">
				<input id="fillFile" type="file"
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					name="file"
					style=""/>
				<el-button @click="submitFill()">充装信息导入</el-button>
	  	</el-tab-pane>	  	
			<el-tab-pane label="气罐录入" name="four">
				<el-form label-position="top" :model="newTank" style="width: 50%;">
				  <el-form-item label="编号">
				    <el-input v-model='newTank.signId' placeholder="选择输入编号" ></el-input>
				  </el-form-item>
				  <el-form-item label="生产日期">
						<el-date-picker
							v-model="newTank.manufactureDate"
							type="datetime"
							placeholder="选择日期时间"
							align="right"
							style="width: 100%;">
						</el-date-picker>
				  </el-form-item>
				</el-form>
				<el-button type='primary' @click='addTank()' v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
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
			fullscreenLoading: false,
			newTank: {
				signId: '',
				standard: '15kg',
				manufactureDate: ''
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
					manufactureDate: Moment(this.newTank.manufactureDate).format("YYYY-MM-DD HH:mm:ss")
				})
				.then(data => {
					console.log(data)
					this.newTank.signId = ''
					this.newTank.standard = ''
					this.newTank.manufactureDate = ''
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
		submitFill() {
			let file = document.querySelector('#fillFile').files[0]
			let reader = new FileReader()
			let name = file.name
			let self = this
			reader.onload = function(e) {
				let data = e.target.result
				let workbook = XLSX.read(data, {type: 'binary'}).Sheets
        let tarSheet = workbook[Object.keys(workbook)[0]] // sheet1

        let validateSheet = function(st) {
        	if((Object.keys(st).length-1)%4 !== 0) return false
        	let benchmark = [
        		'日期',
        		'充装枪号',
        		'芯片UID',
        		'阀体编码'
        	]
        	let result = true
        	if(tarSheet['A1'].h !== benchmark[0]) result = false
        	if(tarSheet['B1'].h !== benchmark[1]) result = false
        	if(tarSheet['C1'].h !== benchmark[2]) result = false
        	if(tarSheet['D1'].h !== benchmark[3]) result = false
        	return result
        }
				if(validateSheet(tarSheet)){
					let len = (Object.keys(tarSheet).length - 1)/4
					let result = []
					for(let i=2; i<=len; i++ ) {
						result.push({
							fillDate: tarSheet['A' + i].h,
							gunId: tarSheet['B' + i].h,
							signId: tarSheet['C' + i].h,
							bodyCode: tarSheet['D' + i].h
						})
					}
					console.log(result)
					if(result.length > 0) {	
						self.fullscreenLoading = true
						agent.post('/api/t/fill', {
							data: result
						})
						.then(res => {
							self.fullscreenLoading = false
							self.$notify({
								type: 'success',
								title: '成功',
								message: '已导入'
							})
						})
						.catch(err => {
							self.fullscreenLoading = false
							self.$notify.error({
								title: '错误',
								message: err.message
							})							
						})
					} else {
						alert('空表格或数据错误')
					}
				} else {
					self.$notify.error({
						title: '出现错误',
						message: '表格格式有错误'
					})
				}
			}
			reader.readAsBinaryString(file)			
		},
		submitExcel() {
			let file = document.querySelector('#excelFile').files[0]
			let reader = new FileReader()
			let name = file.name
			let self = this
			reader.onload = function(e) {
				let data = e.target.result
				let workbook = XLSX.read(data, {type: 'binary'}).Sheets
        let tarSheet = workbook[Object.keys(workbook)[0]] // sheet1

        let validateSheet = function(st) {
        	if((Object.keys(st).length-1)%6 !== 0) return false
        	let benchmark = [
        		'业务单位',
        		'电子标签号',
        		'气瓶品种',
        		'出厂日期',
        		'报废日期',
        		'进站时间'
        	]
        	let result = true
        	if(tarSheet['A1'].h !== benchmark[0]) result = false
        	if(tarSheet['B1'].h !== benchmark[1]) result = false
        	if(tarSheet['C1'].h !== benchmark[2]) result = false
        	if(tarSheet['D1'].h !== benchmark[3]) result = false
        	if(tarSheet['E1'].h !== benchmark[4]) result = false
        	if(tarSheet['F1'].h !== benchmark[5]) result = false

        	return result
        }
				if(validateSheet(tarSheet)){
					let len = (Object.keys(tarSheet).length - 1)/6
					let result = []
					for(let i=2; i<=len; i++ ) {
						result.push({
							company: tarSheet['A' + i].h,
							signId: tarSheet['B' + i].h,
							type: tarSheet['C' + i].h,
							manufactureDate: tarSheet['D' + i].h,
							retireDate: tarSheet['E' + i].h,
							entryDate: tarSheet['F' + i].h
						})
					}
					console.log(result)
					if(result.length > 0) {	
						self.fullscreenLoading = true
						agent.post('/api/t/importTank', {
							data: result
						})
						.then(res => {
							self.fullscreenLoading = false
							self.$notify({
								type: 'success',
								title: '成功',
								message: '已导入'
							})
						})
						.catch(err => {
							self.fullscreenLoading = false
							self.$notify.error({
								title: '错误',
								message: err.message
							})							
						})
					} else {
						alert('空表格或数据错误')
					}
				} else {
					self.$notify.error({
						title: '出现错误',
						message: '表格格式有错误'
					})
				}
			}
			reader.readAsBinaryString(file)
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