<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	    <el-tab-pane label="员工列表" name="first">
	  		<div v-show='deliverDetail'>
			    <el-table
			      :data="delivers"
			      style="width: 100%">
			      <el-table-column
			        prop="name"
			        label="姓名"
			        width="180">
			      </el-table-column>
			      <el-table-column
			        prop="phoneNumber"
			        label="电话">
			      </el-table-column>
				    <el-table-column label="操作">
				      <template scope="scope">
				        <el-button
				          size="small"
				          @click="handleEdit(scope.row)">编辑</el-button>
				      </template>
				    </el-table-column>		      
			    </el-table>
		    </div>
		    <div v-show='!deliverDetail'>
		    	<div @click='backToList()' style="cursor: pointer"><i class="el-icon-arrow-left"></i>返回</div>
					<el-form label-position="left" :model="newDeliver" label-width="80px" style="margin-top: 2rem;">
					  <el-form-item label="姓名">
					    <el-input v-model='editDeliver.name'></el-input>
					  </el-form-item>
					  <el-form-item label="电话号码">
					    <el-input v-model='editDeliver.phoneNumber' auto-complete="off"></el-input>
					  </el-form-item>
					  <el-form-item label="密码">
					    <el-input v-model='editDeliver.passWord'></el-input>
					  </el-form-item>				  
					</el-form>
					<!-- <el-button @click='backToList()'>返回</el-button> -->
					<el-button type='primary' @click='editDeliverInfo()'>提交</el-button>
		    </div>
	    </el-tab-pane>

	    <el-tab-pane label="新增员工" name="second">
				<el-form label-position="top" :model="newDeliver" class="demo-form-stacked">
				  <el-form-item label="姓名">
				    <el-input v-model='newDeliver.name'></el-input>
				  </el-form-item>
				  <el-form-item label="电话号码">
				    <el-input v-model='newDeliver.phoneNumber' auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="密码">
				    <el-input v-model='newDeliver.passWord'></el-input>
				  </el-form-item>				  
				</el-form>
				<el-button type='primary' @click='addDeliver()'>提交</el-button>   	
	    </el-tab-pane>

	    <el-tab-pane label="统计报表" name="third" class="delivetData" v-loading="deliverSeatching">
	    	<div class="deliverData__item">
	    		<el-input v-model="seachDeliverPhone" placeholder="输入员工电话"></el-input>
	    	</div>
	    	<div class="deliverData__item">
			 	  <el-date-picker
				    v-model="month"
				    type="month"
				    placeholder="选择月">
				  </el-date-picker>
	    	</div>
	    	<div class="deliverData__item">
	    		<el-button type="primary" @click="serachDeliverData()">确认查找</el-button>
	    	</div>
	    	<el-table
		      :data="deliverData"
		      style="width: 100%; margin-top: 20px">
		      <el-table-column
		        prop="name"
		        label="员工姓名"
		        width="180">
		      </el-table-column>
		      <el-table-column
		        prop="phoneNumber"
		        label="电话">
		      </el-table-column>
		      <el-table-column
		        prop="createdAt"
		        label="扫描时间">
		      </el-table-column>
		      <el-table-column
		        prop="tankId"
		        label="气罐编号">
		      </el-table-column>	
		      <el-table-column
		        prop="report"
		        label="报障信息">
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
export default {
	data() {
		return {
			activeTab: 'first',
			deliverDetail: true,
			seachDeliverPhone:'',
			deliverSeatching: false,
			deliverData: [],
			month: '',
			editDeliver: {
				id:'',
				name:'',
				phoneNumber: '',
				passWord: ''
			},
			newDeliver: {
				name:'',
				phoneNumber: '',
				passWord: ''
			}	
		}
	},
	computed: {
		...mapState(['delivers'])
	},
	created(){
		this.fetchDelivers()
	},
	methods: {
		handleEdit(row){
			this.deliverDetail = false
			this.editDeliver.id = row.id
			this.editDeliver.name = row.name
			this.editDeliver.phoneNumber = row.phoneNumber
		},
		serachDeliverData() {
			if(!this.seachDeliverPhone ) {
				this.$message.error('请完整填写号码')
				return
			}
			if(!this.month) {
				this.$message.error('先选择月份')
				return
			}
			agent.get('/api/r/list', {
				phone: this.seachDeliverPhone,
				date: (new Date(this.month)).getTime()
			})
			.then(res => {
				if(res.list.length && res.list.length > 0) {
					let deliverData = res.list.map(item => {
						return {
							createdAt: Moment(item.createdAt).format('YYYY-M-D H:m'),
							name: res.deliver.name,
							phoneNumber: res.deliver.phoneNumber,
							report: item.report || '',
							tankId: item.tank ? item.tank.objectId : ''
						}
					})
					this.deliverData = deliverData
				} else {
					this.$message({
						message: '该员工该月无记录',
						type: 'warning'
					})
				}
			})
		},
		editDeliverInfo(){
			agent
				.post('/api/d/edit', {
					id:	this.editDeliver.id,
					name:	this.editDeliver.name,
					passWord:	this.editDeliver.passWord,
					phoneNumber: this.editDeliver.phoneNumber
				})
				.then(data => {
					console.log(data)
					this.fetchDelivers()
					this.deliverDetail = true
					this.editDeliver.id = ''
					this.editDeliver.name = ''
					this.editDeliver.phoneNumber = ''
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
		},
		addDeliver(){
			agent
				.post('/api/d/create',{
					phoneNumber: this.newDeliver.phoneNumber,
					name: this.newDeliver.name,
					passWord: this.newDeliver.passWord
				})
				.then(data => {
					console.log(data)
					this.newDeliver.name = ''
					this.newDeliver.phoneNumber = ''
					this.newDeliver.passWord = ''
					this.$message({
						type: 'success',
						message: data.message
					})
					this.fetchDelivers()
				})
				.catch(e => {
					this.$message({
						type: 'error',
						message: e.message
					})
				})
		},
		backToList() {
			this.deliverDetail = true
		},
		...mapActions(['fetchDelivers'])
	}
}
</script>
<style lang="stylus">
@import '../assets/colors'
.tab
	width 100%
.el-tabs__active-bar
	background-color $primary
.el-tabs__item.is-active
	color $primary
.deliverData__item
	display inline-block
	width 210px
</style>