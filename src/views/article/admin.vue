<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
       <el-input placeholder="输入关键字" v-model="listQuery.keyword" style="width: 500px;" class="filter-item"/>
      <el-select v-model="listQuery.classify" placeholder="分类" clearable style="width: 90px" class="filter-item">
        <el-option v-for="(item,index) in classify" :key="index" :label="item.text" :value="item.value"/>
      </el-select>
      <el-select v-model="listQuery.state" placeholder="审核状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(value,key) in checkList" :key="key" :label="value" :value="parseInt(key)"/>
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
          <el-tooltip class="item" effect="dark" :content="scope.row.checknoreason" placement="bottom" v-else>
            <el-tag  type="danger">{{ scope.row.state | checkStateFilter }}</el-tag>
          </el-tooltip>
          
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="230" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$Tool.goPage({name:'ArticleEditPublish',query:{articleId:scope.row.id}})">
          </el-button>
          <el-button type="success" size="mini" icon="el-icon-view" @click="showCheck(scope.row)">
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteArticle(scope.row)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <div class="mask" v-show="check.isShow" @click.self="check.isShow = false">
      <div class="cc" style="">
        <preview :article="check.article" :articleId2="check.article.id"></preview>
        <check :articleId="check.article.id" @close="check.isShow = false"></check>
      </div>
    </div>
    
  </div>
</template>

<script>
import articleService from '@/services/article'
import userService from '@/services/user'
import advertService from '@/services/advert'
import articleClassifyService from '@/services/articleClassify'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const checkList = {
  1: '正在审核',
  2: '人工审核中',
  3: '审核通过',
  4: '审核不通过'
}
export default {
  components: { 
    Pagination, 
    Preview: () => import('./components/Preview'),
    Check: () => import('./components/Check'),
  },
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
      return checkList[val]
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
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        type: '',
        keyword: '',
        author: '',
        classify: '',
        state:''
      },
      classify: [
        {},{},{},{},{},{},{}
      ],
      selectList: {
        ids:[],
        item:[]
      },
      check: {
        isShow:false,
        article:{},
      },
      checkList,
    }
  },
  beforeRouteEnter(to, from, next) {
      if (GoTruth.$store.state.user.roles === 'admin') {
        next()
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
    this.getList()
    articleClassifyService.getArticleClassifyList().then(res => {
      // console.log(res.data)
      let temp = res.data.result.classfyList
      for (var i = 0; i < temp.length; i++ ) {
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
      // console.log(this.listQuery)
      articleService.articlePage(this.listQuery).then(response => {
        this.listLoading = false
        // console.log(response.data)
        // return
        let data = response.data
        this.total = data.recordPage.totalRow
        this.list = data.recordPage.list
      }).catch(err => {
        this.listLoading = false
        this.$message.error('获取失败，请稍后重试！' + err)
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
        articleService.deleteArticleByIds([item.id]).then(res => {
          this.$message.success('删除成功！')
          this.list.splice(this.list.indexOf(item),1)
        }).catch(err => {
          this.$message.error('删除失败，请稍后重试！' + err)
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
          this.$message.error('删除失败，请稍后重试！' + err)
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
        return this.$store.state.user.name
      } else {
        userService.getUserById(item.author).then(res => {
          // console.log(res.data.result)
          let index = this.list.indexOf(item)
          try {
            this.$set(this.list[index], 'userName', res.data.result.user.username)
          } catch(err) {
            console.log(err)
          }
        })
      }
    },
    isOwner(userId) {
      return userId == localStorage.id
    },
    showCheck(article) {
      this.check.article = article
      this.check.isShow = true
    }
  }

}
</script>

<style type="text/css" scoped>
  .mask{
    z-index: 9;
  }
  .cc{
    position: relative;
    width: 60%;
    background: #fff;
  }
</style>
