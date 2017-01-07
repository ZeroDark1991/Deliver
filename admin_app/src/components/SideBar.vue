<template>
<aside>
	<el-menu theme="light" :default-active='active' :router="true">
    <el-menu-item index="/home"><i class="el-icon-message"></i>快捷面板</el-menu-item>
    <el-menu-item index="/user"><i class="el-icon-edit"></i>用户管理</el-menu-item>
    <el-menu-item index="/deliver"><i class="el-icon-menu"></i>员工管理</el-menu-item>
    <el-menu-item index="/orderList"><i class="el-icon-edit"></i>订单列表</el-menu-item>
    <el-menu-item index="/aduit"><i class="el-icon-document"></i>订单审核</el-menu-item>
    <el-menu-item index="/tankList"><i class="el-icon-star-on"></i>气罐列表</el-menu-item>
    <el-menu-item index="/map"><i class="el-icon-upload"></i>气罐分布</el-menu-item>
    <!-- <el-menu-item index="/tank"><i class="el-icon-edit"></i>录入气罐</el-menu-item> -->
  </el-menu>		
</aside>	
</template>
<script>
	export default {
		data() {
			return {}
		},
		props: ['active']
	}
</script>
<style lang="stylus" scoped>
@import '../assets/colors'

.el-menu
	border-radius 0
	background-color $grey
aside
	width 200px
	position absolute
	left 0
	top 56px
	bottom 0
	background $grey
	padding 10px 0
.el-menu-item
	&.is-active
		color $primary
	&:hover
		background-color #dedede
</style>