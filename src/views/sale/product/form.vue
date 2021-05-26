<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="form.productName" style="width: 370px;" />
      </el-form-item>

      <div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位名称">
              <el-select v-model="form.productUnits" placeholder="请选择单位">
                <el-option label="个" value="个" />
                <el-option label="张" value="张" />
                <el-option label="件" value="件" />
                <el-option label="本" value="本" />
                <el-option label="套" value="套" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序">
              <el-input v-model="form.sort" placeholder="请输入数字" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-form-item label="产品图片">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-change="onChage"
          :file-list="fileList"
          :headers="headers"
          :before-remove="beforeRemove"
          :on-preview="handlePreview"
          :action="xwProductfileUploadApi"
          :show-file-list="true"
          :on-remove="onRemove"
          :http-request="httpRequest"
          :limit="1"
          class="upload-demo"
          accept="image/jpeg, image/gif, image/png"
          list-type="picture"
        >
          <div class="eladmin-upload">
            <i class="el-icon-upload">添加文件</i>
          </div>

          <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且至少上传1张,大小不超过1M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品描述">
        <el-input :rows="3" v-model="form.productDesc" type="textarea" style="width: 370px;" />
      </el-form-item>

      <div v-for="(item, index) in form.productPrices" :key="index">
        <el-row>
          <el-col :span="8">
            <el-form-item label="起印章数">
              <el-input v-model="item.productNumber" placeholder="起印章数" style="width: 100px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价">
              <el-input v-model="item.price" placeholder="单价" style="width: 100px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <div v-if="index === 0">
                <el-button type="primary" icon="el-icon-plus" @click="addItem" />
              </div>
              <div v-if="index > 0">
                <el-button type="primary" icon="el-icon-delete" @click="delItem(item, index)" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { add, edit, removeImage } from '@/api/xwProduct'
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
        productId: '',
        productName: '',
        productUnits: '',
        productDesc: '',
        bigFileName: '',
        bigFilePath: '',
        sort: '',
        state: '0',
        productPrices: [
          {
            productNumber: '',
            price: '',
          },
        ],
      },
      rules: {
        productName: [
          { required: true, trigger: 'change', message: '产品名称不能为空' },
        ],
      },
    }
  },

  computed: {
    ...mapGetters(['xwProductfileUploadApi']),
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
          .post(this.xwProductfileUploadApi, formData, config)
          .then((rep) => {
            this.form.bigFilePath = rep.data
            this.form.bigFileName = this.file.name
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
    addItem() {
      this.form.productPrices.push({
        productNumber: '',
        price: '',
      })
    },

    delItem(item, index) {
      this.form.productPrices.splice(index, 1)
    },

    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        productId: '',
        productName: '',
        productUnits: '',
        productPic: '',
        productDesc: '',
        sort: '',
        state: '',
        productPrices: [
          {
            productNumber: '',
            price: '',
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
</style>
