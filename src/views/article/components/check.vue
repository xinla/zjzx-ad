<template>
	<div class="check">
		<el-form inline>
			<el-form-item>
				<el-button type="success" @click="pass">审核通过</el-button>
				<el-button type="success" @click="isNo = true">审核不通过</el-button>
			</el-form-item>
			<template v-if="isNo">
				<el-form-item>
			    <el-input type="textarea" placeholder="请填写不通过原因" v-model.trim="reason"></el-input>
			  </el-form-item>
		    <el-button type="primary" @click="check(4)">确定</el-button>
			</template>
		</el-form>
	</div>
</template>

<script>
import articleService from '@/services/article'
export default {
	props:{
		articleId:''
	},
	data() {
		return {
			isNo:false,
			reason:''
		}
	},
	methods:{
		check(state) {
			if (state === 4 && this.reason === '') {
				this.$message.error('原因不能为空');
				return;
			}
      articleService.articleCheck(this.articleId, state, this.reason).then(res => {
      	console.log(res.data)
        this.$message.success('操作成功！')
        this.close()
      })
    },
    pass() {
    	this.check(3)
    	this.isNo = false
    	this.close()
    },
    close() {
    	this.$emit("close")
    }
	}
}
</script>

<style rel="stylesheet" scoped>
	.check{
		margin-left: 20px;
		z-index: 1
	}
</style>