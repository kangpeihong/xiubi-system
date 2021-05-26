<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <!-- <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin', 'xwEnterprise:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
          >新增</el-button
        >
      </div> -->
      <!-- 导出 -->
      <!-- <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download"
          >导出</el-button
        >
      </div> -->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      border
    >
      <el-table-column label="用户信息">
        <el-table-column prop="userName" label="用户名" min-width="30%" />
        <el-table-column prop="loginPhone" label="手机号" min-width="50%" />
        <el-table-column prop="email" label="邮箱" />
      </el-table-column>
      <el-table-column label="用户信息">
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          class-name="many"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseInfos"
              :key="index"
            >
              {{ item.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creditCode" label="信用代码" class-name="many">
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseInfos"
              :key="index"
            >
              {{ item.creditCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="registeredAddress"
          label="注册地址"
          class-name="many"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseInfos"
              :key="index"
            >
              {{ item.registerAddress }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="enterpriseCode" label="企业编号" /> -->
        <el-table-column
          prop="accountOpening"
          label="开户银行"
          class-name="many"
          min-width="60%"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseInfos"
              :key="index"
            >
              {{ item.accountOpening }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankAccount"
          label="银行账号"
          class-name="many"
          min-width="100%"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseInfos"
              :key="index"
            >
              {{ item.bankAccount }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="邮寄信息">
        <el-table-column
          prop="consignee"
          label="收货人"
          class-name="many"
          min-width="35%"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseAddresses"
              :key="index"
            >
              {{ item.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="consignee"
          label="收货电话"
          class-name="many"
          min-width="50"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseAddresses"
              :key="index"
            >
              {{ item.phone }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="phoneNumber" label="手机号" /> -->
        <el-table-column
          prop="harvestAddress"
          label="收货地址"
          class-name="many"
          min-width="120%"
        >
          <template slot-scope="scope">
            <div
              class="company-name"
              v-for="(item, index) in scope.row.enterpriseAddresses"
              :key="index"
            >
              {{ item.address }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- <el-table-column
        v-if="
          checkPermission(['admin', 'xwEnterprise:edit', 'xwEnterprise:del'])
        "
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin', 'xwEnterprise:edit']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['admin', 'xwEnterprise:del']"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.row.id].doClose()"
                >取消</el-button
              >
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            />
          </el-popover>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-table
    :data="tableDatas"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table> -->

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
import { del, downloadXwEnterprise } from '@/api/xwEnterprise'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      tableDatas: [
        {
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          id: 4,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          id: 8,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [
            {
              id: 2,
              name: '22'
            }
          ]
        },
        {
          id: 43,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  created() {
    console.log('dsdf', this.data)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = '/api/enterprise/user/info'
      this.methods = 'get'
      this.dataStructure = 'children'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id)
        .then(res => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.dleChangePage()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        })
        .catch(err => {
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
      _this.form = {
        id: data.id,
        enterpriseName: data.enterpriseName,
        creditCode: data.creditCode,
        registeredAddress: data.registeredAddress,
        enterpriseCode: data.enterpriseCode,
        telephone: data.telephone,
        accountOpening: data.accountOpening,
        bankAccount: data.bankAccount,
        invoiceInformation: data.invoiceInformation,
        consignee: data.consignee,
        phoneNumber: data.phoneNumber,
        harvestAddress: data.harvestAddress
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadXwEnterprise(this.params)
        .then(result => {
          downloadFile(result, 'XwEnterprise列表', 'xlsx')
          this.downloadLoading = false
        })
        .catch(() => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.company-name{
  height :46px;
  line-height: 46px;
  padding-left :10px;
  // text-align center
  border-top: 1px solid #dfe6ec;
  // border-bottom 1px solid #000
  &:nth-child(1){
    border :none;
  }
}

/deep/.many{
  padding :0;
  margin: 0;
>div{
  margin :0;
  padding :0;
}

}
/deep/.is-leaf{
  >div{
    padding-left :10px;
  }
}

/deep/.col-name{
  width :35px;
}
</style>
