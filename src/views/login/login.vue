<template>
  <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="form.mobile" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="form.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="onLogin" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import { mapActions } from 'vuex'
  import md5 from 'md5'
  export default {
    data() {
      return {
        loading: false,
        form: {
          // account: 'admin',
          // checkPass: '123456',
          mobile: '18898791904', 
          password: '12345678', 
          appDeviceSn: 111, 
          terminalType: 3
        },
        rules: {
          mobile: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      onLogin(ev) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.api_user_login({data:Object.assign(this.form,{password:md5(this.form.password)} )}).then(res=>{
              this.$router.push('/abstract')
              console.log(res)
              if (res.token) {
                // that.$.cookie('mToken', result.token, {expires: 1});
                // that.$.cookie('mUser', JSON.stringify(result.content), {expires: 1});
                // that.$goRoute('/mu/abstract')
              }
            })
          } 
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    border-radius: 5px;
    // -moz-border-radius: 5px;
    // -webkit-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>