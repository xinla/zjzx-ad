<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
       <el-input placeholder="输入关键字" v-model="listQuery.keyword" style="width: 500px;" class="filter-item"/>
            <el-select v-model="listQuery.type" placeholder="类型" clearable style="width: 90px" class="filter-item">
                   <el-option v-for="(value,key) in type" :key="key" :label="value" :value="key"/>
            </el-select>
            <!-- <el-select v-model="" :placeholder="" clearable class="filter-item" style="width: 130px">
                   <el-option v-for="" :key="" :label="" :value=""/>
            </el-select>
            <el-select v-model="" style="width: 140px" class="filter-item" @change="">
                   <el-option v-for="" :key="" :label="" :value=""/>
            </el-select> -->
            <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="">下架</el-button> -->
            <!-- <el-checkbox v-model="" class="filter-item" style="margin-left:15px;" @change="">提供</el-checkbox> -->
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
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
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
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击率" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column 
      class-name="status-col" 
      prop="type" label="类型" width="110" align="center" 
      :filters="[{text: '普通', value: 1}, {text: '内联', value: 2}, {text: '外联', value: 3}]"
      :filter-method="typeFilter">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | statusFilter">{{ type[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$Tool.goPage({name:'EditPublish',query:{articleId:scope.row.id}})">编辑
          </el-button>
          <el-button type="success" size="mini" @click="downAd(scope.row.id)">下架
          </el-button>
          <el-button type="danger" size="mini" @click="deleteAd(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      
  </div>
</template>

<script>
import advertService from '@/services/advert'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
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
        keyword: '',
        type:'',
        isShow:true,
      },
      type:Object.freeze({
        1:'普通',
        2:'内联',
        3:'外联'
      }),
      selectList:{
        ids:[],
        item:[]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      advertService.getAdvertPage(this.listQuery).then(response => {
        // console.log(response.data)
        this.listLoading = false
        this.total = response.data.recordPage.totalRow
        this.list = response.data.recordPage.list
        this.listQuery.page ++
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
    downAd(id) {

    },
    deleteAd(item) {
      advertService.deleteAdverts([item.id]).then(res => {
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
      advertService.deleteAdverts(this.selectList.ids).then(res => {
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
    typeFilter(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
}
</script>
