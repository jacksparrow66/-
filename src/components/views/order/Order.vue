<template>
  <div class="">
    <!-- 面包屑导航栏 -->
    <Navbar :list="['订单管理', '订单列表']"></Navbar>
    <!-- 卡片区域 -->
    <el-card>
      <search :isshow='false' :queryInfo="queryInfo" @getData='getOrderList'></search>
      <!-- 表格的组件，已经被抽离出去了 -->
      <OrderTable :orderDataList='orderDataList'></OrderTable>
      <!-- 分页的组价 -->
      <Pagination :queryInfo='queryInfo' :total='total' @change='getOrderList'></Pagination>
        <!-- 点击修改弹出的对话框 -->
      <editDialog></editDialog>
      <progressDialog></progressDialog>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
import search from '@/components/common/search.vue'
import OrderTable from './children/orderTable'
import Pagination from '@/components/common/Pagination.vue'
import editDialog from './children/editDialog'
import progressDialog from './children/progressDialog'
export default {
  components: {
    Navbar,
    search,
    OrderTable,
    Pagination,
    editDialog,
    progressDialog
  },
  data() {
    return {
      //   这个是传递给serch组件的信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   这个是后面分页要用到的数据
      total: 0,
      //   这个是渲染表格要用的数据
      orderDataList: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200){return this.$message.error('获取订单列表数据失败')}
      this.total = res.data.total
      this.orderDataList = res.data.goods
    }
  }
}
</script>
<style scoped></style>
