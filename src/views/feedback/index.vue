<template>
  <div class="app-container">
    <!-- <div class="filter-container" style="margin-bottom: 20px;">
      <el-input placeholder="输入关键字" v-model="listQuery.keyword" style="width: 500px;" class="filter-item"/>
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" type="danger" v-show="selectList.ids.length" @click="deleteSelect">删除</el-button>
    </div> -->

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort = "{prop: 'createtime', order: 'descending'}">
      
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->

      <el-table-column align="center" prop="id" label="ID"  width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createtime" sortable label="反馈时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column label="用户" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ authorName(scope.row) || scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="230" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showReply(scope.row.id)">
          </el-button>
          <!-- <el-button type="success" size="mini" icon="el-icon-document" @click="downAd(scope.row.id)">
          </el-button> -->
          <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteArticle(scope.row)">
          </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      
    <el-dialog title="回复反馈" :visible.sync="replyShow">
      <el-form>
        <el-form-item label="内容:" label-width="50px">
          <el-input type="textarea" v-model="reply.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyShow = false">取 消</el-button>
        <el-button type="primary" @click="replyFeedback">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userService from '@/services/user'
import feedbackService from '@/services/feedback'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
      },
      selectList:{
        ids:[],
        item:[]
      },
      replyShow:false,
      reply:{
        id:undefined,
        content:''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      feedbackService.getFeedBackPage(this.listQuery).then(response => {
        this.listLoading = false
        // console.log(response.data)
        // return
        let data = response.data
        this.total = data.recordPage.totalRow
        this.list = data.recordPage.list
      }).catch(err => {
        this.listLoading = false
        this.$message.error('获取失败，请稍后重试 ' + err)
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    /*deleteArticle(item) {
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        articleService.deleteArticleByIds([item.id]).then(res => {
          this.$message.success('删除成功！')
          this.list.splice(this.list.indexOf(item),1)
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试！')
        })
      })
    },
    deleteSelect() {
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        articleService.deleteArticleByIds(this.selectList.ids).then(res => {
          // console.log(res)
          this.$message.success('删除成功！')
          for (var x in this.selectList.item) {
            let index = this.list.indexOf(this.selectList.item[x])
            this.list.splice(index, 1)
          }
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试！')
        })
      })
    },
    selectionChange(val) {
      this.selectList.ids = []
      this.selectList.item = val
      for (var x in val) {
        this.selectList.ids.push(val[x].id)
      }
    },*/
    authorName(item) {
      userService.getUserById(item.userid).then(res => {
        // console.log(res.data)
        let index = this.list.indexOf(item)
        this.$set(this.list[index], 'userName', res.data.result.user.username)
      }).catch(err => {
        console.log(err)
      })
    },
    showReply(feedbackId){
      this.reply.id = feedbackId
      this.replyShow = true
    },
    replyFeedback() {
      feedbackService.reply(this.reply).then(res =>{
        this.$message.success('回复成功！')
        this.replyShow = false
        this.reply.content = ''
      }).catch(err =>{
        this.$message.error('回复失败 ' + err)
      })
    }

  }

}
</script>
