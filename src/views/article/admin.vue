<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
       <el-input placeholder="输入关键字" v-model="listQuery.keyword" style="width: 500px;" class="filter-item"/>
            <el-select v-model="listQuery.classify" placeholder="分类" clearable style="width: 90px" class="filter-item">
                   <el-option v-for="(item,index) in classify" :key="index" :label="item.text" :value="item.value"/>
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
      :default-sort = "{prop: 'publishtime', order: 'descending'}"
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

      <el-table-column align="center" prop="publishtime" sortable label="发布时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.publishtime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="scope">
          <a class="link-type" :href="'http://www.zjzx.xyz:8990/#/detail?id=' + scope.row.id" title="">{{ scope.row.title }}</a>
          <el-tag :type="scope.row.state | statusFilter" size="small">{{ scope.row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ authorName(scope.row) || scope.row.userName  }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权重" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.weight }}
        </template>
      </el-table-column>

      <el-table-column 
      class-name="status-col" 
      prop="classify" label="分类" width="110" align="center" 
      :filters="classify"
      :filter-method="classifyFilter">
        <template slot-scope="scope">
          <el-tag>{{ classify[scope.row.classify - 1].text }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 1 || scope.row.state === 2">{{ scope.row.state | checkStateFilter }}</el-tag>
          <el-tag v-else-if="scope.row.state === 3" type="success">{{ scope.row.state | checkStateFilter }}</el-tag>
          <el-tag v-else type="danger">{{ scope.row.state | checkStateFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="230" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$Tool.goPage({name:'ArticleEditPublish',query:{articleId:scope.row.id}})">
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
import articleService from '@/services/article'
import userService from '@/services/user'
import advertService from '@/services/advert'
import articleClassifyService from '@/services/articleClassify'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusFilter(val) {
      const statusMap = {
        1: 'info',
        2: 'warning',
        3: 'success',
        4: 'danger'
      }
      return statusMap[val]
    },
    checkStateFilter(val) {
      const statusMap = {
        1: '正在审核',
        2: '人工审核中',
        3: '审核通过',
        4: '审核不通过'
      }
      return statusMap[val]
    },
    typeFilter(val) {
      const statusMap = {
        1: '微图文',
        2: '视频',
        3: '图文',
      }
      return statusMap[val]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        type:'',
        keyword: '',
        author:'',
        classify:''
      },
      classify:[
        {},{},{},{},{},{},{}
      ],
      selectList:{
        ids:[],
        item:[]
      },

    }
  },
  beforeRouteEnter(to, from, next) {
      if (GoTruth.$store.state.user.roles === 'admi5n') {
      } else {
        GoTruth.$prompt('请输入授权码', '提示', {
          inputPattern: /8698/,
          inputErrorMessage: '授权码不正确'
        }).then(({ value }) => {
          next()
        }).catch(err => {
          next('/')
        })
      }
  },
  created() {
    // console.log(1)
    // this.getList()
    articleClassifyService.getArticleClassifyList().then(res => {
      // console.log(res.data)
      let temp = res.data.result.classfyList
      for (var i = 0; i < temp.length; i++ ) {
        // this.classify[i].text = temp[i].classifyname
        // this.classify[i].value = temp[i].classifycode
        let index = temp[i].classifycode - 1
        this.$set(this.classify[index], 'text', temp[index].classifyname)
        this.$set(this.classify[index], 'value', temp[index].classifycode)
      }
      // console.log(this.classify)
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      articleService.articlePage(this.listQuery).then(response => {
        this.listLoading = false
        // console.log(response.data)
        // return
        let data = response.data
        this.total = data.recordPage.totalRow
        this.list = data.recordPage.list
        // this.listQuery.page ++
      }).catch(err => {
        this.listLoading = false
        this.$message({
          message: '获取失败，请稍后重试！',
          type: 'error'
        })
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteArticle(item) {
      articleService.deleteArticleByIds([item.id]).then(res => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.list.splice(list.indexOf(item),1)
      }).catch(err => {
        this.$message({
          message: '删除失败，请稍后重试！',
          type: 'error'
        })
      })
    },
    deleteSelect() {
      articleService.deleteArticleByIds(this.selectList.ids).then(res => {
        // console.log(res)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        for (var x in this.selectList.item) {
          let index = this.list.indexOf(this.selectList.item[x])
          this.list.splice(index, 1)
        }
      }).catch(err => {
        this.$message({
          message: '删除失败，请稍后重试！',
          type: 'error'
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
    classifyFilter(value, row, column) {
      // console.log(value)
      // console.log(row)
      // console.log(column)
      const property = column['property'];
      return row[property] === value;
    },
    authorName(item) {
      if (item.author == localStorage.id) {
        return localStorage.username
      } else {
        userService.getUserById(item.author).then(res => {
          // console.log(res.data)
          let index = this.list.indexOf(item)
          this.$set(this.list[index], 'userName', res.data.result.user.username)
          })
      }
    },
    isOwner(userId) {
      return userId == localStorage.id
    }

  }

}
</script>
