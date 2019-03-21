<template>
  <div class="createPost-container">

    <el-tag v-if="!article.id" type="danger">文章不存在或已被删除</el-tag>
    
    <el-form :model="article" :disabled="true" class="form-container" label-width="50px">

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title" label="标题:">
            	 <el-input type="text" placeholder="标题" v-model="article.title"></el-input>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>

                <el-col :span="6">
                  <el-form-item prop="author" label="用户:" class="postInfo-container-item">
                  	<el-input type="text" placeholder="用户" v-model="userName"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item prop="classify" label="分类:" class="postInfo-container-item">
                    <el-select v-model="article.classify" placeholder="分类">
                      <el-option v-for="(item,index) in classifyList" :key="index" :label="item.classifyname" :value="parseInt(item.classifycode)"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item prop="type" label="权重:" class="postInfo-container-item">
                    <el-select v-model="article.weight" placeholder="权重">
                      <el-option v-for="(item,index) in weight" :key="index" :label="item" :value="parseInt(item)"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="5">
                  <el-form-item class="postInfo-container-item">
                    <el-checkbox v-model="article.today">今日真相</el-checkbox>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label="时间:" class="postInfo-container-item">
                    <el-date-picker v-model="article.publishtime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="内容:" style="margin-bottom: 30px;" v-if="article.type !== 2">
          <!-- <Tinymce ref="editor" :height="400" v-model="article.content"/> -->
          <div class="" v-html="article.content" style="height: 300px;overflow: auto;">
          </div>
        </el-form-item>

        <el-form-item prop="ArticleFile" label="文件:" style="margin-bottom: 30px;" v-if="article.type !== 3">
          <Upload v-model="ArticleFile" type="video" />
        </el-form-item>

      </div>
    </el-form>
    
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import fileService from '@/services/file'
import articleService from '@/services/article'
import userService from '@/services/user'
import articleFileService from '@/services/articleFile'
import articleClassifyService from '@/services/articleClassify'

export default {
  components: { Upload },
  props: {
    article:{
    	type:Object,
    	default:{}
    }
  },
  data() {
    return {
      classifyList:[],
      weight:Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      ArticleFile:[],
      userName:''
    }
  },
  watch: {
    article(val) {
      articleService.getArticleById(val.id).then(res => {
        // console.log(res)
        let data = res.data.record
        if (data.type !== 3) {
          articleFileService.getFileByArticle(val.id).then(res => {
            this.ArticleFile = res.data.result.filelist
          })
        }
      })
	    userService.getUserById(val.author).then(res => {
	      // console.log(res)
	      this.userName = res.data.result.user.username
	    })
    }
  },
  created() {
    articleClassifyService.getArticleClassifyList().then(res => {
      // console.log(res.data)
      this.classifyList = res.data.result.classfyList
    })

  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
	background: #fff;
  .createPost-main-container {
    padding: 25px 45px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.form-container {
  
}
</style>
