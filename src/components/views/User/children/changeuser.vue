<template>
  <el-dialog
    title="修改用户数据"
    :visible.sync="isshow"
    width="50%"
    @close="changeclose"
  >
    <!-- 内容主体区域 -->
    <el-form
      ref="changeformref"
      :model="changeform"
      :rules="changeRules"
      label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input disabled v-model="changeform.username" value=""></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input clearable v-model="changeform.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input clearable v-model="changeform.mobile"></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部按钮区域 -->
    <span slot="footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
// 导入自定义的校验规则
import { checkmobile, checkemail } from '@/check.js'

export default {
  name: 'changeuser',
  data() {
    return {
      isshow: false,
      changeform: {},
      changeRules: {
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
      }
    }
  },
  methods: {
    // 这2个是取消和确定触发的方法
    Cancel() {
      this.isshow = false
    },
    // 点击确定触发的方法、
    determine() {
      // 首先校验表单是否填写正确，ispass就是校验的结果，正确就是true，有误就是false      
      this.$refs.changeformref.validate(async ispass => {
        if (!ispass) return this.$message.error('请正确填写内容')
        // 表单填写正确就去发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.changeform.id,
          {
            email: this.changeform.email,
            mobile: this.changeform.mobile
          }
        )
        // 通过判断请求结果的状态码去知道修改成功还是失败
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 因为父组件还要重新获取数据，父组件才会重新渲染，所以发送一个事件出去，让父组件去重新发送网络请求重新渲染
        this.$emit('changeuser')
        this.isshow = false
      })
    },
    // 在修改完成之后，对话框关闭触发的方法
    changeclose() {
      this.$refs.changeformref.resetFields()
    }
  },
  mounted() {
    // 使用 vue 的事件总线，去接受点击修改触发的事件
    this.$bus.$on('changeuser', async id => {
      this.isshow = true
      //获取 id 值，去发送请求
      const { data: res } = await this.$http.get('users/' + id)
      //判断网络请求是否发送成功，成功的状态码是200，
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      //因为在 template 模版中渲染的数据是 data 中的 addfrom 所以给他赋值
      this.changeform = res.data
    })
  }
}
</script>
<style scoped></style>
