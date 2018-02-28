<template>
  	<div class="login">
      <div class="box" v-show="!forget_show">
        <div class="header"><i class="logo"></i><span class="pai">拍获</span><span class="line">|</span>管理中心</div>
        <div class="loform">
          <div class="user">
            <i class="user_name"></i>
            <input type="text" v-model="login_params.userName" maxlength="20" placeholder="用户名"  >
          </div>
          <div class="user">
            <i class="user_pass"></i>
            <input type="password" v-model="login_params.passwd"  placeholder="密码" @keydown.enter="login">
          </div>
          <div style="text-align: right;padding:10px 56px;">
              <a  class="forget" @click="forget_show = true">忘记密码</a>
            </div>
          <button class='login_btn' @click="login" v-loading.fullscreen.lock="loading">登&nbsp;&nbsp;录</button>
        </div>
      </div>
      <div class="box" v-show="forget_show">
        <div class="header"><span class="pai">忘记密码</span></div>
        <div class="loform">
          <div class="user">
            <i class="user_phone"></i>  
            <input type="text" v-model="forget_params.mobile" autocomplete="off" maxlength="11" placeholder="手机号码"  @keyup="test_mobile" >
          </div>
          <div class="user">
            <i class="user_key"></i>
            <input class="input_key" type="text" autocomplete="off"  maxlength="11" v-model="forget_params.verifyCode" placeholder="手机验证码" >
            <button @click="get_code" v-show="get_disable" >获取验证码</button>
            <button @click="get_code" v-show="!get_disable" disabled  class = 'dis'>{{prompt_info}}</button>
          </div>
          <div class="user">
            <i class="user_pass"></i>
            <input type="password" v-model="forget_params.newPwd" autocomplete="off" placeholder="请输入6-16位新密码" >
          </div>
          <button class='login_btn' @click="reset_pwd" v-show="set_disable" >完&nbsp;&nbsp;成</button>
          <button class='login_btn dis' @click="reset_pwd" v-show="!set_disable" disabled  >完&nbsp;&nbsp;成</button>
          <a  style="display:block" @click = " forget_show = false"> 返回登录页</a>
        </div>
      </div>
  	</div>
</template>


<script>
import { mapState , mapActions } from 'vuex'
import md5 from 'md5'
export default {
  name: '',
  data () {
    return {
      login_params: {userName: 'mtx1215', passwd: '12345678'},
      forget_params:{mobile:'',verifyCode:'',newPwd:''},
      forget_show :false,
      get_disable:false ,
      set_disable:false,
      // 再次发送短信剩余时间
      time: 60,
      prompt_info: '获取验证码',
      visible1:false,
      loading:false
    }
  },
  watch:{
    'forget_show': {
      handler (newcode, oldcode) {
        if (!newcode) {
           this.forget_params = {mobile:'',verifyCode:'',newPwd:''}
        }
      },
      deep: true
    },
    'forget_params.mobile': {
      handler (newcode, oldcode) {
        if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(newcode))) {
           this.get_disable=false
           this.set_disable=false
        } else {
          this.get_disable=true
          this.set_disable=true
        }
      },
      deep: true
    }
  },
   computed:{
      ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM'])
    },
  methods: {
    ...mapActions(['setUser']),
    // 登录
    login () {
      let that = this
      if (!that.login_params.userName || that.login_params.userName === '') {
        that.$message({type:'error',message:'请输入用户名'})
        return
      }
      if (that.login_params.userName.length<2 || that.login_params.userName.length>20) {
        that.$message({type:'error',message:'请输入2-20位的用户名'})
        return
      }
      if (!that.login_params.passwd || that.login_params.passwd === '') {
        that.$message({type:'error',message:'请输入密码'})
        return
      }
      $('.login_form_b input, .login_form_d button').blur()
    //   that.show_loading()
        this.loading = true;
        this.api_user_login({data:Object.assign(this.login_params,{passwd:md5(this.login_params.passwd)} )}).then(res=>{
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
                
                let userInfo = {
                userId:'',
                roleId:'',
                telNo:'',
                name:this.login_params.userName,
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
            let sub = this.tool.jsontoken.tokenDecode(res.content).sub
            Object.assign(userInfo,JSON.parse(sub))
            this.tool.cookie.setCookie('access_token', res.content, 1,'/',domain)
            this.tool.cookie.setCookie('auth',md5(res.content),1,'/',domain)
            sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
            sessionStorage.setItem('access_token',res.content)
            this.setUser()
            this.$router.push('/main')
            }
        }).catch(err=>{
            this.loading = false
        })

    },
    // 验证手机号码
    test_mobile () {
      let that =this
      if (that.forget_params.mobile.length == 11 && !/^1[3|4|5|7|8][0-9]{9}$/.test(that.forget_params.mobile)) {
        that.show_tip ('请输入正确的手机号码！')
      }
      if ((/^1[3|4|5|7|8][0-9]{9}$/.test(that.forget_params.mobile))) {
        that.get_disable = true
        that.set_disable = true
      } else {
        that.get_disable = false
        that.set_disable = false
      }
    },
    // 发送验证码
    get_code () {
      let that = this
      that.get_disable= false
      // setTimeout(function() {
      //   that.get_disable= true
      // },60000)
      that.prompt_info = that.time +'秒后可重新发送'
      let timer = setInterval(function () {
        that.prompt_info = that.time +'秒后重新发送'
        that.time -- 
        if (that.time < 0 ) {
          that.prompt_info = '获取验证码'
          that.time = 3
          that.get_disable = true

          clearInterval(timer)
        }
      },1000)
      this.api_common_sendSms({
        type:'post',
        data:{mobile:that.forget_params.mobile,
        codeType:6,
        systemAccessToken:sessionStorage.getItem('access_token')?sessionStorage.getItem('access_token'):''}}).then(result=>{
         if (result.status == 3) {
            that.prompt_info = '获取验证码'
            that.time = 60
            that.get_disable = true
            clearInterval(timer)
          }
      })
    },
    reset_pwd () { 
      let that = this
       if (that.forget_params.newPwd.length <4) {
        that.$message({type:'error',message:'请输入4位验证码！'})
        return
      }
      if (that.forget_params.newPwd.length <6 || that.forget_params.newPwd.length>16) {
        that.message({type:'error',message:'请输入6-16位密码！'})
        return
      }
      this.api_user_resetPassword({
        type:'post',
        data:{
          mobile:that.forget_params.mobile,
          verifyCode:that.forget_params.verifyCode,
          systemAccessToken:sessionStorage.getItem('access_token')?sessionStorage.getItem('access_token'):'',
          newPwd:that.md5(that.forget_params.newPwd),
          codeType:6}}).then(result=>{
            that.forget_show = false
          })
    }
  
  },
  beforeCreate () {
    // document.title = '拍获-后台管理-登录'
    // document.querySelector('#favicon').href = '/static/favicon_s.ico'
  },
  mounted () {
    // let that = this
    // let isloginOut= sessionStorage.getItem('loginout');
    // if(isloginOut!=null){
    //   let href = window.location.href
    //   let domain = ''
    //   if (href.includes('localhost') || href.includes('m2c2017dev')) { // 本地环境和开发环境
    //     domain = 'localhost'
    //   } else if (href.includes('m2c2017dev')){
    //     domain = 'm2c2017dev.com'  // dev环境
    //   } else if (href.includes('m2c2017local')){
    //     domain = 'm2c2017local.com'  // local环境
    //   } else if (href.includes('m2c2017test')){
    //     domain = 'm2c2017test.com'   // test 环境
    //   } else if (href.includes('m2c2017final')){
    //     domain = 'm2c2017final.com'   // 演示环境
    //   } else {
    //     domain = 'm2c2017.com'     // 正式环境
    //   }
    //   sessionStorage.clear()
    //   that.$.removeCookie('access_token', { path: '/' , domain: domain})
    //   that.$.removeCookie('auth', { path: '/' , domain: domain})
    //   that.$router.push({path: '/mlogin'})
    // } else {
    //   if (that.$.cookie('access_token')) {
    //     that.$goRoute({path: '/phgl'})
    //     return
    //   }
    // }
  }
}
</script>

