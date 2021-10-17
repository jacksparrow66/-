<template>
  <el-dialog
    title="分配角色"
    :visible.sync="isshow"
    width="50%"
    @close="distributeClose"
  >
    <div>
      <p>当前用户 : {{ this.user.username }}</p>
      <p>当前角色 : {{ this.user.role_name }}</p>
      <p>
        分配新角色 :
        <el-select v-model="modelData" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isshow = false">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'distributeDialog',
  data() {
    return {
      // 这个是控制对话框显示还是隐藏的布尔值
      isshow: false,
      // 这个是由事件总线$bus发送过来的值
      user: {},
      // 这个是发送网络请求获取到的值
      roleList: [],
      // select当前已经选择的id值
      modelData: ''
    }
  },
  mounted() {
    this.$bus.$on('distribute', async user => {
      this.isshow = true
      this.user = user
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.roleList = res.data
      console.log(res.data)
    })
  },
  methods: {
    // 点击确定触发的方法
    async determine() {
      // 判断select是否为空，如果是空不让他提交，只有在select不为空的时候才可以去提交
      if (!this.modelData) return this.$message.error('请选择要分配的角色')
      const { data: res } = await this.$http.put(`users/${this.user.id}/role`, {
        rid: this.modelData
      })
      if(res.meta.status !== 200 ) return this.$message.error("设置角色失败")
      this.$message.success(res.meta.msg);
      // 发送一次事件出去，告诉user父组件，数据已经修改了，需要重新去再次发送一次请求重新渲染网页
      this.$emit('distribute')
      this.isshow = false
    },
    // 点击关闭对话框触发的方法
    distributeClose() {
      // 每次关闭对话框的时候都去把modelData赋值为空，
      // 因为不重新赋值的话，下次打开其他的角色分配，会自动选择上上次选择的
      this.modelData = ''
    }
  }
}
</script>
<style scoped></style>
