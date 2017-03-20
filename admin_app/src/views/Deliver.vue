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
	  </el-tabs>
	</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import agent from '../util/agent'
export default {
	data() {
		return {
			activeTab: 'first',
			deliverDetail: true,
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
</style>