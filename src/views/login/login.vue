<template>
  <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="form.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="form.passwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="onLogin" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import { mapState , mapActions } from 'vuex'
  import md5 from 'md5'
  import { cookie } from '../../utils/'
  export default {
    data() {
      return {
        loading: false,
        form: {
          // account: 'admin',
          // checkPass: '123456',
          userName: 'mtx1215', 
          passwd: '12345678'
        },
        rules: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          passwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    computed:{
      ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM'])
    },
    methods: {
      ...mapActions(['setUser']),
      onLogin(ev) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true;
            this.api_user_login({data:Object.assign(this.form,{passwd:md5(this.form.passwd)} )}).then(res=>{
              this.loading = false
              if (res.status == 200 && res.content ) {

                let href = window.location.href
                let domain = ''
                if (href.includes('localhost') || href.includes('m2c2017dev')) { // 本地环境和开发环境
                  domain = 'localhost'
                } else if (href.includes('m2c2017dev')){
                  domain = 'm2c2017dev.com'  // dev环境
                } else if (href.includes('m2c2017local')){
                  domain = 'm2c2017local.com'  // local环境
                } else if (href.includes('m2c2017test')){
                  domain = 'm2c2017test.com'   // test 环境
                } else if (href.includes('m2c2017final')){
                  domain = 'm2c2017final.com'   // 演示环境
                } else {
                  domain = 'm2c2017.com'     // 正式环境
                }
                cookie.setCookie('access_token', res.content, 1,'/',domain)
                cookie.setCookie('auth',md5(res.content),1,'/',domain)
                
                let userInfo = {
                    userId:'',
                    telNo:'',
                    name:'',
                    token:res.content,
                    moduleId:[
                      this.TOOL_MANAGE_PLATFORM,
                      this.BI_MANAGE_PLATFORM,
                      this.BUSINESS_MANAGE_PLATFORM,
                      this.MEDIA_MANAGE_PLATFORM,
                      this.MEDIA_SALE_MANAGE_PLATFORM,
                      this.SELLER_MANAGE_PLATFORM,
                    ]
                }
                sessionStorage.setItem('user',JSON.stringify(userInfo))
                this.setUser()
                this.$router.push('/main')
              }
            }).catch(err=>{
              this.loading = false
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