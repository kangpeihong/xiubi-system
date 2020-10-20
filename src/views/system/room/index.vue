<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID" />

      <el-table-column prop="roomNo" label="房间编号" />

      <el-table-column prop="roomAddress" label="监控地址" />

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin', 'room:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)" />
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
import { edit } from '@/api/xwMonitorRoom'
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

    beforeInit() {
      this.url = 'api/room'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },

    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form

      _this.form = {
        id: data.id,
        roomNo: data.roomNo,
        roomAddress: data.roomAddress,
      }
      _this.dialog = true
    },
  },
}
</script>

<style scoped></style>
