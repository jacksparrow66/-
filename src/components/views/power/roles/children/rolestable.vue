<template>
  <el-table :data="RolesList" border stripe>
    <!-- 展开列表 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 一级权限渲染 -->
        <el-row
          :class="['borderbottom', 'vcenter', index1 === 0 ? 'bordertop' : '']"
          v-for="(item, index1) in scope.row.children"
          :key="item.id"
        >
          <el-col :span="5">
            <el-tag closable @close="removeroles(scope.row, item.id)">{{
              item.authName
            }}</el-tag>
            <i
              class="el-icon-caret-right
                "
            ></i>
          </el-col>
          <el-col :span="19">
            <!-- 二级权限渲染 -->
            <el-row
              :class="['vcenter', index2 === 0 ? '' : 'bordertop']"
              v-for="(item2, index2) in item.children"
              :key="item2.id"
            >
              <el-col :span="8">
                <el-tag
                  closable
                  @close="removeroles(scope.row, item2.id)"
                  type="success"
                  >{{ item2.authName }}</el-tag
                >
                <i
                  class="el-icon-caret-right
                    "
                ></i>
              </el-col>
              <el-col :span="16">
                <!-- 三级权限渲染 -->
                <el-row
                  :class="['vcenter', index3 === 0 ? '' : 'bordertop']"
                  v-for="(item3, index3) in item2.children"
                  :key="item3.id"
                >
                  <el-tag
                    type="warning"
                    closable
                    @close="removeroles(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <!-- 索引列表 -->
    <el-table-column type="index" label="NO"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="changeRoles(scope.row.id)"
          >编辑</el-button
        >
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="deleteRole(scope.row.id)"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="warning"
          icon="el-icon-setting"
          @click="setRolesDialog(scope.row)"
          >分配权限</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'rolestable',
  props: {
    RolesList: {
      type: Array
    }
  },
  methods: {
    // 删除权限的位置
    removeroles(roles, rights) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送网络请求。删除指定数据
          const { data: res } = await this.$http.delete(
            `roles/${roles.id}/rights/${rights}`
          )
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          roles.children = res.data
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 点击分配权限发送事件，以及数据
    setRolesDialog(roles) {
      this.$bus.$emit('setRolesDialog', roles)
    },
    // 点击编辑发送事件，以及所需要的id值
    changeRoles(id) {
      this.$bus.$emit('changeRoles', id)
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该角色,请确定是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then( async () => {
          // 通过id去发送网络请求，删除目前id的值
          const { data:res } = await this.$http.delete(`roles/${id}`)
          // 通过返回的状态码去判断删除成功还是失败
          if(res.meta.status !== 200 ) return this.$http.error('删除失败')
          // 发送事件出去，告诉父组件删除成功，重新获取数据渲染页面
          this.$emit('deleteRoleSuccess')
          this.$message.success("删除成功")
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>
<style scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-top: 5px;
}

.vcenter {
  display: flex;
  align-items: center;
}

.bordertop {
  border-top: solid 1px #eee;
}

.borderbottom {
  border-bottom: solid 1px #eee;
}
</style>
