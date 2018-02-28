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
        <a >
        </a>
        <a >
        </a>
      </div>
    </div>
</template>

<script>
//c端工具菜单
import custom_menus from '../json/custom_menus.js'
import bi_menus from '../json/bi_menus.js'
import { mapState ,mapGetters, mapActions} from 'vuex'
//模拟菜单
import md5 from 'md5'
export default {
  name: '',
  data () {
    return {
      user:'',
      moduleIds:[]
    }
  },
  computed:{
      ...mapGetters(['getUser']),
      ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM'])
  },
  methods: {
    ...mapActions(['setUser','setMenu']),
    goto (moduleId) {
        let m = this.moduleIds.find(p=>p === moduleId)
        if(!m)return
        switch(moduleId){
            case this.TOOL_MANAGE_PLATFORM:
                sessionStorage.setItem('title','工具管理平台')
                sessionStorage.setItem('moduleId',moduleId)
                this.$router.push({path:'/customhome' })
            break;
            case this.BI_MANAGE_PLATFORM:
              sessionStorage.setItem('title','BI平台')
              sessionStorage.setItem('moduleId',moduleId)
              this.$router.push({path:'/bihome'})
            break;
            case this.BUSINESS_MANAGE_PLATFORM:
              sessionStorage.setItem('title','运营管理平台')
              sessionStorage.setItem('moduleId',moduleId)
              this.$router.push({path:'/m'})
            break;
            case this.MEDIA_MANAGE_PLATFORM:
              sessionStorage.setItem('title','媒体管理平台')
              sessionStorage.setItem('moduleId',moduleId)
              this.$router.push({path:'/mu'})
            break;
            case this.MEDIA_SALE_MANAGE_PLATFORM:
              if( this.getUser.roleId === 1) return
              //调用获取bd登录接口获取bd详细信息
              this.api_user_bdLogin({ data:{userId:this.getUser.userId} }).then(res=>{
                this.getUser.bd = res.content
                sessionStorage.setItem('userInfo',JSON.stringify(this.getUser))
                this.setUser()
                sessionStorage.setItem('title','媒体行销平台')
                sessionStorage.setItem('moduleId',moduleId)
                this.$router.push({path:'/mediasalehome'})
              })
            break;
            case this.SELLER_MANAGE_PLATFORM:
              sessionStorage.setItem('title','商家管理平台')
              sessionStorage.setItem('moduleId',moduleId)
              this.$router.push({path:'/s'})
            break;
        }
        //获取菜单
        this.api_common_menu({
          data:{
              userId: this.getUser.userId,
              accessToken: this.getUser.token,
              moduleId: moduleId
          }
        }).then(res => {
            sessionStorage.setItem('perms', JSON.stringify(res.content.perms))
            if( moduleId === this.BUSINESS_MANAGE_PLATFORM){
              res.content.menus.unshift({name:'HOME',url:'/m/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
            }
            else if(moduleId === this.MEDIA_SALE_MANAGE_PLATFORM){
              
              res.content.menus.map(item=>{
                this.iconReplace(item,moduleId )
                _.each(item.menus,(menu,index)=>{
                  menu.url = `/mediasale${menu.url}`
                })
              })
              res.content.menus.unshift({name:'HOME',url:'/mediasale/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
            }else if( moduleId === this.MEDIA_MANAGE_PLATFORM){
              res.content.menus.map(item=>{
                this.iconReplace(item,moduleId)
              })
              res.content.menus.unshift({name:'HOME',url:'/mu/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
            }else if( moduleId === this.BI_MANAGE_PLATFORM){
              // res.content.menus.unshift({name:'HOME',url:'/bi/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
              res.content.menus = bi_menus
            }else if( moduleId === this.SELLER_MANAGE_PLATFORM){
              res.content.menus.map(item=>{
                this.iconReplace(item,moduleId)
              })
              res.content.menus.unshift({name:'HOME',url:'/s/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
              sessionStorage.setItem('perms',res.content.perms)
            }else if( moduleId === this.TOOL_MANAGE_PLATFORM){
              res.content.menus.unshift({name:'HOME',url:'/custom/abstract',icon:'iconfont icon-guanlizhongxin',home:true})
              // res.content.menus = custom_menus
            }
            sessionStorage.setItem('menus',JSON.stringify(res.content))
            this.setMenu()
        }).catch(err=>{})
    },
    //为兼容旧平台数据这里拦截处理ico
    iconReplace(item , moduleId){
      switch( moduleId ){
        case this.MEDIA_MANAGE_PLATFORM:
          if( item.icon == 'nav_order'){
            item.icon = 'iconfont icon-nav_bd'
          }else if( item.icon == 'nav_change'){
            item.icon = 'iconfont icon-nav_client'
          }else if( item.icon == 'nav_media'){
            item.icon = 'iconfont icon-nav_media'
          }else if( item.icon == 'nav_promoter'){
            item.icon = 'iconfont icon-nav_promoter'
          }else if( item.icon == 'nav_finance'){
            item.icon = 'iconfont icon-caiwu'
          }else if( item.icon == 'nav_dataReport'){
            item.icon = 'iconfont icon-shuju'
          }
        break;
        case this.MEDIA_SALE_MANAGE_PLATFORM:
          if( item.icon == 'nav_order'){
            item.icon = 'iconfont icon-nav_bd'
          }else if( item.icon == 'nav_change'){
            item.icon = 'iconfont icon-nav_client'
          }else if( item.icon == 'nav_media'){
            item.icon = 'iconfont icon-nav_media'
          }else if( item.icon == 'nav_unit'){
            item.icon = 'iconfont icon-nav_unit'
          }else if( item.icon == 'nav_ranking'){
            item.icon = 'iconfont icon-paihangbang'
          }else if( item.icon == 'nav_asset_m'){
            item.icon = 'iconfont icon-shenshuguanli'
          }
        break;
        case this.BUSINESS_MANAGE_PLATFORM:
          if( item.icon == 'iconfont icon-setting'){
            // item.icon = 'iconfont icon-setting'
          }else if( item.icon == 'iconfont icon-xitongshezhi'){
            // item.icon = 'iconfont icon-xitongshezhi1'
          }else if( item.icon == 'iconfont icon-yunying'){
            // item.icon = 'iconfont icon-yunying'
          }else if( item.icon == 'iconfont icon-renyuantiaodong'){
            // item.icon = 'iconfont icon-renyuantiaodong'
          }else if( item.icon == 'iconfont icon-yingxiao'){
            // item.icon = 'iconfont icon-yingxiao1'
          }else if( item.icon == 'iconfont icon-neirong'){
            // item.icon = 'iconfont icon-neirong'
          }else if( item.icon == 'iconfont icon-shop-cservice'){
            // item.icon = 'iconfont icon-shop-cservice'
          }else if( item.icon == 'iconfont icon-jisuanqi'){
            // item.icon = 'iconfont icon-jiesuan'
          }else if( item.icon == 'iconfont icon-caiwu'){
            // item.icon = 'iconfont icon-caiwu'
          }
        break;
        case this.SELLER_MANAGE_PLATFORM:
          if( item.icon == 'nav_dealer'){
            item.icon = 'iconfont icon-shangjia'
          }else if( item.icon == 'nav_salesman'){
            item.icon = 'iconfont icon-user'
          }else if( item.icon == 'nav_order'){
            item.icon = 'iconfont icon-dingdan'
          }else if( item.icon == 'nav_change'){
            item.icon = 'iconfont icon-shangpin'
          }else if( item.icon == 'nav_asset_m'){
            item.icon = 'iconfont icon-zijin'
          }else if( item.icon == 'nav_count'){
            item.icon = 'iconfont icon-jiesuan'
          }else if( item.icon == 'nav_sale'){
            item.icon = 'iconfont icon-yingxiao'
          }else if( item.icon == 'nav_data'){
            item.icon = 'iconfont icon-shuju'
          }else if(item.icon == 'nav_setting'){
            item.icon = 'iconfont icon-shezhi'
          }
        break;
      }
    },
     // 获取模块权限
    get_module_limits () {
      this.api_user_modules({data:{userId:this.getUser.userId,accessToken:this.getUser.token}}).then(result=>{
        this.moduleIds = result.content.map(item=>{
          return item.moduleId
        })
      })
    },
    // 登出
    sign_out () {
      this.$confirm('确定退出吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.api_user_loginout({data:{ token:this.getUser.token } }).then(res=>{
              sessionStorage.clear()
              this.tool.cookie.delCookie('access_token')
              this.tool.cookie.delCookie('auth')
              this.$router.push('login')
            })
        }).catch(() => {
      
        });
    }
  },
  created () {
    //如果对象为空重新commit 避免强制刷新状态丢失
    if( !this.getUser ){
        this.setUser()
    }
    this.get_module_limits()
  },
  mounted () {
    if (md5(this.tool.cookie.getCookie('access_token')) != this.tool.cookie.getCookie('auth')) {
      this.tool.cookie.delCookie('access_token')
      this.tool.cookie.delCookie('auth')
      this.$router.push('login')
      this.$message({type:'error',message:'登录失效，请重新登录'})
      return
    }
    if (!this.tool.cookie.getCookie('access_token')) {
      sessionStorage.clear()
      this.tool.cookie.delCookie('access_token')
      this.tool.cookie.delCookie('auth')
      this.$goRoute({path: '/login'})
      return
    }
    if (!sessionStorage.getItem('userInfo')) {
      this.$router.push({path: '/main'})
      return
    }
  }
}
</script>

<style lang="scss" scoped>
.phgl{
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../static/images/layout/img_bg1920.png') no-repeat center center/100% 100%;
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
      a{box-sizing: border-box}
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
          background:url("../../static/images/layout/yy.png");
        }
        .icon_2{
          background:url("../../static/images/layout/mt.png");
        }
        .icon_3{
          background:url("../../static/images/layout/xx.png");
        }
        .icon_4{
          background:url("../../static/images/layout/sj.png");
        }
        .icon_5{
          background:url("../../static/images/layout/gj.png");
        }
        .icon_6{
          background:url("../../static/images/layout/BI.png");
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
          background:url("../../static/images/layout/yy_1.png");
        }
        .icon_2{
          background:url("../../static/images/layout/mt_1.png");
        }
        .icon_3{
          background:url("../../static/images/layout/xx_1.png");
        }
        .icon_4{
          background:url("../../static/images/layout/sj_1.png");
        }
        .icon_5{
          background:url("../../static/images/layout/gj_1.png");
        }
        .icon_6{
          background:url("../../static/images/layout/BI_1.png");
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
          background:url("../../static/images/layout/yy_2.png");
        }
        .icon_2{
          background:url("../../static/images/layout/mt_2.png");
        }
        .icon_3{
          background:url("../../static/images/layout/xx_2.png");
        }
        .icon_4{
          background:url("../../static/images/layout/sj_2.png");
        }
        .icon_5{
          background:url("../../static/images/layout/gj_2.png");
        }
        .icon_6{
          background:url("../../static/images/layout/BI_2.png");
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
      font-weight: 700;
    }
}
</style>
