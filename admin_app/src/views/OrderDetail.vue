<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="订单详情" name="first">
		  	<div @click='backToList()' class="back-btn"><i class="el-icon-arrow-left"></i>返回</div>
				<el-collapse v-model="activeNames" @change="handleChange">
					<el-collapse-item title="订单ID" name="1">
						<div v-text="orderDetail.objectId"></div>
					</el-collapse-item>
					<el-collapse-item title="金额" name="2">
						<div v-text="orderDetail.price"></div>
					</el-collapse-item>
					<el-collapse-item title="类型" name="3">
						<div v-text="orderDetail.payment"></div>
					</el-collapse-item>
					<el-collapse-item title="下单人信息" name="4">
						<div @click="go('/userDetail',orderDetail.user.objectId)">
							用户ID：<span style="color: #20A0FF;">{{orderDetail.user.objectId}}</span>
						</div>
						<div v-text="'用户手机：'+ orderDetail.user.phoneNumber"></div>
					</el-collapse-item>
					<el-collapse-item title="类型" name="5">
						<div v-text="orderDetail.payment"></div>
					</el-collapse-item>
					<el-collapse-item title="状态" name="6">
						<div v-text="orderDetail.status"></div>
					</el-collapse-item>
					<el-collapse-item title="预约时间" name="7">
						<div v-text="orderDetail.timeSlot"></div>
					</el-collapse-item>
					<el-collapse-item title="下单时间" name="8">
						<div v-text="orderDetail.createdAt"></div>
					</el-collapse-item>
					<el-collapse-item title="取罐时间" name="9" v-if="orderDetail.receivedAt">
						<div v-text="orderDetail.receivedAt"></div>
					</el-collapse-item>
					<el-collapse-item title="完成时间" name="10" v-if="orderDetail.finishedAt">
						<div v-text="orderDetail.finishedAt"></div>
					</el-collapse-item>
				</el-collapse>
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
			objectId:'',
			activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
		}
	},
	computed: {
		...mapState(['orderDetail'])
	},
	created(){
		this.objectId = this.$route.params.objectId
		this.fetchOrderDetail(this.objectId)
	},
	methods: {
		handleChange(){

		},
		go(path, id){
			if (id) {
				this.$router.push(path + '/' + id)
			}else{
				this.$router.push(path)
			}
		},
		backToList(){
			this.$router.push('/orderList')
		},
		...mapActions(['fetchOrderDetail'])
	}
}
</script>
<style lang="stylus" scoped>
	.back-btn
		cursor pointer
		margin-bottom 1rem
</style>