<style  lang="scss" scoped>
::-ms-clear, ::-ms-reveal{display: none;}
html, body{
 width:100%;
 height:100%;
}

.login{
  position:absolute;width:100%;height:100%;background:url('../../../static/images/login/img_login.jpg') no-repeat center center/100% 100%;
  .box{
    // width: 28.6%;
    // height:54.7%;
    width: 412px;
    height: 492px;
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 8px;
    .header {
      // display: flex;
      padding-top:36px;
      text-align: center;
      font-size: 18px;
      color:#333;
      .logo{
        display: inline-block;
        width: 40px;
        height:40px;
        background: url('../../../static/images/login/ico_login_logo.png');
        margin-right: 10px;
        position: relative;
        top:10px;
      }
      .pai{
        font-size: 28px;
        color:#0086FF;
      }
      .line{
        margin: 0  5px;
      }
    }
    .loform {
      text-align: center;
      padding-top:20px;
      font-size: 14px;
      .user{
        width:300px;
        height:40px;
        position: relative;
        left:50%;
        transform: translateX(-50%);
        margin-top:20px;
        i{
          display:inline-block;
          width:40px;
          height:40px;
          position: absolute;
          top:0;
          left:0;
        }
        .user_name{
          background: url('../../../static/images/login/ico_login_user.png')no-repeat;
          background-position:center center;
        }
        .user_pass {
          background: url('../../../static/images/login/ico_login_password.png')no-repeat;
          background-position:center center;
        }
        .user_phone{
          background: url('../../../static/images/login/ico_login_phone.png')no-repeat;
          background-position:center center;
        }
        .user_key {
          background: url('../../../static/images/login/ico_login_AuthCode.png')no-repeat;
          background-position:center center;
        }
        input{
          width:248px;
          height:40px;
          padding-left:50px;
          border:1px solid #E6E8F2;
          background-color: #fff;
        }
        .input_key {
          width:120px;
          float: left;
          
        }
        .forget {
          display: inline-block;
          // float: right;
          margin-top:10px;
          margin-right: 40px;
        }
        button{
          width:120px; 
          height:40px;
          float: right;
          color:#fff;
          border:none;
          background-color: #0086FF;
        }
        button.dis{
          background-color: #BBD2F1 ;
        }
        
      }
      .login_btn{
        width:300px;
        height:50px;
        margin-top:40px;
        border:none;
        background-color: #0086FF;
        font-size: 16px;
        color:#fff;
        margin-bottom: 10px;
      }
      .dis{
        background-color: #BBD2F1 ;
      }
      a{
          cursor:pointer;
          text-decoration:none;
          color:#337ab7;
      }
      a:hover{
        text-decoration:underline;
        color:#333;
      }
    }
  }
}

</style>
