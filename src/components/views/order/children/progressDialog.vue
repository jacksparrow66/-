<template>
  <el-dialog
    title="物流进度"
    :visible.sync="isshow"
    width="50%"
  >
    <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  </el-dialog>
</template>
<script>
import progressInfo from '@/assets/js/progress.js'
export default {
  data() {
    return {
      //   控制对话框显示还是隐藏的
      isshow: false,
      //   这个是物流的信息
      progressInfo: progressInfo
    }
  },
  mounted() {
    this.$bus.$on('progress', async () => {
      this.isshow = true
    })
  },
  methods: {
    handleClose() {}
  }
}
</script>
<style scoped></style>
