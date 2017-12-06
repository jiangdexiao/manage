<template>
  	<div class="phgl">
      <button class="sign_out" @click="sign_out">退出</button>
      <div class="list">
        <div class="title">
          拍获管理中心
        </div>
        <a :class="moduleIds.includes(BUSINESS_MANAGE_PLATFORM)?'orgin':'disable'" @click="goto(BUSINESS_MANAGE_PLATFORM)">
          <span class="icon icon_1"></span>
          <span class="message">运营管理平台</span>
        </a>
        <a :class="moduleIds.includes(MEDIA_MANAGE_PLATFORM)?'orgin':'disable'" @click="goto(MEDIA_MANAGE_PLATFORM)">
          <span class="icon icon_2"></span>
          <span class="message">媒体管理平台</span>
        </a>
        <a :class="(moduleIds.includes(MEDIA_SALE_MANAGE_PLATFORM)  && getUser.roleId != 1)?'orgin':'disable'" @click="goto(MEDIA_SALE_MANAGE_PLATFORM)">
          <span class="icon icon_3"></span>
          <span class="message">媒体行销系统</span>
        </a>
        <a :class="moduleIds.includes(SELLER_MANAGE_PLATFORM)?'orgin':'disable'" @click="goto(SELLER_MANAGE_PLATFORM)">
          <span class="icon icon_4"></span>
          <span class="message">商家管理平台</span>
        </a>
        <a :class="moduleIds.includes(TOOL_MANAGE_PLATFORM)?'orgin':'disable'" @click="goto(TOOL_MANAGE_PLATFORM)">
          <span class="icon icon_5"></span>
          <span class="message">工具管理平台</span>
        </a>
        <a :class="moduleIds.includes(BI_MANAGE_PLATFORM)?'orgin':'disable'" @click="goto(BI_MANAGE_PLATFORM)">
          <span class="icon icon_6"></span>
          <span class="message">BI系统</span>
        </a>
        <a></a>
        <a></a>
      </div>
    </div>
</template>

<script>
import { mapState ,mapGetters, mapActions} from 'vuex'
import { cookie } from '../utils/'
export default {
  name: '',
  data () {
    return {
      user:''
    }
  },
  computed:{
      ...mapGetters(['getUser']),
      ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM']),
      moduleIds(){
        return this.getUser?this.getUser.moduleId:[]
      }
  },
  methods: {
    ...mapActions(['setUser']),
    goto (muduleId) {
        switch(muduleId){
            case this.TOOL_MANAGE_PLATFORM:
                if (href.includes('localhost') || href.includes('m2c2017dev')){
                    this.BASE_URL = `http://bi.m2c2017dev.com/`
                }
            break;
            case this.BI_MANAGE_PLATFORM:
            
            break;
            case this.BUSINESS_MANAGE_PLATFORM:break;
            case this.MEDIA_MANAGE_PLATFORM:break;
            case this.MEDIA_SALE_MANAGE_PLATFORM:break;
            case this.SELLER_MANAGE_PLATFORM:break;
        }
    //   console.log('点击的moduleId',this.moduleIds.includes('32df5b285d6c480e9b17219461e147cb'))
    //   console.log('拿到的权限数组',this.moduleIds)
    //   let that = this
    //   let href = window.location.href
    //   let base = ''
    //   let bibase = ''
    //   if (href.includes('localhost') || href.includes('m2c2017dev')) { // 本地环境和开发环境
    //     base = 'http://master.m2c2017dev.com:80/'
    //     bibase = 'http://bi.m2c2017dev.com/#/home'
    //   } else if (href.includes('m2c2017local')){
    //     base = 'http://master.m2c2017local.com:80/'  // local环境
    //     bibase = 'http://bi.m2c2017local.com/#/home'
    //   } else if (href.includes('m2c2017test')){
    //     base = 'http://master.m2c2017test.com:80/'   // test 环境
    //     bibase = 'http://bi.m2c2017test.com/#/home'
    //   } else if (href.includes('m2c2017final')){
    //     base = 'http://master.m2c2017final.com:80/'   // 演示环境
    //     bibase = 'http://bi.m2c2017final.com/#/home'
    //   } else {
    //     base = 'http://master.m2c2017.com:80/'     // 正式环境
    //     bibase = 'http://bi.m2c2017.com/#/home'
    //   }
    //   if (that.moduleIds.length > 0) {
    //     that.moduleIds.some(item=>{
    //       // if(moduleId == item.moduleId) { //判断是否有权限
    //       if(moduleId == item) { //判断是否有权限
    //         sessionStorage.setItem('moduleId',moduleId)
    //         if (moduleId == '32df5b285d6c480e9b17219461e147cb') { // 后台运营管理
    //           location.href= location.href.replace(/phgl/, 'm/mhome')
    //           return 
    //         } else if (moduleId == '4d1a1c4eee254a518d468e99fd8e26c1') { // 媒体管理平台
    //           location.href= base + 'm-admin/#/mu'
    //           return 
    //         } else if (moduleId == '1748a40e113343a3820d3083bae1822a' &&  that.users.roleId != 1) { // 媒体行销平台
    //           location.href= base + 'marketing/#/mu'
    //           return 
    //         } else if (moduleId == '88de735195dc442a90bcbd04adc6ed92') { // 商家管理平台
    //           location.href= base + 'merchant/?#/s/dealer'
    //           return 
    //         } else if (moduleId == 'e36b1d6fe08e40169a78aa9fee91d2e6') { // 工具管理平台
    //           location.href= base + 'm/mhome'
    //           return 
    //         } else if (moduleId == 'c940c5c062df40868e633d77e677c4af') { // BI系统
    //           location.href= bibase
    //           return 
    //         }
    //         // console.log(location.href)
    //       }
    //     })
    //   }
    },
     // 获取模块权限
    get_module_limits () {
    //   let that = this
    //   sessionStorage.setItem('access_token', that.getCookie('access_token'))
    //   if (that.md5(that.getCookie('access_token')) != that.getCookie('auth')) {
    //     that.$.removeCookie('access_token')
    //     that.$.removeCookie('auth')
    //     that.$goRoute({path: '/mlogin'})
    //     that.show_tip('登录失效，请重新登录')
    //     return
    //   } else {
    //     sessionStorage.setItem('userInfo', JSON.stringify(that.userInfo(that.getCookie('access_token'))))
    //   }
    //   console.log(JSON.parse(sessionStorage.getItem('userInfo')))
    //   that.$.ajax({
    //       method: 'get',
    //       url: that.localbase+ 'm2c.operate/permission/auth/modules',
    //       data: {
    //             userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
    //             accessToken:sessionStorage.getItem('access_token')
    //           },
    //       success: function (result) {
    //         result.content.forEach(item=> {
    //           that.moduleIds.push(item.moduleId)
    //         })
    //         console.log('点击的moduleId',that.moduleIds.includes('32df5b285d6c480e9b17219461e147cb'))
    //       },
    //       error: function () {
    //         that.hide_loading()
    //       }
    //   })
    },
    // 登出
    sign_out () {
      this.$confirm('确定退出吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.api_user_loginout({data:{ token:this.getUser.token } }).then(res=>{
              sessionStorage.removeItem('user')
              cookie.delCookie('access_token')
              cookie.delCookie('auth')
              this.setUser()
              this.$router.push('/login')
            })
        }).catch(() => {
      
        });
    }
  },
  beforeCreate(){
      console.log('beforeCreated')
  },
  created () {
    this.get_module_limits()
  },
  mounted () {
    //如果对象为空重新commit 避免强制刷新状态丢失
    if( !this.getUser ){
        this.setUser()
    }
    //   console.log('userinfo'+ JSON.stringify(this.getUser))
    // let that = this
    // that.users = JSON.parse(sessionStorage.getItem('userInfo'))
    // console.log('用户信息',   that.users)
    // if (that.md5(that.$.cookie('access_token')) != that.$.cookie('auth')) {
    //   that.$goRoute({path: '/mlogin'})
    //   that.show_tip('登录失效，请重新登录')
    //   return
    // }
    // if (!sessionStorage.getItem('access_token')) {
    //   that.$goRoute({path: '/phgl'})
    //   return
    // }
  },
  watch: {
        $route () {
          alert(1)
        }
      }
}
</script>

