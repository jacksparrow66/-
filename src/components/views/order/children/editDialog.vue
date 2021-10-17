<template>
  <el-dialog title="修改地址" :visible.sync="isshow" width="50%" @close='DialogClose'>
    <span slot="footer">
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="citydata"
            @change="handleChange"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input
            v-model="editForm.address2"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="isshow = false">取 消</el-button>
      <el-button type="primary" @click="isshow = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import citydata from '@/assets/js/citydata.js'
export default {
  data() {
    return {
      // 控制Dialog对话框显示和隐藏的
      isshow: false,
      //   表单绑定数据
      editForm: {
        address1: []
      },
      editFormRules: {
        address1: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      // 级联选择器的数据
      citydata:citydata,
      props:{
        expandTrigger: 'hover'
      }
    }
  },
  mounted () {
    this.$bus.$on('editAddressShow', () => {
      this.isshow = true
    })
  },
  methods:{
    // 级联选择器修改触发的事件
    handleChange () {
      
    },
    // 对话框关闭触发的函数
    DialogClose () {
      this.$refs.editFormRef.resetFields()
    }
  }
}
</script>
<style scoped>
.el-cascader{width: 100%;}
</style>
