<template>
<aside>
	<el-menu theme="light" :default-active='active' :router="true">
    <el-menu-item index="/home"><i class="el-icon-message"></i>快捷面板</el-menu-item>
    <el-menu-item index="/deliver"><i class="el-icon-menu"></i>员工管理</el-menu-item>
    <el-menu-item index="3"><i class="el-icon-setting"></i>人工审核</el-menu-item>
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