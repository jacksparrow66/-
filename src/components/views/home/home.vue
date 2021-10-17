<template>
  <el-container class="home-container">
    <el-header>
      <!-- avatar是被抽离出去到的组件，是头像，和注销之类的 -->
      <avatar/>

    </el-header>
    <el-container>
      
      <!-- 这个是左边导航栏的组件 -->
      <el-aside :width="iswidth ? '64px':'200px'">
        <!-- left是被抽离出去的组件，就是左边的菜单栏 -->
        <left :menus="menus" @collapse="collapse"></left>

      </el-aside>

      <!-- 这个是右边的内容区域 -->
      <el-main>
        <!-- 这里是右边数据内容的路由占位符 -->
        <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import left from './children/left.vue'
import avatar from './children/avatar.vue'
export default {
  name: 'home',
  data () {
    return {
      menus:[],
      // 这个是接收是否处于折叠状态的boolean值
      iswidth:false
    }
  },
//   注册组件
  components:{
      left,
      avatar
  },
  created(){
    // 组件创建后就会去调用这个方法，去获取菜单栏的数据
    this.GetMenu()
  },
  methods: {
    // 这个是获取菜单数据的方法
    // 使用async和await来替换promise，因为默认网页请求获取到的就是Promise对象
    // 可以按照常规的方法去.then(res => {console.log(res)})来获取数据
    async GetMenu () {
      const { data: res } = await this.$http.get ('menus')
      if(res.meta.status != 200) return this.$message.error(re.status.msg)
      this.menus = res.data
    },
    // 这个是接受左边菜单栏是否折叠的数据
    collapse () {
      this.iswidth = !this.iswidth
    }
  }
}
</script>
<style>
.home-container {
  height: 100vh;
}
.el-header {
  background-color: #363d40;
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
</style>
