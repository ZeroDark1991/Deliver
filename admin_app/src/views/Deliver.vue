<template>
	<div>
	  <el-tabs :active-name="activeTab" class='tab'>
	    <el-tab-pane label="用户管理" name="first">
	    	用户管理
	    </el-tab-pane>
	    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
	    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
	    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
	  </el-tabs>
	</div>
</template>
<script>
export default {
	data() {
		return {
			activeTab: 'first'
		}
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