<style lang="scss" scoped>
.phgl{
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../static/images/img_bg1920.png') no-repeat center center/100% 100%;
    .list{
      width: 640px;
      height: 400px;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      box-shadow: 1px 1px 6px 1px rgba(0,0,0,.3);
      .title{
        width:100%;
        height: 170px;
        line-height: 170px;
        position: absolute;
        top:-170px;
        text-align: center;
        font-size: 36px;
        color:#0086FF;
      }
      .orgin{
        display: block;
        width: 25%;
        height:200px;
        position: relative;
        border:1px solid #EDF0F7;
       
        span{
          position: absolute;
          display: block;
        }
        .icon{
          width: 60px;
          height: 60px;
          top:50px;
          left:50px;
        }
        .icon_1{
          background:url("../../static/images/yy.png");
        }
        .icon_2{
          background:url("../../static/images/mt.png");
        }
        .icon_3{
          background:url("../../static/images/xx.png");
        }
        .icon_4{
          background:url("../../static/images/sj.png");
        }
        .icon_5{
          background:url("../../static/images/gj.png");
        }
        .icon_6{
          background:url("../../static/images/BI.png");
        }
        .message{
          width:100%;
          text-align: center;
          bottom:30px;
          font-size: 14px;
          color:#333;
        }
      }
      .orgin:hover{
         .icon_1{
          background:url("../../static/images/yy_1.png");
        }
        .icon_2{
          background:url("../../static/images/mt_1.png");
        }
        .icon_3{
          background:url("../../static/images/xx_1.png");
        }
        .icon_4{
          background:url("../../static/images/sj_1.png");
        }
        .icon_5{
          background:url("../../static/images/gj_1.png");
        }
        .icon_6{
          background:url("../../static/images/BI_1.png");
        }
      }
      .disable{
        display: block;
        width: 25%;
        height:200px;
        position: relative;
        border:1px solid #EDF0F7;
        span{
          position: absolute;
          display: block;
        }
        .icon{
          width: 60px;
          height: 60px;
          top:50px;
          left:50px;
        }
        .icon_1{
          background:url("../../static/images/yy_2.png");
        }
        .icon_2{
          background:url("../../static/images/mt_2.png");
        }
        .icon_3{
          background:url("../../static/images/xx_2.png");
        }
        .icon_4{
          background:url("../../static/images/sj_2.png");
        }
        .icon_5{
          background:url("../../static/images/gj_2.png");
        }
        .icon_6{
          background:url("../../static/images/BI_2.png");
        }
        .message{
          width:100%;
          text-align: center;
          bottom:30px;
          font-size: 14px;
          color:#333;
        }
      }
    }
    .sign_out {
      position: absolute;
      right:40px;
      top:30px;
      width: 80px;
      height: 30px;
      background-color: transparent;
      border:1px solid #ccc;
      color: #333;
      font-size: 14px;
      font-weight: bold;
    }
}
</style>
