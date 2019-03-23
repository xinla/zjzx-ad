<template>
  <div class="chart-container">

  	<el-form label-width="100px">
  	
  		  	<el-row class="">
  		  		
  		  		<el-col :span="12">
  		  			<el-form-item label="添加文章分类：" label-width="120px">
  				  		<el-input v-model="addClassifyName" placeholder="请输入分类名称" clearable style="width: 200px;"/>
								<el-button @click="add">添加</el-button>
  		  			</el-form-item>

	  		  		<hr>

	  		  		<el-form-item label="文章分类设置：" label-width="120px">
	  		  			<el-checkbox-group v-model="selectList">
							    <el-checkbox v-for="item in classifyList" :key="item.id" :label="item.id">
							    	<span :style="{color:item.ishide ? '#ddd' : ''}">{{item.classifyname + (item.ishide ? '（隐藏）' : '')}}</span>
								  </el-checkbox>
							  </el-checkbox-group>
								<el-button @click="showClassify">设为显示</el-button>
								<el-button @click="hideClassify">设为隐藏</el-button>
								<!-- <el-button @click="deleteClassify">删除</el-button> -->
  		  			</el-form-item>

  		  			<hr>

  		  			<el-form-item label="拖拽以对分类进行排序：" label-width="120px">
	  		  			<el-tree
								  :data="classifyList"
								  node-key="id"
								  :props="{label:'classifyname'}"
								  :allow-drop="allowDrop"
								  :highlight-current="true"
								  draggable>
								</el-tree>
								<el-button @click="sort">提交排序</el-button>
							</el-form-item>
  		  		</el-col>

						<el-col :span="1">
							<div class="line"></div>
						</el-col>

  		  		<el-col :span="11">
  		  			<el-form-item label="修改文章分类">
			  			</el-form-item>

  		  			<el-form-item label="旧的分类：">
  				  		<el-select v-model="olderClassifyId" placeholder="请选择旧的分类名">
							    <el-option
							      v-for="item in classifyList"
							      :key="item.id"
							      :label="item.classifyname"
							      :value="item.id">
							    </el-option>
							  </el-select>
  		  			</el-form-item>

  		  			<el-form-item label="新的分类名：">
  		  				<el-input v-model="newClassifyName" placeholder="请输入新的分类名" clearable style="width: 200px;"/>
			  			</el-form-item>

					  	<el-button class="submit" @click="change">修改</el-button>
  		  		</el-col>

  		  	</el-row>
  	
  	</el-form>
  </div>
</template>

<script>
import articleClassifyService from '@/services/articleClassify'

export default {
	data() {
		return {
			addClassifyName: '',
			classifyList:[{}],
			olderClassifyId:'',
			newClassifyName: '',
			selectList: []
		}
	},
	created() {
		this.getAllClassifyList()
	},
	methods: {
		getAllClassifyList() {
			articleClassifyService.getAllClassifyList().then(res => {
				this.classifyList = res.data.result.classfyList
				// console.log(this.classifyList)
			})
		},
		add() {
			for (let i in this.classifyList) {
				if (this.addClassifyName === this.classifyList[i].classifyname) {
					this.$message({
	          message: '该名称已被使用，请使用其他名称重试！',
	          type: 'error'
	        })
	        return
				}
			}
			articleClassifyService.setClassify(this.addClassifyName).then(res => {
				this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.addClassifyName = ''
        this.getAllClassifyList()
			})
		},
		change() {
			articleClassifyService.updateClassify(this.olderClassifyId, this.newClassifyName).then(res => {
				this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.olderClassifyId = ''
        this.newClassifyName = ''
        this.getAllClassifyList()
			})
		},
		showClassify() {
			articleClassifyService.showClassify(this.selectList).then(res =>{
				this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getAllClassifyList()
        this.selectList = []
			})
		},
		hideClassify() {
			articleClassifyService.hideClassify(this.selectList).then(res =>{
				this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getAllClassifyList()
        this.selectList = []
			})
		},
		deleteClassify() {
			articleClassifyService.deleteClassify(this.selectList).then(res =>{
				this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getAllClassifyList()
        this.selectList = []
			})
		},
		// 拖拽不允许插入判断
    allowDrop(draggingNode, dropNode, type) {
    	// console.log(draggingNode, dropNode, type);
  		return type !== 'inner'
    },
    sort() {
    	let sort = []
    	for(let i in this.classifyList) {
    		sort[i] = {
    			id: this.classifyList[i].id,
    			order: parseInt(i)
    		}
    	}
    	console.log(sort)
    	articleClassifyService.sortClassify(sort).then(res => {
    		this.$message({
          message: '修改成功',
          type: 'success'
        })
    	})
    }
	}
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  margin: 20px;
}
.submit{
	margin-left: 150px;
}
.line{
	height: 80vh;
	border-left: 1px dashed #ddd;
	display: inline-block;
}
hr{
	width: 96%;
}
</style>