<template>
  <el-dialog title="修改商品内容" :visible.sync="isshow" width="50%">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="cat_name">
        <el-input v-model="ruleForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isshow = false">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      //这个是控制对话框显示还是隐藏的boolean值
      isshow: false,
      //表单绑定的数据、
      ruleForm: {
        cat_name: ''
      },
      //   这个是当前商品的id存储、
      CateId: 0,
      //表单的校验规则
      rules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    determine() {
      this.$refs.ruleForm.validate(async ispass => {
        if (!ispass) return this.$message.error('请按照规则填写商品名称')
        const { data: res } = await this.$http.put(
          `categories/${this.CateId}`,
          { cat_name: this.ruleForm.cat_name }
        )
        if (res.meta.status !== 200) return this.$message.error('编辑数据失败')
        this.$message.success(res.meta.msg)
        //告诉父组件，已经修改完成了，让父组件重新获取数据，重新渲染
        this.$emit('changeCateOver')
        this.isshow = false
      })
    }
  },
  mounted() {
    this.$bus.$on('changeCate', async CateId => {
      const { data: res } = await this.$http.get(`categories/${CateId}`)
      this.ruleForm.cat_name = res.data.cat_name
      this.CateId = CateId
      this.isshow = true
    })
  }
}
</script>
<style scoped></style>
