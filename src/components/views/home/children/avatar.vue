<template>
  <div class="avatarbox">
    <div class="avatar">
      <img class="img" src="@/assets/img/avatar.jpg" alt="" />
      <span>毛利凯桑</span>
    </div>
    <el-button type="info" @click="logout">注销</el-button>
  </div>
</template>
<script>
export default {
  name: '',
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped>
.avatarbox {
  height: 100%;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  align-items: center;
}
.avatar {
  display: flex;
}
.img {
  height: 3rem;
  border-radius: 50%;
}
.avatar span {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

</style>
