<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="订单详情" width="70%">
    <div style="font-weight:bold;margin-bottom:10px;font-size:16px;">
      <span>基本信息</span>
    </div>
    
    <div style="width:275px;float:left;margin-top:10px;margin-left:20px;margin-bottom:10px;">订单编号:{{tableData.orderNumber}}</div>
    <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">订单状态:{{tableData.orderState?"已发货":"未发货"}}</div>
    <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">订单状态:{{tableData.paymentStatus?"已付款":"未付款"}}</div>
    <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">创建日期:{{tableData.createTime}}</div>
    <div style="width:275px;float:left;margin-top:10px;margin-left:20px;margin-bottom:10px;">完成日期:{{tableData.updateTime}}</div>
    <div style="width:275px;float:left;margin-top:10px;margin-left:20px;20px;margin-bottom:10px;">客户名称:{{tableData.xwEnterprise.enterpriseName}}

</div>

    <div style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;">客户操作员:{{tableData.xwEnterprise.consignee}}</div>
    <div style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;">描述:{{tableData.describes}}</div>
<div style="width:275px;float:left;margin-top:10px;margin-left:20px;margin-bottom:10px;">开户行:{{tableData.xwEnterprise.accountOpening}}</div>
<div style="width:275px;float:left;margin-top:10px;margin-left:20px;margin-bottom:10px;">银行卡号:{{tableData.xwEnterprise.bankAccount}}</div>
<div style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;">邮寄地址:{{tableData.address}}</div>
<div style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;">收货电话:{{tableData.contactNumber}}</div>

     <div style="width: 100%;height: 1px;margin-top: 100px;"></div>
          <div
            class="basic"
            style="font-size: 16px;font-weight:bold;overflow:hidden;margin-top:20px;margin-bottom:10px"
          >
            <span>订单内容</span>
          </div>

<el-table
    :data="tableData.orderDetails"
    stripe
    show-summary
    style="width: 100%">
    <el-table-column
      prop="product.productName"
      label="产品名称"
      min-width="100px">
    </el-table-column>
    <el-table-column
      prop="price"
      label="产品单价(元)"
     min-width="100px">
    </el-table-column>
    <el-table-column
      prop="orderNumber"
      label="产品数量"
      sortable
      min-width="100px">
    </el-table-column>
    <el-table-column
      prop="totalprice"
      label="产品总价(元)"
      sortable
     min-width="100px">
    </el-table-column>
  </el-table>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button type="text" @click="cancel">取消</el-button> -->
      <el-button :loading="loading" type="primary" @click="cancel">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/xwOrder'
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
       tableData: [],
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    
    resetForm() {
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
