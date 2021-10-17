<template>
  <div class="login">
    <div class="loginbox">
      <!-- 头像区域  -->
      <div class="avatar" @click="change">
        <img v-show="isshow" src="@/assets/img/logo.png" alt="" />
        <img v-show="!isshow" src="@/assets/img/avatar.jpg" alt="" />
      </div>
      <!-- 这里是表单 -->
      <el-form ref="formref" class="form" :rules="formrules" :model="formdata">
        <el-form-item prop="username">
          <el-input
            v-model="formdata.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formdata.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // 这个是绑定2个表单的数据
      formdata: {
        username: 'admin',
        password: '123456'
      },
      // 这个是表单的验证规则
      formrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 25, message: '密码长度不得小于3', trigger: 'blur' }
        ]
      },
      isshow: true
    }
  },
  methods: {
    // 这个是重置的方法
    reset() {
      this.$refs.formref.resetFields()
    },
    // 这个是登入的方法
    login() {
      // 这个ispass就是表单验证结果，如果是true说明表单验证通过
      // 如果是false就说明表单验证失败
      this.$refs.formref.validate(ispass => {
        // 这个是验证账号密码是否符合验证，不符合就不可以点击登入，
        // 如果验证失败，就不会发送登入请求
        if (!ispass) return this.$message.error('请按照规则填写')

        // 发送axios请求，因为在main.js中已经挂载了，所以可以直接使用this.$http
        const result = this.$http.post('login', this.formdata)
        result.then(res => {
          const msg = res.data.meta.msg
          // 这里是如果登入失败的弹窗
          if (res.data.meta.status === 400) {
            return this.$message.error('登入失败,账号或者密码错误')
          }
            // 这个是登入成功的弹窗
            this.$message.success('登入成功')
            window.sessionStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
        })
      })
    },
    change() {
      this.isshow = !this.isshow
    }
  }
}
</script>

<style scoped>
.loginbox {
  height: 300px;
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
}
.avatar {
  height: 120px;
  width: 120px;
  border-radius: 50%;
  border: 1px solid black;
  padding: 5px;
  box-shadow: 0 0 5px #2b4b6b;
  position: absolute;
  left: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
img {
  height: 120px;
  width: 120px;
  border-radius: 50%;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>
