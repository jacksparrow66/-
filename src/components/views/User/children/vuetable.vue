<template>
  <div class="">
    <el-table :data="user" border stripe>
      <el-table-column type="index" label="NO"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="statechange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="修改"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeuser(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuser(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distribute(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'vuetable',
  props: {
    user: {
      type: Array,
      default: {
        return: []
      }
    }
  },
  methods: {
    // 这个是修改数据库中状态的方法，使用async，await，去替换pormise.then
    async statechange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('修改状态失败')
        return
      }
      this.$message.success(res.meta.msg)
    },

    // 这个是点击修改触发的函数
    changeuser(id) {
      this.$bus.$emit('changeuser', id)
    },
    // 点击删除后触发的函数
    removeuser(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(id);
          const { data:res } =await this.$http.delete('users/' + id);
          if(res.meta.status != 200) return this.$message.error(res.meta.msg)
          this.$message.success('删除成功')
          // 删除之后是需要告诉父组件，重新获取数据重新渲染的
          this.$emit('removeuser')
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 点击分配角色触发的函数
    distribute (user) {
      this.$bus.$emit("distribute",user)
    }
  }
}
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
</style>
