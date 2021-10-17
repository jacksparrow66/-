<template>
  <el-dialog title="修改商品信息" :visible.sync="isshow" width="50%" @close='DialogClose'>
    <el-form
      :model="editForm"
      :rules="editFormrules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="goods_name">
        <el-input  v-model="editForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input type="number" v-model="editForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input type="number" v-model="editForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input type="number" v-model="editForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍">
          <el-input type="textarea" v-model="editForm.goods_introduce"></el-input>
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
      // 控制dialog显示和隐藏
      isshow: false,
      // 存储表单的数据
      editForm: {},
      //   存储表单验证规则
      editFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
    //   存储当前商品的id值
      id:0
    }
  },
  mounted() {
    this.$bus.$on('editGoods', async id => {
      const { data: res } = await this.$http.get(`/goods/${id}`)
      this.isshow = true
      this.id = id
      this.editForm = res.data
    })
  },
  methods:{
    //   关闭对话框触发的函数
      DialogClose () {
          this.editForm = {}
      },
    //  点击确定触发的函数
      async determine () {
          const {data : res} = await this.$http.put(`goods/${this.id}`,this.editForm)
          if(res.meta.status !== 200 ) {return this.$message.error('修改商品失败')}
          this.$message.success('修改商品信息成功')
          this.isshow = false
      }
  }
}
</script>
<style scoped></style>
