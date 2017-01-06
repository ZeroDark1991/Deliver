<template>
	<div>
		<el-table
      :data="aduits"
      style="width: 100%">
      <el-table-column
        prop="user"
        label="用户姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deliver"
        label="送气工">
      </el-table-column>
	    <el-table-column label="操作">
	      <template scope="scope">
	        <el-button
	          size="small"
	          type='primary'
	          @click="handleAduit(scope.row)">审核通过</el-button>
	      </template>
	    </el-table-column>		      
    </el-table>		
	</div>
</template>

<script>
export default{
	data() {
		return {
			aduits: [
				{
					id: '123123123',
					user: '用户姓名',
					deliver: '宫水三叶'
				}
			]
		}
	},
	methods: {
		handleAduit(row){
			console.log(row)
		}
	}
}
</script>