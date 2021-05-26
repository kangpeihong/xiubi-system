<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    title="订单详情"
    width="70%"
  >
    <div style="font-weight:bold;margin-bottom:10px;font-size:16px;">
      <span>基本信息</span>
    </div>

    <div class="message-box">
      <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">
        订单编号:{{ tableData.orderNumber }}
      </div>
      <!-- <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">订单状态:{{tableData.orderState?"已发货":"未发货"}}</div> -->
      <!-- <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">订单状态:{{tableData.paymentStatus?"已付款":"未付款"}}</div> -->
      <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">
        创建日期:{{ tableData.createTime | time }}
      </div>
      <div style="width:275px;float:left;margin-top:10px;margin-bottom:10px;">
        完成日期:{{ tableData.updateTime | time }}
      </div>
      <div
        style="width:275px;float:left;margin-top:10px;margin-bottom:10px;"
        v-if="tableData.enterpriseUser"
      >
        客户名称:{{ tableData.enterpriseUser.userName }}
      </div>

      <!-- <div style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;">客户操作员:{{tableData.xwEnterprise.consignee}}</div> -->
      <div
        style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;"
      >
        描述:{{ tableData.describes }}
      </div>
      <div
        style="width:275px;float:left;margin-top:10px;margin-bottom:10px;"
        v-if="tableData.enterpriseInfo"
      >
        开户行:{{
          tableData.enterpriseInfo !== null
            ? tableData.enterpriseInfo.accountOpening
            : ''
        }}
      </div>
      <div
        style="width:275px;float:left;margin-top:10px;margin-bottom:10px;"
        v-if="tableData.enterpriseInfo"
      >
        银行卡号:{{ tableData.enterpriseInfo.bankAccount }}
      </div>
      <div
        style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;"
        v-if="tableData.enterpriseAddress"
      >
        邮寄地址:{{ tableData.enterpriseAddress.address }}
      </div>
      <div
        style="overflow: hidden;width:275px;float:left;margin-top:10px;margin-bottom:10px;"
        v-if="tableData.enterpriseAddress"
      >
        收货电话:{{ tableData.enterpriseAddress.phone }}
      </div>
    </div>

    <!-- <div style="width: 100%;height: 1px;margin-top: 100px;"></div> -->
    <div
      class="basic"
      style="font-size: 16px;font-weight:bold;overflow:hidden;margin-top:20px;margin-bottom:10px"
    >
      <span>订单内容</span>
    </div>

    <el-table
      :data="tableData.orderDetails"
      border
      show-summary
      style="width: 100%"
    >
      <el-table-column
        prop="product.productName"
        label="产品名称"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="产品单价(元)"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        prop="orderNumber"
        label="产品数量"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        prop="totalprice"
        sortable
        label="产品总价(元)"
        min-width="100px"
      ></el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="el-icon-download"
        @click="download(tableData.id)"
        >打印订单</el-button
      >
      <el-button :loading="loading" type="primary" @click="cancel"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, downloadXwOrder } from '@/api/xwOrder'
import { parseTime, downloadFile } from '@/utils/index'
import publics from '../../../utils/public'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      tableData: [],
      rules: {},
      downloadLoading: false
    }
  },
  filters:{
   time(time) {
      return publics.format(time, 'yyyy-MM-dd')
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },

    resetForm() {
      this.dialog = false
    },

    download(orderId) {
      this.downloadLoading = true
      downloadXwOrder(orderId)
        .then(result => {
          // const url = window.URL.createObjectURL(new Blob([result]))
          // const link = document.createElement('a')
          // link.style.display = 'none'
          // link.href = url
          // const fileName =
          //   parseTime(new Date()) + '-' + '订单详情' + '.' + 'pdf'
          // link.setAttribute('download', fileName)
          // document.body.appendChild(link)
          // link.click()
          // document.body.removeChild(link)
          downloadFile(result, '订单详情', 'pdf')
          this.downloadLoading = false
        })
        .catch(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">

.message-box{
  overflow: hidden;
  display: flex;
  justify-content :space-between;
  flex-wrap: wrap;

  >div{

  }

}
</style>
