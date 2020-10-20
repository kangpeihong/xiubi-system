<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />

      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button v-permission="['admin', 'xwProduct:add']" class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="download">导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <!-- <el-table-column prop="id" label="产品ID" /> -->
      <el-table-column prop="headAddress" label="头像">
        <template slot-scope="{ row }">
          <el-image :src="`${row.headAddress}_resize_?w=100&h=100`" :preview-src-list="[row.headAddress]" fit="contain" lazy class="el-avatar">
            <div slot="error">
              <i class="el-icon-document"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <!-- <el-table-column label="产品单价"/> -->
      <!-- prop="productPrices"  -->
      <el-table-column prop="phone" label="电话" />

      <el-table-column prop="jobs" label="工作职位介绍" />

      <el-table-column v-if="checkPermission(['admin', 'xwEmployees:edit', 'xwEmployees:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'xwEmployees:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover v-permission="['admin', 'xwEmployees:del']" :ref="scope.row.id" placement="top" width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, sizes, prev, pager, next,jumper"
      :page-sizes="[10, 15,20, 25, 30]"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, edit } from '@/api/xwEmployees'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      delAllLoading: false,
    }
  },

  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    filterTag(value, row) {
      return row.state === value
    },

    beforeInit() {
      this.url = 'api/xwEmployees'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = 'name'
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },

    subDelete(id) {
      this.delLoading = true
      del(id)
        .then((res) => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500,
          })
        })
        .catch((err) => {
          this.delLoading = false
          this.$refs[id].doClose()
        })
    },

    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },

    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.fileList = [{ name: data.head_name, url: data.headAddress }]
      _this.form = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        jobs: data.jobs,
        sort: data.sort,
      }
      _this.dialog = true
    },
  },
}
</script>

<style scoped></style>
