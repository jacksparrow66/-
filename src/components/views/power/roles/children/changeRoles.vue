<template>
  <el-dialog title="编辑" :visible.sync="isshow" width="50%">
    <el-form
      :model="changeRoles"
      :rules="rules"
      label-width="100px"
      ref="formref"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="changeRoles.roleName"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          v-model="changeRoles.roleDesc"
          placeholder="请输入角色描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="isshow = false">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isshow: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      changeRoles: {}
    }
  },
  methods: {
    async determine() {
      const { data: res } = await this.$http.put(
        `roles/${this.changeRoles.roleId}`,
        this.changeRoles
      )
      if( res.meta.status !== 200 ) return this.$message.error('修改失败，请再次尝试')
      this.$message.success('编辑成功')
      this.$emit('changeRolesSuccess')
      this.isshow = false
    }
  },
  mounted() {
    this.$bus.$on('changeRoles', async id => {
      this.isshow = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      this.changeRoles = res.data
    })
  }
}
</script>
<style scoped></style>
