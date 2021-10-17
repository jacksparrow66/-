<template>
  <el-table :data="orderDataList" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column
      label="订单编号"
      width="250px"
      prop="order_number"
    ></el-table-column>
    <el-table-column label="订单价格" prop="order_price"></el-table-column>
    <el-table-column label="是否付款" prop="pay_status">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.pay_status === '1'" type="success"
          >已付款</el-tag
        >
        <el-tag v-else type="danger">未付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="是否发货" prop="is_send"></el-table-column>
    <el-table-column label="下单时间">
      <template slot-scope="scope">
        {{ showtime(scope.row.create_time) }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-tooltip effect="dark" content="修改地址" placement="top">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editAddress"
          ></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="物流进度" placement="top">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-location"
            @click="progress"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { formatDate } from '@/assets/js/time.js'
export default {
  props: {
    orderDataList: {
      type: Array,
      default: {
        return: []
      }
    }
  },
  methods: {
    // 格式化时间的函数
    showtime(time) {
      const date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    // 点击修改地址触发的函数
    editAddress() {
      this.$bus.$emit('editAddressShow')
    },
    // 点击查看物流进度触发的函数
    progress () {
      this.$bus.$emit('progress')
    }
  }
}
</script>
<style scoped>
.el-table{
  margin-top: 15px;
}
</style>
