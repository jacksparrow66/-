<template>
  <el-dialog title="添加角色" :visible.sync="isshow" width="50%">
    <el-form
      :model="addRolesInfo"
      :rules="rules"
      label-width="100px"
      ref="formref"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="addRolesInfo.roleName"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input
          v-model="addRolesInfo.roleDesc"
          placeholder="请输入角色描述"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isshow: false,
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.isshow = false
    },
    determine() {
      //这里是验证整个表单的验证结果，如果整个表单验证通过，ispass就是true，不然就是false
      this.$refs.formref.validate(async ispass => {
        if (!ispass) return this.$message.error('角色名称是必填项喔')
        const { data: res } = await this.$http.post('roles', this.addRolesInfo)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // 执行到这里说明添加角色成功了，需要父组件重新去获取数据，然后在重新渲染就好了
        // 所以就发出一个事件去，让父组件知道已经添加完成了
        this.$message.success(res.meta.msg)
        this.$emit('addRolesSuccess')
        this.isshow = false
      })
    }
  }
}
</script>
<style scoped></style>
