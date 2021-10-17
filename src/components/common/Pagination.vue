<template>
  <!-- 这里是分页的页面 -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[3, 5, 10,15]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    background
  >
  </el-pagination>
</template>
<script>
export default {
  name: '',
  props: {
    queryInfo: {
      type: Object,
      default: {
        return: {}
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },

  methods: {
    handleSizeChange(newSize) {
      // 每次切换都要重新赋值给pagesize
      this.queryInfo.pagesize = newSize
      //修改了queryInfo父组件中的这个值也会被修改，此时只需要告诉父组件中已经修改过了数据，要去再次获取数据
      this.$emit('change')
    },
    handleCurrentChange(NewPage) {
      // 每次切换 页码 都重新给data中的queryinfo.pagenum重新赋值
      this.queryInfo.pagenum = NewPage
      //修改了queryInfo父组件中的这个值也会被修改，此时只需要告诉父组件中已经修改过了数据，要去再次获取数据
      this.$emit('change')
    }
  }
}
</script>
<style scoped>
.el-pagination{
  margin-top: 10px;
}
</style>
