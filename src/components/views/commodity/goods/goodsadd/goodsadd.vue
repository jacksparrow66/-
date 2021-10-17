<template>
  <div class="">
    <Navbar :list="['商品管理', '添加商品']"></Navbar>
      <el-button type="info" @click="back">返回</el-button>

    <el-card shadow="hover">
      <el-alert title="添加商品信息" show-icon center type="info"> </el-alert>
      <el-steps
        align-center
        :space="200"
        :active="active - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="active"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabsClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="CascaderProps"
                @change="handleChange"
                ref="cascaderRefs"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyDataList"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(items, indexs) in item.attr_vals"
                  :label="items"
                  :key="indexs"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyDataList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 提交按钮 -->
            <el-button type="primary" class="addBtn" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 这里是图片的预览dialog -->
      <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
        <img :src="imgPath" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
import _ from 'lodash'
export default {
  components: {
    Navbar
  },
  data() {
    return {
      a: ['1', 2, 3, 4, 5],
      active: '0',
      //   表单绑定的对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //   级联选择框选中的值存在这个数组里
        goods_cat: [],
        // 存储图片信息的数组
        pics: [],
        // 包含动态参数，以及静态属性的2中值
        attrs: []
      },
      //   表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //   级联选择器的数据。
      CateList: [],
      //   级联选择器的配置
      CascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        childeren: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数列表的获取
      manyDataList: [],
      // 静态属性列表的获取
      onlyDataList: [],
      // 上传图片发送的请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览中的图片地址
      imgPath: '',
      // dialog对话框显示还是隐藏
      dialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取级联选择框的数据的函数
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败')
      }
      this.CateList = res.data
    },
    // 每次级联选择框修改触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
      this.$refs.cascaderRefs.dropDownVisible = false
    },
    // 标签页之间的切换触发的函数
    beforeLeave(activeName, oldactiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldactiveName === '0') {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击tabs触发的函数
    async tabsClick() {
      if (this.active === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.CateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyDataList = res.data
      } else if (this.active === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.CateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.onlyDataList = res.data
      }
    },
    // 点击图片文本时候触发的函数
    handlePreview(file) {
      this.imgPath = file.response.data.url
      console.log(file)
      this.dialogVisible = true
    },
    // 点击X号触发的函数
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(
        item => item.tmp_path === filePath
      )
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功触发的事件
    handleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error('上传失败')
      }
      const picsInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picsInfo)
    },
    // 点击按钮，添加商品
    async add() {
      this.$refs.addFormRef.validate(ispass => {
        if (!ispass) {
          return this.$message.error('请填写必要的表单数据')
        }
      })
      // 执行到这里说明表单中的数据是填写正常的，可以发起请求
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // 处理动态参数
      this.manyDataList.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      this.onlyDataList.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
      const {data : res} = await this.$http.post('goods',form)
      console.log(res);
      if(res.meta.status !== 201 ){return this.$message.error(res.meta.msg)}
      this.$message.success('添加成功')
      this.$router.push('/goods')
    },
    // 点击返回，触发的函数
    back () {
       window.history.go(-1);
    }
  },
  computed: {
    CateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>
<style scoped>
.el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
img {
  width: 100%;
}
.addBtn {
  margin-top: 10px;
}
</style>
