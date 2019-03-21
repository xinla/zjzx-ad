<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky class-name="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->
      </sticky>

      <div class="createPost-main-container">

        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
            标题
          </MDinput>
        </el-form-item>

        <el-form-item prop="images" label-width="50px" label="图片:" style="margin-bottom: 30px;">
          <upload v-model="images" />
        </el-form-item>

        <el-form-item label="内容:" label-width="50px" style="margin-bottom: 5px;">
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <tinymce ref="editor" :height="400" v-model="postForm.content" key="1" v-if="editorSwitch" />
          <tinymce ref="editor" :height="400" v-model="postForm.content" key="2" v-else />
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>

import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import advertService from '@/services/advert'
import kybWebsiteService from '@/services/kybWebsite'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  id: undefined, //如果有id表示更新此记录
  images: [], // 文章图片数组
}

export default {
  components: { MDinput, Sticky },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (!value) {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      articleId:undefined,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      images:[],
      rules: {
        images: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      editorSwitch:false
    }
  },
  watch: {
    articleId(val) {
      kybWebsiteService.getInformationById(val).then(res => {
        console.log(res)
        let data = res.data.record
        this.postForm = data
        this.images = data.imagepath.split(',')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
   next(vm => {
     vm.articleId = vm.$route.query.articleId
   })
  },
  created() {
  },
  methods: {
    submitForm() {
      this.postForm.images = String(this.images)
      // console.log(temp)
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          kybWebsiteService.setInformation(this.postForm).then(res => {
            console.log(res)
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm = Object.assign({}, defaultForm)
            this.editorSwitch = !this.editorSwitch
            this.images = []
          }).catch(err => {
            console.log(err)
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
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
</style>
