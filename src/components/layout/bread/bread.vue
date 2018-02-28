<template>
    <div class="bread">
      <div class="home_icon"></div>
      <el-breadcrumb separator-class="el-icon-arrow-right" separator>
        <!-- <el-breadcrumb-item :to="{ path: '/s' }">HOME</el-breadcrumb-item> -->
        <el-breadcrumb-item v-for='(item,index) in breads' :key='index' :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
  import { mapGetters ,mapState} from 'vuex'
  import { mediaManagePlatformRoute,
  businessManagePlatformRoute,
  biManagePlatformRoute,
  mediaSaleManagePlatformRoute,
  sellerManagePlatformRoute,
  customManagePlatformRoute } from '../../../router/'
  
  export default {
    name: 'bread',
    data () {
      return {
        moduleId:sessionStorage.getItem('moduleId'),
        strong: '',
        breads:[]
      }
    },
    computed:{
        ...mapGetters(['getMenus']),
        ...mapState(['TOOL_MANAGE_PLATFORM','BI_MANAGE_PLATFORM','BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM','SELLER_MANAGE_PLATFORM'])
    },
    methods: {
      getPageText (name) {
        return name.replace('编辑', this.$route.query.id ? '修改' : '添加')
      },
      setBreads(matched){
          this.breads = []
          if (this.$route.matched.length > 0) {
            let route = this.$route.matched[this.$route.matched.length-1]
            let routes = route.path.substr(1).split('/').map(p=>{
              if(p && p !=undefined && p.length >0)
                return p
            })
            let path = ''
            if(this.moduleId == this.MEDIA_SALE_MANAGE_PLATFORM ){
              routes.splice(0,1)
              path = '/mediasale'
            }
            _.each(routes,(_route,index)=>{
              path +=`/${_route}`
              if(index === 0){
                this.breads.push({path:path,name:'首页'})
                document.title = `${sessionStorage.getItem('title')}-拍获`
              }else if( _route === 'abstract' ){
                return
              }else if( index === 1 ){//二级菜单
                _.each(this.getMenus.menus,(menu,mindex)=>{
                    if( menu.menus && menu.menus.length >0 ){
                        let m = menu.menus.find(p=>p.url === path )
                        if( m ){
                            this.breads.push({path:menu.url,name:menu.name})
                            this.breads.push({path:m.url,name:m.name})
                            document.title = `${m.name}-${sessionStorage.getItem('title')}-拍获`
                            return
                        }
                    }
                })
              }else{//三级或者更多级
                let m = null
                switch(this.moduleId){
                  case this.TOOL_MANAGE_PLATFORM: m = customManagePlatformRoute.children.find(p=>p.path === path);break;
                  case this.BI_MANAGE_PLATFORM: m = biManagePlatformRoute.children.find(p=>p.path === path);break;
                  case this.BUSINESS_MANAGE_PLATFORM: m = businessManagePlatformRoute.children.find(p=>p.path === path);break;
                  case this.SELLER_MANAGE_PLATFORM: m = sellerManagePlatformRoute.children.find(p=>p.path === path);break;
                  case this.MEDIA_MANAGE_PLATFORM: m = mediaManagePlatformRoute.children.find(p=>p.path === path);break;
                  case this.MEDIA_SALE_MANAGE_PLATFORM: m = mediaSaleManagePlatformRoute.children.find(p=>p.path === path);break;
                }
                if( m ){
                  this.breads.push({path:path,name:m.title?m.title:m.name})
                }
              }
            })
          }
      }
    },
    mounted () {
    },
    created () {
      this.setBreads(this.$route.matched)
    },
    watch: {
      $route (to, from) {
        this.setBreads(this.$route.matched)
      }
    }
  }
</script>

<style scoped lang='scss'>
  /* 右侧菜单 */
.bread{margin-left:200px;padding-left:46px;line-height: 50px; z-index:9;background-color:rgba(255,255,255,0.8);width:100%;top:60px;position:fixed;background:#fff;height:50px;white-space:nowrap;overflow:auto;-moz-box-shadow:0px 3px 8px rgba(42,47,59,0.05);box-shadow:0px 3px 8px rgba(42,47,59,0.05);}
.bread span {display: inline-block;height: 50px;line-height: 50px;}
.home_icon {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 17px;
    left: 22px;
    background: url('../../../../static/images/ico_home.png') no-repeat;
  }
</style>
