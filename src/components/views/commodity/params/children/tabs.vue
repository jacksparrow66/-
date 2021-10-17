<template>
  <el-tabs v-model="activeName" @tab-click="tabsClick">
    <!-- 动态参数面板 -->
    <el-tab-pane label="动态参数" name="many">
      <!-- 点击添加动态参数的按钮 -->
      <el-button type="primary" :disabled="isdisabled" @click="addParams"
        >添加参数</el-button
      >
      <!-- 展示数据表格 -->
      <el-table :data="manyData" border stripe="">
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 循环渲染的tag标签 -->
            <el-tag
              closable
              v-for="(item, index) in scope.row.attr_vals"
              :key="index"
              @close='removeAttr(index,scope.row)'
              >{{ item }}</el-tag
            >
            <!-- 动态切换的 input 和 button -->
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="NO"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editParams(scope.row.attr_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteParams(scope.row.attr_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 静态属性面板 -->
    <el-tab-pane label="静态属性" name="only">
      <!-- 点击添加动态参数的按钮 -->
      <el-button type="primary" :disabled="isdisabled" @click="addParams"
        >添加属性</el-button
      >
      <!-- 展示数据表格 -->
      <el-table :data="onlyData" border stripe="">
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              closable
              v-for="(item, index) in scope.row.attr_vals"
              :key="index"
              @close='removeAttr(index,scope.row)'
              >{{ item }}</el-tag
            >
            <!-- 动态切换的 input 和 button -->
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="NO"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editParams(scope.row.attr_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteParams(scope.row.attr_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      // 这个是tabs当前处于那个的存储
      activeName: 'many',
      //   数据都是在父组件中通过 $refs 的方法直接赋值的
      //   这个是动态参数的数据存储
      manyData: [],
      //   这个是静态属性的数据存储
      onlyData: []
    }
  },
  props: {
    isdisabled: {
      type: Boolean,
      default: false
    },
    CateId:{
      type:Number
    }
  },
  methods: {
    // 切换动态参数和静态属性的点击
    tabsClick() {
      this.$emit('tabsClick', this.activeName)
    },
    // 点击添加参数触发的函数
    addParams() {
      this.$emit('addParams')
    },
    // 点击编辑触发的函数
    editParams(attr_id) {
      this.$emit('editParams', attr_id)
    },
    // 点击删除触发的函数
    deleteParams(attr_id) {
      this.$emit('deleteParams', attr_id)
    },
    // input 框失去焦点，或者按下了 enter 键触发的方法
    handleInputConfirm(row) {
      // 先判断文本框中是不是全部都是空格，如果是空格，在关闭文本框之后就吧数据清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 执行到这里，说明文本框中的值不是全部为空格，
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发送网络请求，保存这次的操作
      this.saveAttr(row)

     
    },
    // 发送网络请求
    async saveAttr (row) {
      const {data : res} = await this.$http.put(`categories/${this.CateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
       if(res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
    },
    // 点击 tag 的x，触发的close事件
    removeAttr (index,row) {
      console.log('aaaaa');
      row.attr_vals.splice(index,1)
      this.saveAttr(row)
    },
    // 点击 button 切换成 input 框的方法
    showInput (row) {
      row.inputVisible = true
      // 让点击后的文本框自动获取到焦点
      // $nextTick 的作用是当页面重新渲染的时候，才会去执行回调函数中的数据
      // 例如现在，点击切换了 inputVisible 值为 false 但是现在 input 框还没有出现，此时直接去执行获取焦点会报错，说没有找到这个input
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin-left: 5px;
}
.input-new-tag {
  width: 120px;
  margin-left: 15px;
}
.button-new-tag {
  margin-left: 15px;
}
</style>
