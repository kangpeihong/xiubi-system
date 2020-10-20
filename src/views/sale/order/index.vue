<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <!-- <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','xwOrder:add']"
          class="filter-item"
          size="mi
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>-->
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="orderNumber" label="订单编号" />
      <el-table-column prop="orderState" label="订单状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.orderState ? 'success' : 'warning'">{{ scope.row.orderState ? '已发货' : '未发货' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="paymentStatus" label="付款状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.paymentStatus ? 'success' : 'warning'">{{ scope.row.paymentStatus ? '已付款' : '未付款' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderMmount" label="订单总金额" />
      <el-table-column prop="createTime" label="订单创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="订单完成日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="describes" label="描述" />
      <el-table-column :show-overflow-tooltip="true" prop="enterpriseName" label="客户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.xwEnterprise.enterpriseName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="consignee" label="客户操作员">
        <template slot-scope="scope">
          <span>{{ scope.row.xwEnterprise.consignee }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','xwOrder:edit','xwOrder:del'])" label="操作" width="180px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="selDetail(scope.row.id)">查看</el-button>
          <el-popover v-permission="['admin','timing:del']" :ref="scope.row.id" placement="top" width="200">
            <p>确定删除该订单吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadXwOrder, selDetail } from '@/api/xwOrder'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [{ key: 'orderNumber', display_name: '订单编号' }],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/xwOrder'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) {
        this.params[type] = value
      }
      return true
    },
    subDelete(orderId) {
      this.delLoading = true
      del(orderId)
        .then((res) => {
          this.delLoading = false
          this.$refs[orderId].doClose()
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
          this.$refs[orderId].doClose()
        })
    },
    selDetail(orderId) {
      this.delLoading = true
      selDetail(orderId)
        .then((res) => {
          this.delLoading = false
          const _this = this.$refs.form
          _this.tableData = res
          _this.dialog = true
        })
        .catch((err) => {
          this.delLoading = false
          this.$refs[orderId].doClose()
        })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        orderState: data.orderState,
        createTime: data.createTime,
        updateTime: data.updateTime,
        describe: data.describe,
        userId: data.userId,
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadXwOrder(this.params)
        .then((result) => {
          downloadFile(result, 'XwOrder列表', 'xlsx')
          this.downloadLoading = false
        })
        .catch(() => {
          this.downloadLoading = false
        })
    },
  },
}
</script>

<style scoped>
</style>
