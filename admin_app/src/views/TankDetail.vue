<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	  	<el-tab-pane label="气罐详情" name="first">
		  	<div @click='backToList()' class="back-btn"><i class="el-icon-arrow-left"></i>返回</div>

				<el-collapse v-model="activeNames" @change="handleChange">
					<el-collapse-item title="气罐ID" name="1">
						<div v-text="tankDetail.objectId"></div>
					</el-collapse-item>
					<el-collapse-item title="气罐编号" name="2">
						<div v-text="tankDetail.signId"></div>
					</el-collapse-item>
					<el-collapse-item title="生产日期" name="3">
						<div v-text="tankDetail.manufactureDate"></div>
					</el-collapse-item>
					<el-collapse-item title="地图坐标" name="4">
						<div v-text="'经度：'+ tankDetail.latitude"></div>
						<div v-text="'纬度：'+ tankDetail.longitude"></div>
					</el-collapse-item>
					<el-collapse-item title="用户" name="5" v-if="tankDetail.ownerObjectId">
						<div @click="go('/userDetail',tankDetail.ownerObjectId)">
							用户ID：<span style="color: #20A0FF;">{{tankDetail.ownerObjectId}}</span>
						</div>
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
			activeNames: ['1', '2', '3', '4', '5']
		}
	},
	computed: {
		...mapState(['tankDetail'])
	},
	created(){
		this.objectId = this.$route.params.objectId
		this.fetchTankDetail(this.objectId)
		console.log('hehe' + this.objectId)
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
			this.$router.push('/tankList/')
		},
		...mapActions(['fetchTankDetail'])
	}
}
</script>
<style lang="stylus" scoped>
	.back-btn
		cursor pointer
		margin-bottom 1rem
</style>