<template>
  <div>
    <div class="collapse" @click="collapse">|||</div>
    <!-- background-color就是背景颜色
  text-color就是文本颜色
  active-text-color就是当前活跃的文本颜色
  unique-opened就是是否只能展开一个菜单栏，默认是false，就是可以展开多个
  collapse就是是否将菜单栏收起，默认是false，这里是使用了data中的数据，就可以通过methods动态的修改
  router就是是否开启element-ui的路由功能 -->
    <el-menu
      background-color="#313743"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="iscollapse"
      router
      :default-active="activePath"
    >
      <!-- 这个是一级菜单区域 -->
      <el-submenu
        :index="item.id + ''"
        v-for="(item, index) in menus"
        :key="item.id"
      >
        <template slot="title">
          <i :class="icons[index]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 这个是二级菜单区域 -->
        <el-menu-item
          v-for="ChilItem in item.children"
          :index="ChilItem.path"
          :key="ChilItem.id"
          @click="itemclock(ChilItem.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ ChilItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'left',
  data() {
    return {
      // 图标的数组
      icons: [
        'el-icon-user-solid',
        'el-icon-set-up',
        'el-icon-shopping-bag-1',
        'el-icon-tickets',
        'el-icon-s-platform'
      ],
      // 是否折叠
      iscollapse: false,
      // 活跃的地址
      activePath:''
    }
  },
  props: {
    menus: {
      type: Array
    }
  },
  methods: {
    // 这个是监听左侧菜单栏是否折叠的方法
    collapse() {
      this.iscollapse = !this.iscollapse
      this.$emit('collapse')
    },


    // 这个是点击菜单栏二级菜单后存储到sessionStorage的方法
    itemclock(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>
<style scoped>
.el-menu {
  border-right: none;
}
.collapse {
  line-height: 35px;
  color: aliceblue;
  text-align: center;
  background-color: #475163;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
