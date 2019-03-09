<template>
  <div class="app-container">
    <div class="filter-container">
      <!--  <el-input placeholder="输入关键字" v-model="" style="width: 200px;" class="filter-item" @keyup.enter.native=""/>
            <el-select v-model="" placeholder="rr" clearable style="width: 90px" class="filter-item">
       <el-option v-for="" :key="" :label="" :value=""/>
            </el-select>
            <el-select v-model="" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
       <el-option v-for="" :key="" :label="" :value=""/>
            </el-select>
            <el-select v-model="" style="width: 140px" class="filter-item" @change="">
       <el-option v-for="" :key="" :label="" :value=""/>
            </el-select>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="">过分的</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="">投入太多</el-button>
            <el-button v-waves :loading="" class="filter-item" type="primary" icon="el-icon-download" @click="">和高房价</el-button>
            <el-checkbox v-model="" class="filter-item" style="margin-left:15px;" @change="">提供</el-checkbox> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发布时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.display_time }}</span>
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
      <el-table-column class-name="status-col" label="类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑
          </el-button>
          <el-button type="success" size="mini">下架
          </el-button>
          <el-button type="danger" size="mini">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
      
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
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
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
