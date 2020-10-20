<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="productName">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序">
              <el-input v-model="form.sort" placeholder="请输入数字" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-form-item label="员工电话">
        <el-input v-model="form.phone" placeholder="请输入数字" style="width: 370px;" />
      </el-form-item>

      <el-form-item label="职位介绍">
        <el-input :rows="3" v-model="form.jobs" type="textarea" style="width: 370px;" />
      </el-form-item>

      <el-form-item label="员工头像">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-change="onChage"
          :file-list="fileList"
          :headers="headers"
          :before-remove="beforeRemove"
          :on-preview="handlePreview"
          :action="xwEmployeesFileUploadApi"
          :show-file-list="true"
          :on-remove="onRemove"
          :http-request="httpRequest"
          :limit="1"
          class="upload-demo"
          accept="image/jpeg, image/gif, image/png"
          list-type="picture"
        >
          <div class="eladmin-upload">
            <i class="el-icon-upload">添加头像</i>
          </div>

          <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且至少上传1张,大小不超过1M</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { add, edit, removeImage } from '@/api/xwEmployees'
import { getToken } from '@/utils/auth'
import axios from 'axios'
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
      fileList: [],
      file: '',
      headers: { Authorization: 'Bearer ' + getToken() },
      index: 0,
      form: {
        id: '',
        name: '',
        phone: '',
        jobs: '',
        headName: '',
        headAddress: '',
        sort: '',
      },
      rules: {
        name: [
          { required: true, trigger: 'change', message: '员工姓名不能为空' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['xwEmployeesFileUploadApi']),
  },
  methods: {
    // 关闭窗口
    cancel() {
      this.resetForm()
      this.$refs.upload.clearFiles()
    },

    // 删除文件前
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    // 删除文件后
    onRemove(file, fileList) {
      // 删除服务当中图片
      if (file.status === 'success' && file.name != '') {
        removeImage(file.url)
      }
    },
    // 点击文件已上传的钩子
    handlePreview(file) {
    },

    onChage(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 1MB!')
        this.$refs.upload.clearFiles()
      } else this.file = file
    },

    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500,
      })
      this.loading = false
    },

    httpRequest() {},
    // 提交
    doSubmit() {
      if (this.$refs.upload.uploadFiles[0].status === 'ready') {
        let formData = new FormData()
        formData.append('file', this.file.raw)
        const config = {
          headers: {
            Authorization: 'Bearer ' + getToken(),
          },
        }
        axios
          .post(this.xwEmployeesFileUploadApi, formData, config)
          .then((rep) => {
            this.form.headAddress = rep.data
            this.form.headName = this.file.name
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          })
      } else if (this.$refs.upload.uploadFiles[0].status === 'success') {
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
      }
    },

    doAdd() {
      add(this.form)
        .then((res) => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500,
          })
          this.loading = false
          this.$parent.init()
          this.$refs.upload.clearFiles()
        })
        .catch((err) => {
          this.loading = false
        })
    },

    doEdit() {
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
          this.$refs.upload.clearFiles()
        })
        .catch((err) => {
          this.loading = false
        })
    },

    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        phone: '',
        jobs: '',
        sort: '',
      }
    },
  },
}
</script>

<style scoped>
</style>
