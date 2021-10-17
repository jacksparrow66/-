<template>
  <div class="">
    <!-- 面包屑导航，被抽离出去了 -->
    <Navbar :list="['用户管理','用户列表']"></Navbar>

    <!-- 卡片区域 -->
    <el-card shadow="hover">
      <!-- 搜索区域，被抽离出去了-->
      <search :queryInfo="queryInfo" @getData="getUserList()" @add="add"></search>

      <!-- 表格区域，被抽离出去了 -->
      <vuetable :user="user" @removeuser="getUserList()"></vuetable>

      <!-- 分页区域, 被抽离出去了 -->
      <Pagination
        :queryInfo="queryInfo"
        :total="total"
        @change="getUserList()"
      ></Pagination>

      <!-- 这个是弹出的对话页面框，被抽离出去了 -->
      <adduser ref="adduser" ></adduser>

      <!-- 这个是修改按钮弹出的对话框，被抽离出去了 -->
      <changeuser @changeuser="getUserList()"></changeuser>

      <!-- 这个是点击分配角色按钮弹出的对话框，被抽离出去了 -->
      <distributeDialog @distribute="getUserList()"></distributeDialog>
    </el-card>
  </div>
</template>
<script>
import vuetable from './children/vuetable.vue'
import Navbar from '@/components/common/Navbar'
import Pagination from '@/components/common/Pagination.vue'
import search from '@/components/common/search.vue'
import adduser from './children/adduser.vue'
import changeuser from './children/changeuser'
import distributeDialog from './children/distributeDialog'

export default {
  name: 'user',
  components: {
    vuetable,
    Navbar,
    Pagination,
    search,
    adduser,
    changeuser,
    distributeDialog
  },
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      user: [],
      total: 0,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 这个是获取表格数据的方法
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      this.user = res.data.users
      this.total = res.data.total
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
    },

    // 监听由搜索传递出来的事件
    add () {
      // 点击添加用户之后去修改组件adduser.vue中的数据isshow,让对话框显示出来
      this.$refs.adduser.isshow = true
    },
  }
}
</script>
<style scoped></style>
