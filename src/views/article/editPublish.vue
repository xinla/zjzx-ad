<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky class-name="sub-navbar">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
        <!-- <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button> -->
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>

                <!-- <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable remote placeholder="搜索用户">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="company" label-width="60px" label="公司名:" style="margin-bottom: 30px;">
                    <el-input v-model="postForm.company" autosize placeholder="请输入公司名"/>
                  </el-form-item>
                </el-col> -->

                <el-col :span="6">
                  <el-form-item prop="classify" label-width="50px" label="分类:" class="postInfo-container-item">
                    <el-select v-model="postForm.classify" placeholder="分类">
                      <el-option v-for="(item,index) in classifyList" :key="index" :label="item.classifyname" :value="parseInt(item.classifycode)"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-if="virtualUserList.length">
                  <el-form-item prop="author" label-width="80px" label="虚拟用户:" class="postInfo-container-item">
                    <el-select v-model="postForm.author" placeholder="虚拟用户">
                      <el-option v-for="(item,index) in virtualUserList" :key="index" :label="item.username" :value="parseInt(item.id)"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item prop="type" label-width="50px" label="权重:" class="postInfo-container-item">
                    <el-select v-model="postForm.weight" placeholder="权重">
                      <el-option v-for="(item,index) in weight" :key="index" :label="item" :value="parseInt(item)"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="5">
                  <el-form-item prop="type" label-width="50px" class="postInfo-container-item">
                    <el-checkbox v-model="postForm.today">今日真相</el-checkbox>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="10">
                  <el-form-item label-width="50px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"/>
                  </el-form-item>
                </el-col> -->

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item label="内容:" label-width="50px" style="margin-bottom: 5px;">
          <el-button size="medium" type="primary" plain @click="postForm.type = 3">图文</el-button>
          <el-button size="medium" type="primary" plain @click="postForm.type = 2">视频</el-button>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;" v-if="postForm.type === 3">
          <Tinymce ref="editor" :height="400" v-model="postForm.content" />
        </el-form-item>

        <!-- <el-form-item prop="content" style="margin-bottom: 30px;" v-if="postForm.type === 2">
          <div class="release-video fl" v-for="(item,index) in ArticleFile">
            <i class="iconfont icon-remove" @click.stop="handleRemoveVideo(item)"></i>
            <img :src="fileRoot + item.thumbnail" >
          </div>
          <label for="upvideo" v-show="ArticleFile.length === 0">
            <el-tag><i class="el-icon-upload"></i>上传视频</el-tag>
          </label>
          <input type="file" id="upvideo" accept="video/*" @change="uploadFile" style="display: none;">
        </el-form-item> -->

        <el-form-item prop="ArticleFile" label-width="60px" label="封面:" style="margin-bottom: 30px;" v-if="postForm.type !== 3">
          <Upload v-model="ArticleFile" type="video" />
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle } from '@/api/article'
import { validURL } from '@/utils/validate'
import fileService from '@/services/file'
import articleService from '@/services/article'
import articleFileService from '@/services/articleFile'
import virtualUserService from '@/services/virtualUser'
import articleClassifyService from '@/services/articleClassify'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  author: '',
  classify:'', // "文章分类",
  type: 3,
  today: false, // ”是否今日真相”,
  weight: 0, // ”权重”  0-10
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      articleId:undefined,
      classifyList:[],
      virtualUserList:[],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      weight:Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      rules: {
        title: [{ validator: validateRequire }],
        classify: [{ validator: validateRequire, trigger: 'blur' }],
        author: [{ validator: validateRequire, trigger: 'blur' }],
        // link: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      isImageText:true,
      ArticleFile:[],
    }
  },
  watch: {
    articleId(val) {
      articleService.getArticleById(val).then(res => {
        // console.log(res)
        let data = res.data.record
        this.postForm = data
        if (data.type !== 3) {
          articleFileService.getFileByArticle(val).then(res => {
            this.ArticleFile = res.data.result.filelist
          })
        }
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
    articleClassifyService.getArticleClassifyList().then(res => {
      // console.log(res.data)
      this.classifyList = res.data.result.classfyList
    })

    virtualUserService.getChildUserList().then(res => {
      // console.log(res)
      this.virtualUserList = res.data.list
    })

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    submitForm() {
      // console.log(this.postForm)
      this.loading = true
      if (this.virtualUserList.length === 0) {
        this.postForm.author = parseInt(localStorage.id)
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.postForm.type === 3) {
            articleService.publishArticle(this.postForm).then(res => {
              // console.log(res)
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.postForm = Object.assign({}, defaultForm)
              this.ArticleFile = []
            })
          } else {
            articleService.publishArticle(this.postForm, this.ArticleFile).then(res => {
              // console.log('---' + res)
              this.$notify({
                title: '成功',
                message: '发布文章成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              this.postForm = Object.assign({}, defaultForm)
              this.ArticleFile = []
            })
          }
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`

        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
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
