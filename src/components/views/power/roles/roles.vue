<template>
  <div class=''>
    <!-- 这个是头部的面包屑导航栏 -->
    <Navbar :list="['权限管理','角色列表']"></Navbar>
    <!-- 这个是卡片区域 -->
    <el-card shadow="hover">
      <el-button type="primary" @click="addRoles">添加角色</el-button>
      <!-- 这个是权限管理表格数据，被抽离出去了 -->
      <rolestable :RolesList="RolesList" @deleteRoleSuccess='getRolesList'></rolestable>
      <!-- 这个是点击添加角色之后弹出的对话框，被抽离出去了 -->
      <addRolesDialog @addRolesSuccess="getRolesList" ref="addRoles"></addRolesDialog>
      <!-- 这个是点击编辑之后弹出的对话框，被抽离出去了 -->
      <changeRoles @changeRolesSuccess='getRolesList'></changeRoles>
      <!-- 这个是点击分配权限之后弹出的对话框，被抽离出去了 -->
      <setRolesDialog :rolesdata="rolesdata" @setRolessuccess='getRolesList'></setRolesDialog>
    </el-card>
  </div>
</template>
<script>
  import Navbar from '@/components/common/Navbar.vue';
  import rolestable from './children/rolestable.vue'
  import setRolesDialog from './children/setRolesDialog.vue'
  import addRolesDialog from './children/addRolesDialog.vue'
  import changeRoles from './children/changeRoles.vue'

  export default {
    name: 'roles',
    components: {
      Navbar,
      rolestable,
      setRolesDialog,
      addRolesDialog,
      changeRoles
    },
    data() {
      return {
        // 这个是权限管理表格数据存储
        RolesList: [],
        // 这个是tree树形结构数据存储
        rolesdata:[]
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      // 获取表格数据的方法
      async getRolesList() {
        const {
          data: res
        } = await this.$http.get('roles')
        this.RolesList = res.data
      },
      // 点击添加角色之后触发的方法
      addRoles () {
        this.$refs.addRoles.isshow = true
      }
    }
  }

</script>
<style scoped>

</style>
