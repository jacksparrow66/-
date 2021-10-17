<template>
  <div id="main" style="width: 750px;height:400px;"></div>
</template>
<script>
const echarts = require('echarts')
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    const myCharts = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')

    const result = _.merge(res.data, this.options)
    myCharts.setOption(result)
  }
}
</script>
<style scoped>
#main {
  width: 200px;
  height: 200px;
}
</style>
