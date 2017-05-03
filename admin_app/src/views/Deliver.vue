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

	    <el-tab-pane label="统计报表" name="third" class="delivetData" v-loading="deliverSearching">
	    	<div class="deliverData__item">
	    		<el-input v-model="searchDeliverPhone" placeholder="输入员工电话"></el-input>
	    	</div>
	    	<div class="deliverData__item">
			 	  <el-date-picker
				    v-model="startDate"
				    type="date"
				    placeholder="开始时间">
				  </el-date-picker>
	    	</div>
	    	<div class="deliverData__item">
			 	  <el-date-picker
				    v-model="endDate"
				    type="date"
				    placeholder="结束时间">
				  </el-date-picker>
				</div>
	    	<div class="deliverData__item">
	    		<el-button type="primary" @click="serachDeliverData()">确认查找</el-button>
	    	</div>
	    	<div class="filterBoard">
	    		<div :class="{ active: this.deliverDataFilter === 0 }" @click="switchFilter(0)">全部</div>
	    		<div :class="{ active: this.deliverDataFilter === 1 }" @click="switchFilter(1)">智能</div>
	    		<div :class="{ active: this.deliverDataFilter === 2 }" @click="switchFilter(2)">非智能</div>
	    	</div>
	    	<el-table
		      :data="computedDeliverData"
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
			searchDeliverPhone: '',
			deliverSearching: false,
			deliverDataFilter: 0,
			deliverData: [],
			startDate: '',
			endDate: '',
			editDeliver: {
				id: '',
				name: '',
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
		...mapState(['delivers']),
		computedDeliverData() {
			switch(this.deliverDataFilter) {
				case 0:
					return this.deliverData
				case 1:
					return this.deliverData.map(item => {
						if(item.tankId) return item
					})
				case 2:
					return this.deliverData.map(item => {
						if(!item.tankId) return item
					})
			}
		}
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
			if(!this.searchDeliverPhone ) {
				this.$message.error('请完整填写号码')
				return
			}
			if(!this.startDate) {
				this.$message.error('先选择月份')
				return
			}
			this.deliverSearching = true
			agent.get('/api/r/list', {
				phone: this.searchDeliverPhone,
				startDate: (new Date(this.startDate)).getTime(),
				endDate: (new Date(this.endDate)).getTime()
			})
			.then(res => {
				this.deliverSearching = false
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
					this.deliverDataFilter = 0
					this.deliverData = deliverData
				} else {
					this.deliverDataFilter = 0
					this.deliverData = []
					this.$message({
						message: '无记录',
						type: 'warning'
					})
				}
			})
			.catch(e => {
				this.deliverDataFilter = 0
				this.deliverData = []
				this.deliverSearching = false
			})
		},
		switchFilter(status) {
			this.deliverDataFilter = status
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
.filterBoard
	display flex
	& > div
		flex 0 0 auto
		padding 10px 30px
		background-color #eee
		border-radius 5px
		margin-right 10px
		margin-top 20px
		cursor pointer
	& .active
		background-color #20a0ff
		color #fff
</style>