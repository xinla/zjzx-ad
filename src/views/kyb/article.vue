<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input placeholder="输入关键字" v-model="listQuery.keyword" style="width: 500px;" class="filter-item"/>
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
      :default-sort = "{prop: 'createtime', order: 'descending'}"
      @selection-change="selectionChange">
      
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->

      <el-table-column align="center" prop="id" label="ID"  width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="createtime" sortable label="发布时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column label="用户" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ authorName(scope.row) || scope.row.userName || scope.row.creatorid }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="230" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$Tool.goPage({name:'KybArticleEditPublish',query:{articleId:scope.row.id}})">
          </el-button>
          <!-- <el-button type="success" size="mini" icon="el-icon-document" @click="downAd(scope.row.id)">
          </el-button> -->
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteArticle(scope.row)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      
  </div>
</template>

<script>
import userService from '@/services/user'
import feedbackService from '@/services/feedback'
import kybWebsiteService from '@/services/kybWebsite'
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
        keyword: ''
      },
      selectList:{
        ids: [],
        item: []
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      kybWebsiteService.getInformationPage(this.listQuery).then(response => {
        this.listLoading = false
        // console.log(response.data)
        // return
        let data = response.data
        this.total = data.recordPage.totalRow
        this.list = data.recordPage.list
      }).catch(err => {
        this.listLoading = false
        this.$message.error('获取失败，请稍后重试！')
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteArticle(item) {
      this.$confirm('确定要删除吗?', '提示', {
        type: 'warning'
      }).then(() => {
        kybWebsiteService.deleteInformation(item.id).then(res => {
          this.$message.success('删除成功！')
          this.list.splice(this.list.indexOf(item),1)
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试！')
        })
      })
    },
    /*deleteSelect() {
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
    },*/
    selectionChange(val) {
      this.selectList.ids = []
      this.selectList.item = val
      for (var x in val) {
        this.selectList.ids.push(val[x].id)
      }
    },
    authorName(item) {
      if (item.creatorid == localStorage.id) {
        return this.$store.state.user.name
      } else {
        userService.getUserById(item.creatorid).then(res => {
          // console.log(res.data)
          let index = this.list.indexOf(item)
          try{
            this.$set(this.list[index], 'userName', res.data.result.user.username)
          }catch(err) {
            console.log(err)
          }
        })
      }
    },

  }

}
</script>
