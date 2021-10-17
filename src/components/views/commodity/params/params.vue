<template>
  <div class="">
    <!-- 这个是面包屑导航栏，被抽离出去了 -->
    <Navbar :list="['商品管理', '参数列表']"></Navbar>
    <el-card shadow="hover">
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row class="fenlei">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="CateList"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 这个是下面的静态属性和动态参数的组件，已经被抽离出去了 -->
      <tabs
        ref="tabs"
        :isdisabled="isdisabled"
        @tabsClick="tabsClick"
        @addParams="addParams"
        @editParams="editParams"
        @deleteParams="deleteParams"
        :CateId="CateId"
      ></tabs>
      <!-- 这个是添加参数，以及添加属性的对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addisshow"
        width="50%"
        @close="DialogClose"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="ruleForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addisshow = false">取 消</el-button>
          <el-button type="primary" @click="determine">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 这个是点击编辑触发的对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editisshow"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          :model="editFrom"
          :rules="rules"
          ref="editruleForm"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editFrom.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editisshow = false">取 消</el-button>
          <el-button type="primary" @click="editDetermine">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
import tabs from './children/tabs'

export default {
  components: {
    Navbar,
    tabs
  },
  data() {
    return {
      //   这个是选中的值存储的位置
      selectedCateKeys: [],
      //   这个是总数据存储的位置
      CateList: [],
      //   这个是props绑定的值
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id'
      },
      activeName: 'many',
      // 控制添加参数的dialog的显示和隐藏、
      addisshow: false,
      ruleForm: {
        attr_name: ''
      },
      rules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 控制编辑对话框的显示和隐藏
      editisshow: false,
      // 这个是编辑对话框中的表单绑定的对象
      editFrom: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 这个是获取总数据的方法,给级联选择器的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.CateList = res.data
    },
    // 这个是当级联选择器改变选择时触发的函数
    handleChange() {
      this.getParamsList()
        this.$refs.tabs.manyData = []
        this.$refs.tabs.onlyData = []
    },
    // 这个是监听tabs组件内部发生点击发出的事件
    tabsClick(activeName) {
      this.activeName = activeName
      this.getParamsList()
    },
    // 这个是获取动态参数，和静态属性的数据
    async getParamsList() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
      }

      const { data: res } = await this.$http.get(
        `categories/${this.CateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      res.data.forEach(item => {
        // 判断，如果这个值不是空，就分割，是空的就返回一个空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      if (this.activeName === 'many') {
        this.$refs.tabs.manyData = res.data
      } else {
        this.$refs.tabs.onlyData = res.data
      }
    },
    // 这个是点击添加参数触发的函数
    addParams() {
      this.addisshow = true
    },
    // 这个是点击确定之后出发的事件
    determine() {
      this.$refs.ruleForm.validate(async ispass => {
        if (!ispass) {
          return this.$message.error('请正确填写数据')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.CateId}/attributes`,
          {
            attr_name: this.ruleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addisshow = false
        this.getParamsList()
      })
    },
    // 这个是对话框关闭触发的函数
    DialogClose() {
      this.$refs.ruleForm.resetFields()
    },
    // 这个是监听点击编辑按钮出发的函数
    async editParams(attr_id) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.CateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editFrom = res.data
      this.editisshow = true
    },
    // 点击确定编辑参数按钮出发的函数
    editDetermine() {
      this.$refs.editruleForm.validate(async ispass => {
        if (!ispass) {
          return this.$message.error('请正确填写数据')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.CateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('修改成功')
        // 让表格重新获取数据，在次重新渲染
        this.getParamsList()
        // 关闭对话框
        this.editisshow = false
      })
    },
    // 这个是编辑参数的对话框关闭触发的函数、
    editDialogClose() {
      this.$refs.editruleForm.resetFields()
    },
    // 监听点击删除发出的事件
    deleteParams(attr_id) {
      // 这个是messagebox弹出框
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.CateId}/attributes/${attr_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除成功')
          this.getParamsList()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  },
  computed: {
    // 这个是判断当前属于第级标题，第三标题，button就有效，不然就无效
    isdisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 这个是判断当前选中的第三级标签的id
    CateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style scoped>
.fenlei {
  margin: 15px 0px;
}
</style>
