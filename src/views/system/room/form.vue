<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="房间编号" prop="roomNo">
        <el-input v-model="form.roomNo" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="监控地址" prop="roomAddress">
        <el-input v-model="form.roomAddress" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { edit } from '@/api/xwMonitorRoom'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      dialog: false,

      form: {
        roomNo: '',
        roomAddress: '',
      },
    }
  },
  methods: {
    // 关闭窗口
    cancel() {
      this.resetForm()
    },

    // 提交
    doSubmit() {
      edit(this.form)
        .then((res) => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500,
          })
          this.loading = false
          this.$parent.init()
        })
        .catch((err) => {
          this.loading = false
        })
    },

    resetForm() {
      this.dialog = false
      this.form = {
        id: '',
        roomNo: '',
        roomAddress: '',
      }
    },
  },
}
</script>

<style scoped>
</style>
