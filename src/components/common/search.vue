<template>
  <el-row :gutter="20">
    <el-col :span="9">
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        clearable
        @clear="getUserList()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getUserList()"
        ></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button v-if="isshow" type="primary" @click="add">添加用户</el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'search',
  props:{
      queryInfo:{
          type:Object,
          default:{
              return:{}
          }
      },
      isshow:{
        type:Boolean,
        default:true
      }
  },
  methods:{
      //搜索和点击清空时候触发的函数，会让input双向绑定了queryInfo的query，
      //这个又是接收的父组件的user.vue的queryInfo，此时只要先发送事件出去，
      //在父组件中去重新获取数据
      getUserList(){
          this.$emit('getData')
      },
      add(){
          this.$emit('add')
      }
  }
}
</script>
<style scoped></style>
