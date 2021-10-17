<template>
  <el-table :data="GoodsList" border stripe>
    <el-table-column type="index" label="NO"></el-table-column>
    <el-table-column
      class="text"
      label="商品名称"
      prop="goods_name"
    ></el-table-column>
    <el-table-column
      width="120px"
      label="商品价格（元）"
      prop="goods_price"
    ></el-table-column>
    <el-table-column
      label="商品重量"
      width="80px"
      prop="goods_weight"
    ></el-table-column>
    <el-table-column label="创建时间" width="180px" prop="add_time">
      <template slot-scope="scope">
        <!-- 这个是使用过滤器 -->
        <!-- {{ scope.row.add_time | dataFormat }} -->
        <!-- 这个是使用coderwhy的 -->
        {{showdata(scope.row.add_time)}}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200px">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" icon="el-icon-edit"
        @click='editGoods(scope.row.goods_id)'
          >编辑</el-button
        >
        <el-button type="danger" size="mini" icon="el-icon-delete"
        @click="deleteGood(scope.row.goods_id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { formatDate } from '@/assets/js/time.js'
export default {
  props: {
    GoodsList: {
      type: Array,
      default: {
        return: []
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    showdata(value) {
      // 1.将时间戳转为Date对象
      const date = new Date(value * 1000)
      // 2.将date进行格式化
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    // 删除商品的方法
    deleteGood (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data : res} = await this.$http.delete(`goods/${id}`)
           if(res.meta.status !== 200) {
             return this.$message.error('删除失败')
           }
           this.$message.success('删除成功')
          //  告诉父组件，已经删除成功了，需要重新获取数据，重新渲染
          this.$emit('deleteGoodsOver')
          console.log(res);
          this.$message.success("删除成功");
        }).catch(() => {
          this.$message.info('已取消删除')          
        });
    },
    // 点击编辑商品的方法
    editGoods (id) {
      this.$bus.$emit('editGoods',id)
    }
  }
}
</script>
<style scoped>
.el-table{
  margin-top: 15px;
}
</style>
