<template>
  <div class="">
    <Navbar :list="['数据统计', '数据报表']"></Navbar>
    <el-card shadow='hover'> 
<echarts></echarts>
    </el-card>
  </div>
</template>
<script>
import Navbar from '@/components/common/Navbar'
import echarts from './children/echarts'
export default {
  components: {
    Navbar,
    echarts
  }
}
</script>
<style scoped></style>
