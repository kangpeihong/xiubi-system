<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="isAdd ? '新增公告信息' : '修改公告信息'"
    @open="open"
    append-to-body
    width="520px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="公告信息" v-if="isAdd">
        <el-input
          v-model="form.remark"
          style="width: 380px;"
          rows="5"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="公告信息" v-else>
        <el-input
          v-model="froms.info"
          style="width: 380px;"
          rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/dept'
import { add, edit } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import notice from '@/api/notice'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: ['isAdd'],
  data() {
    return {
      dateScopes: ['全部', '本级', '自定义'],
      loading: false,
      dialog: false,
      depts: [],
      deptIds: [],
      froms: '',
      form: {
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入权限', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    console.log('1', this.froms)
  },
  methods: {
    open() {
      this.froms = this.$store.state.froms
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      console.log('rrr', this.form.remark)
      console.log('rrr', this.isAdd)

      if (this.isAdd) {
        let data = {
          info: this.form.remark
        }

        if (data.info !== '') {
          notice.addPublicMessage(data).then(res => {
            this.dialog = false
            this.$parent.getList()
            if (res.info !== '') {
              this.$notify({
                title: '添加成功',
                type: 'success',
                duration: 2500
              })
            }
            console.log('dddaasdddddddd', res)
          })
        } else {
          this.$notify({
            title: '请输入公告信息',
            type: 'warning',
            duration: 2500
          })
        }
      } else if (!this.isAdd) {
        console.log('10', this.froms.id)
        let data = {
          id: this.froms.id,
          info: this.froms.info
        }
        if (data.info !== '') {
          notice.alterPublicMessage(data).then(res => {
            console.log('1011111', res)
            this.$parent.getList()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            this.dialog = false
          })
        } else {
          this.$parent.getList()
          this.$notify({
            title: '请输入公告信息',
            type: 'warning',
            duration: 2500
          })
        }
      }
    },
    doAdd() {
      add(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    doEdit() {
      edit(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        name: '',
        depts: [],
        remark: '',
        dataScope: '本级',
        level: 3,
        permission: ''
      }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
