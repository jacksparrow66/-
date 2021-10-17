<template>
  <el-dialog
    title="提示"
    :visible.sync="isshow"
    width="50%"
  >
    <span>你确定删除吗？请考虑清除</span>
    <span slot="footer">
      <el-button @click="isshow = false">取 消</el-button>
      <el-button type="primary" @click="isshow = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: ''
}
</script>
<style scoped></style>
