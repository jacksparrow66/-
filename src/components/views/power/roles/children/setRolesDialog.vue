<template>
  <el-dialog title="分配权限" :visible.sync="isshow" width="50%"
      @close="closeDialog"
  >
    <!-- 树形结构 -->
    <!-- data是数据，treeprop是显示的内容，以及后续的子目录 -->
    <el-tree
      show-checkbox
      default-expand-all
      node-key="id"
      :default-checked-keys="keys"
      :data="rolesdata"
      :props="treeprop"
      ref="treeref"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel">取 消</el-button>
      <el-button type="primary" @click="determine">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'setRolesDialog',
  data() {
    return {
      isshow: false,
      rolesdata:[],
      treeprop: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的所有id
      keys:[],
      // 这个是当前对话框的id存储
      rolesId:0
    }
  },
  mounted () {
    // 接收事件总线中$bus.$on在rolestable中发出来的事件
    // 注意：这个 roles 是点击分配权限之后发送过来的参数
    this.$bus.$on("setRolesDialog" , async (roles) => {
        this.rolesId = roles.id
        this.isshow = true
        // 获取所有权限的数据
        const { data:res } = await this.$http.get('rights/tree')
        if(res.meta.status != 200) return this.$message.error("获取所有权限失败")
        this.rolesdata = res.data
        this.GetKeys(roles,this.keys)
    })
  },
  methods:{
    // 取消的方法
    Cancel () {
      this.isshow = false
    },
    // 点击确定的方法
    closeDialog () {
      this.keys = []
      this.isshow = false
    },
    async determine(){
      // 通过ES6的扩展运算符，把2个数组转化成一个数组，
      // getCheckedKeys，getHalfCheckedNodes是 element-ui 中的方法
      // 作用是，将tree形结构中选中和半选中的生成一个数组
      const idlist = [...this.$refs.treeref.getCheckedKeys(),...this.$refs.treeref.getHalfCheckedNodes()]
      // idlist.join(',')的作用是把这数组转化成字符串，每个元素之间再用 ',' 隔开
      const liststr = idlist.join(',')
      // 通过async 和await 获取到异步操作的结果，在使用ES6的结构数据，获取到数据
      const  {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{rids:liststr})
      if(res.meta.status !== 200) return this.$message.error("更新失败，请再次尝试")
      this.$message.success(res.meta.msg)
      this.isshow = false
      this.$emit("setRolessuccess")
    },

    // 使用递归让所有的三级权限都假如到 keys 数组中去
    GetKeys( node , arr ) {
      // 判断传入的 node 数组下有没有children，如果有就说明它不是三级节点，没有就加入到数组中去
      if(!node.children) {
        return arr.push(node.id)
      }
      // 运行了这里说明当前的那个 node 节点不是三级权限，此时就可以去遍历 node 权限中的children，
      // 让它的每一个子权限都去通过递归调用方法
      node.children.forEach(item => {
        this.GetKeys(item,arr)
      });
    }
  }
}
</script>
<style scoped></style>
