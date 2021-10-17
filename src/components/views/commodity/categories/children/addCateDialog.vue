<template>
  <el-dialog
    title="添加商品"
    :visible.sync="isshow"
    width="50%"
    @close="Dialogclose"
  >
    <el-form ref="form" :model="addCateInfo" label-width="80px" :rules="rules">
      <el-form-item label="商品名称" prop="cat_name">
        <el-input clearable v-model="addCateInfo.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类">
        <!-- options 用来指定数据源 -->
        <!-- props 用来配置对象 -->
        <!-- filterable 是实现可以搜索的功能的 -->
        <el-cascader
          ref="cascaderHandle"
          v-model="selectedKeys"
          :options="CateList"
          clearable
          :props="cascaderProps"
          @change="handleChange"
          filterable
        ></el-cascader>
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
      //   这个是控制对话框显示还是隐藏的
      isshow: false,
      //   这个是表单绑定的数据对象
      addCateInfo: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类、
        cat_level: 0
      },
      //这个是级联选择器的数据
      CateList: [],
      //这个是集来呢选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      //级联选择器中选中的id数组
      selectedKeys: [],
      //这个是规则的数据
      rules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取级联选择器的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message, error('获取数据失败')
      this.CateList = res.data
    },
    // 选择项发生变化自动触发这个方法
    handleChange() {
      this.$refs.cascaderHandle.dropDownVisible = false
      // 每次改变都重新给表单绑定对象 addCateInfo 中的父级分类id，以及分类等级赋值
      if (this.selectedKeys.length > 0) {
        this.addCateInfo.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateInfo.cat_level = this.selectedKeys.length
      } else {
        this.addCateInfo.cat_pid = 0
        this.addCateInfo.cat_level = 0
      }
    },
    // 关闭对话框触发的方法
    Dialogclose() {
      this.$refs.form.resetFields()
      this.selectedKeys = []
      this.addCateInfo.cat_pid = 0
      this.addCateInfo.cat_level = 0
    },
    // 点击确定触发的方法
    determine() {
      this.$refs.form.validate(async ispass => {
        if (!ispass) return this.$message.error('请按照规则填写商品名称')
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateInfo
        )
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success(res.meta.msg)
        this.$emit('addCateOver')
        this.isshow = false
      })
    }
  }
}
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
</style>
