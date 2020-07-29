<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="企业名称" >
        <el-input v-model="form.enterpriseName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="信用代码" >
        <el-input v-model="form.creditCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="注册地址" >
        <el-input v-model="form.registeredAddress" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="企业编号" >
        <el-input v-model="form.enterpriseCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="电话号" >
        <el-input v-model="form.telephone" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开户银行" >
        <el-input v-model="form.accountOpening" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="银行账号" >
        <el-input v-model="form.bankAccount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开票信息" >
        <el-input v-model="form.invoiceInformation" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收货人" >
        <el-input v-model="form.consignee" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="手机号" >
        <el-input v-model="form.phoneNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收货地址" >
        <el-input v-model="form.harvestAddress" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/xwEnterprise'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        enterpriseId: '',
        enterpriseName: '',
        creditCode: '',
        registeredAddress: '',
        enterpriseCode: '',
        telephone: '',
        accountOpening: '',
        bankAccount: '',
        invoiceInformation: '',
        consignee: '',
        phoneNumber: '',
        harvestAddress: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        enterpriseId: '',
        enterpriseName: '',
        creditCode: '',
        registeredAddress: '',
        enterpriseCode: '',
        telephone: '',
        accountOpening: '',
        bankAccount: '',
        invoiceInformation: '',
        consignee: '',
        phoneNumber: '',
        harvestAddress: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
