<template>
  <div class="chart-container">

  	<!-- <el-row>
  		<el-col :span="10">
  			  	添加子用户：<el-input v-model="addChild.username" placeholder="请输入子用户名" clearable style="width: 200px;"/>
  			  	<el-button @click="addChildUser">添加</el-button>
  		  	</el-col>
  	</el-row>
  	
  	<el-row>
  		<el-col :span="18">
  			  	修改子用户：
  					<el-select v-model="olderChildId" placeholder="请选择旧的子用户名">
  				    <el-option
  				      v-for="item in virtualUserList"
  				      :key="item.id"
  				      :label="item.username"
  				      :value="item.id">
  				    </el-option>
  				  </el-select>
  			  	<el-input v-model="newChild.username" placeholder="请输入新的子用户名" clearable style="width: 200px;"/>
  			  	<el-button @click="changeChildUser">修改</el-button>
  		  	</el-col>
  	</el-row> -->


  	<el-form label-width="100px">
  	
  		  	<el-row class="">
  		  		
  		  		<el-col :span="12">
	  		  		<el-form-item label="添加子用户">
			  			</el-form-item>
  		  			<el-form-item label="用户名：">
  				  		<el-input v-model="addChild.username" placeholder="请输入用户名" clearable style="width: 200px;"/>
  		  			</el-form-item>

  		  			<el-form-item label="手机号：">
  				  		<el-input v-model="addChild.mobile" placeholder="请输入手机号" clearable style="width: 200px;"/>
  		  			</el-form-item>

  		  			<el-form-item prop="images" label="头像：" style="margin-bottom: 30px;">
			          <upload v-model="images" key="1"/>
			        </el-form-item>

							<el-button class="submit" @click="addChildUser">添加</el-button>
  		  		</el-col>
						
						<el-col :span="1">
							<div class="line"></div>
						</el-col>

  		  		<el-col :span="11">

  		  			<el-form-item label="修改子用户">
			  			</el-form-item>

  		  			<el-form-item label="旧的用户：">
  				  		<el-select v-model="olderChildId" placeholder="请选择旧的子用户">
							    <el-option
							      v-for="item in virtualUserList"
							      :key="item.id"
							      :label="item.username"
							      :value="item.id">
							    </el-option>
							  </el-select>
  		  			</el-form-item>

  		  			<el-form-item label="新的用户名：">
  		  				<el-input v-model="newChild.username" placeholder="请输入新的用户名" clearable style="width: 200px;"/>
			  			</el-form-item>

			        <el-form-item label="手机号：">
  				  		<el-input v-model="newChild.mobile" placeholder="请输入手机号" clearable style="width: 200px;"/>
  		  			</el-form-item>

			  			<el-form-item prop="images" label="新的头像：" style="margin-bottom: 30px;">
			          <upload v-model="newImages" key="2" />
			        </el-form-item>

					  	<el-button class="submit" @click="changeChildUser">修改</el-button>
  		  		</el-col>

  		  	</el-row>
  	
  	</el-form>
  </div>
</template>

<script>
import virtualUserService from '@/services/virtualUser'

const defaultChild = {
	username:'',
	mobile:'',
	imageurl:''
}

export default {
	data() {
		return {
			userId:parseInt(localStorage.id),
			addChild: Object.assign({}, defaultChild),
			delChildName:'',
			virtualUserList:[{}],
			olderChildId:'',
			newChild: Object.assign({}, defaultChild),
			images:[],
			newImages:[]
		}
	},
	created() {
		this.getChildUserList()
	},
	methods: {
		addChildUser() {
			virtualUserService.testUserName(this.addChild.username).then(res => {
				if (res.data.exist === '0') {
					this.addChild.imageurl = String(this.images)
					virtualUserService.setChildUser(this.addChild).then(res => {
						this.$message({
	            message: '添加成功',
	            type: 'success'
	          })
	          this.addChild = Object.assign({}, defaultChild)
	          this.images = []
	          this.getChildUserList()
					})
				} else {
						this.$message({
	          message: '该名称已被使用',
	          type: 'error'
	        })
				}
			})
		},
		changeChildUser() {
			this.newChild.imageurl = String(this.newImages)
			virtualUserService.updateChildUser(this.olderChildId, this.newChild).then(res => {
				this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.newChild = Object.assign({}, defaultChild)
        this.newImages = []
        this.olderChildId = ''
        this.getChildUserList()
			})
		},
		getChildUserList() {
			virtualUserService.getChildUserList().then(res => {
				this.virtualUserList = res.data.list
				// console.log(this.virtualUserList)
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
</style>