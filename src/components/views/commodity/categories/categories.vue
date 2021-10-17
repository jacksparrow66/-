<template>
  <div class="">
    <Navbar :list="['商品管理', '商品分类']"></Navbar>
    <el-card shadow="hover">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加商品</el-button>
        </el-col>
      </el-row>
      <treetable :CateList='CateList' @removeCateOver='GetCateList'></treetable>
      <!-- 这个是分页的组件，被抽离出去了 -->
      <pagination :queryInfo='cateInfo' @change="GetCateList" :total="total"></pagination>
      <!-- 这个是点击添加商品弹出的对话框组件，已经被抽离出去了 -->
      <addCateDialog ref="addCateDialog" @addCateOver='GetCateList'></addCateDialog>
      <!-- 这个是点击编辑弹出的对话框组件已经被抽离出去了 -->
      <changeCateDialog @changeCateOver='GetCateList'></changeCateDialog>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
import pagination from '@/components/common/Pagination.vue'
import treetable from './children/tree-table'
import addCateDialog from './children/addCateDialog.vue'
import changeCateDialog from './children/changeCateDialog'
export default {
  components: {
    Navbar,
    treetable,
    pagination,
    addCateDialog,
    changeCateDialog
  },
  data() {
    return {
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 存储网络请求火球来的数据
      CateList:[],
      // 存储数据总数量
      total:0,
      
    }
  },
  created () {
    this.GetCateList()
  },
  methods: {
    async GetCateList () {
      const {data:res} = await this.$http.get('categories',{params:this.cateInfo})
      this.total = res.data.total
      this.CateList = res.data.result
    },
    addCate () {
      this.$refs.addCateDialog.isshow = true
    }
  }
}
</script>
<style scoped>
.el-button{
  margin-bottom: 15px;
}
</style>
