<template>
  <div class=''>
      <Navbar :list="['权限管理','权限列表']"></Navbar>
      <el-card shadow="hover" >
          <el-table :data="RightsList" border stripe>
              <el-table-column type="index" label="NO"></el-table-column>
              <el-table-column label="权限名称" prop='authName'></el-table-column>
              <el-table-column label="路径" prop='path'></el-table-column>
              <el-table-column label="权限等级" prop='level'>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>

              </el-table-column>
          </el-table>
      </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar.vue'
export default {
  name: 'rights',
  data () {
      return {
          RightsList:[]
      }
  },
  components:{
      Navbar
  },
  created(){
      this.getRightsList()
  },
  methods:{
      async getRightsList () {
          const { data:res } = await this.$http.get('/rights/list')
          console.log(res);
          this.RightsList = res.data
      }
  }
}
</script>
<style scoped>

</style>