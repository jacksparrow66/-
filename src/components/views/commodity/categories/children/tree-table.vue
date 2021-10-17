<template>
  <tree-table
    :data="CateList"
    :columns="columns"
    :selection-type="false"
    show-index
    :expand-type="false"
    border
  >
    <!-- 这个是渲染是否有效的作用域模版 -->
    <template slot="isok" slot-scope="scope">
      <i
        v-if="!scope.row.cat_deleted"
        class="el-icon-success"
        style="color:lightgreen"
      ></i>
      <i v-else class="el-icon-error" style="color:red"></i>
    </template>
    <!-- 这个是渲染排序的作用域模版 -->
    <template slot="order" slot-scope="scope">
      <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
      <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
      <el-tag v-else type="warning">三级</el-tag>
    </template>
    <!-- 这个是渲染操作的作用域模版 -->
    <template slot="operation" slot-scope="scope">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-edit"
        @click="changeCate(scope.row.cat_id)"
        >编辑</el-button
      >
      <el-button
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="reomveCate(scope.row.cat_id)"
        >删除</el-button
      >
    </template>
  </tree-table>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        // 为第一列的值做绑定
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  props: {
    CateList: {
      type: Array,
      default: {
        return: []
      }
    }
  },
  methods: {
    // 点击编辑触发的方法
    changeCate(CateId) {
      this.$bus.$emit('changeCate', CateId)
    },
    // 点击删除触发的方法
    reomveCate(CateId) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${CateId}`)
          this.$message.success(res.meta.msg)
          // 删除完成之后要告诉父组件删除完成，然后重新发起请求重新渲染父组件
          this.$emit('removeCateOver')
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>
<style scoped></style>
