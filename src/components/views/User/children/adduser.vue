<template>
  <el-dialog
    title="添加用户"
    :visible.sync="isshow"
    width="50%"
    @close="addformclose"
  >
    <!-- 内容主体区域 -->
    <el-form
      ref="addform"
      :model="addform"
      :rules="addRules"
      label-width="80px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input clearable v-model="addform.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          clearable
          type="password"
          v-model="addform.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="addform.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input clearable v-model="addform.mobile"></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部按钮区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 导入email，以及mobile的校验规则
import { checkmobile, checkemail } from '@/check.js'

export default {
  name: 'adduser',
  data() {
    return {
      isshow: false,
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 使用自定义的校验规则
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 使用自定义的校验规则
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      addform: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      }
    }
  },
  methods: {
    // 取消按钮触发的方法
    Cancel() {
      this.isshow = false
    },
    // 确定按钮触发的方法
    determine() {
      // 首先要校验表单是否全部符合填写规则，才可以去提交
      this.$refs.addform.validate(async ispass => {
        // 如果表单验证失败，那么，ispass就会是false，就会执行下面的代码
        if (!ispass) return this.$message.error('表单验证失败，请检查填写数据')
        // 如果执行到这里说明表单验证通过了
        // 发送添加用户数据的网络请求
        const { data: res } = await this.$http.post('users', this.addform)
        // 添加成功返回的状态码会是 201 ，如果不是 201 说明添加失败了
        if (res.meta.status != 201) return this.$message.error(res.meta.msg)
        // 执行到这里说明添加成功了
        this.$message.success(res.meta.msg)
        this.isshow = false
      })
    },
    // 关闭对话框触发的事件
    addformclose() {
      this.$refs.addform.resetFields()
    }
  }
}
</script>
<style scoped></style>
