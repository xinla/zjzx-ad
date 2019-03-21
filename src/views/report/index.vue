<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input placeholder="输入关键字" v-model="listQuery.Keyword" style="width: 500px;" class="filter-item"/>
      <el-select v-model="listQuery.state" placeholder="未处理" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value,key) in state" :key="key" :label="value" :value="parseInt(key)"/>
      </el-select>
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button class="filter-item" type="danger" v-show="selectList.ids.length" @click="deleteSelect">删除</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="selectionChange">
      
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column align="center" prop="id" label="ID"  width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="reporttime" sortable label="反馈时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.reporttime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="对象" width="110" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看详情" placement="right">
            <el-button size="mini" @click="getReportObj(scope.row)">{{ scope.row.itemid }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="原因">
        <template slot-scope="scope">
          {{ scope.row.reportreasion }}
        </template>
      </el-table-column>

      <el-table-column label="举报者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="被举报用户" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reportUserName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | tagStateFilter">{{ scope.row.state | stateFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="230" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-success" @click="showReply(scope.row)">
          </el-button>
          <!-- <el-button type="success" size="mini" icon="el-icon-document" @click="downAd(scope.row.id)">
          </el-button> -->
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteReports(scope.row)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
    
    <!-- 被举报内容 -->
    <el-dialog title="被举报内容" :visible.sync="reportTarget.show">
      <el-form v-if="reportTarget.type === 3">
        <el-form-item label="内容:" label-width="50px">
          {{reportTarget.item.content}}
        </el-form-item>
      </el-form>
      <preview :article="reportTarget.item" v-if="reportTarget.type === 1"></preview>
    </el-dialog>
    
    <!--举报回复 -->
    <el-dialog title="回复反馈" :visible.sync="replyShow">
      <el-form>
        <el-form-item label="内容:" label-width="50px">
          <el-input type="textarea" v-model="reply.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="replyShow = false">取 消</el-button>
        <el-button type="primary" @click="replyReport">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import qaService from '@/services/qa'
import userService from '@/services/user'
import reportService from '@/services/report'
import articleService from '@/services/article'
import articleCommentService from '@/services/articleComment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Preview from '@/views/article/components/Preview'

const reportObj = {
  userName: '',
  content: '',
  publishTime: ''
}
const state = {
  0: '未处理',
  1: '已处理'
}

export default {
  components: { Pagination, Preview },
  filters:{
    stateFilter(val) {
      return state[val]
    },
    tagStateFilter(val){
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[val]
    },
    typeFilter(val) {
      const type = {
        1: '文章举报',
        2: '问答举报',  
        3: '评论举报'
      }
      return type[val]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        Keyword:'',
        state: 0
      },
      selectList:{
        ids:[],
        item:[]
      },
      replyShow:false,
      reply:{
        id:undefined,
        content:''
      },
      // 处理状态
      state,
      // 当前回复举报的对象
      currentReport:{},
      // 被举报对象详情
      reportTarget: {
        show: false,
        type: undefined,
        item: {}
      } 
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      reportService.getReportPage(this.listQuery).then(response => {
        this.listLoading = false
        // console.log(response.data)
        // return
        let data = response.data
        this.total = data.recordPage.totalRow
        this.list = data.recordPage.list
        for (let x in this.list) {
          this.authorName(this.list[x])
        }
      }).catch(err => {
        this.listLoading = false
        this.$message.error('获取失败，请稍后重试！ ' + err)
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteReports(item) {
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        reportService.deleteReports([item.id]).then(res => {
          this.$message.success('删除成功！')
          this.list.splice(this.list.indexOf(item),1)
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试 ' + err)
        })
      })
    },
    deleteSelect() {
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        reportService.deleteReports(this.selectList.ids).then(res => {
          // console.log(res)
          this.$message.success('删除成功！')
          for (var x in this.selectList.item) {
            let index = this.list.indexOf(this.selectList.item[x])
            this.list.splice(index, 1)
          }
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试 ' + err)
        })
      })
    },
    selectionChange(val) {
      this.selectList.ids = []
      this.selectList.item = val
      for (var x in val) {
        this.selectList.ids.push(val[x].id)
      }
    },
    authorName(item) {
      let index = this.list.indexOf(item)
      userService.getUserById(item.userid).then(res => {
        // console.log(res.data)
        this.$set(this.list[index], 'userName', res.data.result.user.username)
      }).catch(err => {
        console.log(err)
      })
      userService.getUserById(item.reportuserid).then(res => {
        // console.log(res.data)
        this.$set(this.list[index], 'reportUserName', res.data.result.user.username)
      }).catch(err => {
        console.log(err)
      })
    },
    showReply(item){
      this.currentReport = item
      this.reply.id = item.id
      this.replyShow = true
    },
    replyReport() {
      reportService.reportReply(this.reply).then(res =>{
        this.$message.success('回复成功！')
        this.replyShow = false
        this.reply.content = ''
        this.list[this.list.indexOf(this.currentReport)].state = 1
      }).catch(err =>{
        this.$message.error('回复失败 ' + err)
      })
    },
    getReportObj(item){
      this.reportTarget.show = true
      this.reportTarget.type = item.type
      switch(item.type){
        // 文章
        case 1:
          articleService.getArticleById(item.itemid).then(res => {
            // console.log(res.data)
            this.reportTarget.item = res.data.record
          })
        break
        // 问答
        case 2: 
          qaService.getQuestionById(item.itemid).then(res => {
            // console.log(res.data)
            this.reportTarget.item = res.data.record
          })
        break
        // 评论/回复
        case 3: 
          articleCommentService.getCommentById(item.itemid).then(res => {
            // console.log(res.data)
            this.reportTarget.item = res.data.record
          })
        break
        default:
          this.$message.error('类型出错： ' + item.type )
      }
      
    },
  }

}
</script>
