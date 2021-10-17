<template>
  <div class="">
    <!-- 面包屑导航，使用的是之前抽离的组件 -->
    <Navbar :list="['商品管理', '商品列表']"></Navbar>
    <el-card shadow="hover">
    <!-- 搜索区域，使用的是之前抽离的组件 -->
      <search :queryInfo="queryInfo" @getData='getGoodsList' @add='goodsadd'></search>
      <!-- 商品表格，已经被抽离出去了 -->
      <GoodsTable :GoodsList='GoodsList' :total='total' @deleteGoodsOver='getGoodsList'></GoodsTable>
      <!-- 分页的组件 -->
      <Pagination :total='total' :queryInfo='queryInfo' @change="getGoodsList"></Pagination>
      <!-- 点击编辑弹出的dialog对话框 -->
      <editDialog></editDialog>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
import search from '@/components/common/search.vue'
import GoodsTable from './children/GoodsTable'
import Pagination from '@/components/common/Pagination.vue'
import editDialog from './children/editDialog'
export default {
  components: {
    Navbar,
    search,
    GoodsTable,
    Pagination,
    editDialog
  },
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 15
      },
    //   商品列表
      GoodsList: [],
    //   数据总条数
      total:0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取总数据的方法
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if(res.meta.status !== 200) {return this.$message.error('获取数据失败')}
      this.GoodsList = res.data.goods
      this.total = res.data.total
    },
    // 点击添加发送出来的函数
    goodsadd () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style scoped></style>
