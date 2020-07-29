<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button v-permission="['admin', 'xwProduct:add']" class="filter-item" size="mini" type="primary" icon="el-icon-upload" @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button :loading="downloadLoading" size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="download">导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <!-- <el-table-column prop="id" label="产品ID" /> -->
      <el-table-column prop="productPath" label="产品图片预览">
        <template slot-scope="{ row }">
          <el-image :src="`${row.bigFilePath}_resize_?w=100&h=100`" :preview-src-list="[row.bigFileName]" fit="contain" lazy class="el-avatar">
            <div slot="error">
              <i class="el-icon-document"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" />
      <!-- <el-table-column label="产品单价"/> -->
      <!-- prop="productPrices"  -->
      <el-table-column prop="productPrices" label="单价/起印章数">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.productPrices" :key="index">
            <span>{{ item.price }}/{{ item.productNumber }}</span>
            <br />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productDesc" label="产品描述" />
      <el-table-column v-if="checkPermission(['admin', 'xwProduct:edit', 'xwProduct:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'xwProduct:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
          <el-popover v-permission="['admin', 'xwProduct:del']" :ref="scope.row.id" placement="top" width="180">
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
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadXwProduct } from '@/api/xwProduct'
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
  computed: {
    ...mapGetters(['imageUrl']),
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/xwProduct'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
          console.log(err.response.data.message)
        })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.fileList = [{ name: data.bigFileName, url: data.bigFilePath }]
      _this.form = {
        id: data.id,
        productName: data.productName,
        productUnits: data.productUnits,
        productDesc: data.productDesc,
        productPrices: data.productPrices,
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadXwProduct(this.params)
        .then((result) => {
          // downloadFile(result, 'XwProduct列表', 'xlsx')
          this.downloadLoading = false
        })
        .catch(() => {
          this.downloadLoading = false
        })
    },
  },
}
</script>

<style scoped></style>
