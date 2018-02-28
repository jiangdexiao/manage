<template>
    <div class="sidebar">
        <el-menu class="el-menu-vertical-demo" :default-active="$route.path" background-color="#505562" text-color="#fff" active-text-color="#ffd04b" theme="dark" unique-opened router>
            <el-menu-item index="" ></el-menu-item>
            <el-row v-for="(item,index) in menus" :key="index">
                <el-menu-item v-if="item.home === true" :index="item.url?item.url:item.menuId" >
                    <i :class="item.icon"></i>
                    <span class="sb-cn">{{item.name}}</span>
                </el-menu-item>
                <el-submenu v-else-if="item.menuId!='32624b911d694f09b25033d608368f89'" :index="item.url?item.url:item.menuId">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span class="sb-cn">{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="(menu,cindex) in item.menus " :key="cindex" :index="menu.url?menu.url:menu.menuId" @click="clear">{{menu.name}}</el-menu-item>
                </el-submenu>
            </el-row>

            <!-- <el-submenu index="3">
                <template slot="title">
                    <span class="sb-cn">charts</span>
                </template>
                <el-menu-item index="echarts"> echarts</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <span class="sb-cn">表单控件</span>
                </template>
                <el-menu-item index="cascader"> cascader</el-menu-item>
                <el-menu-item index="checkbox"> checkbox</el-menu-item>
                <el-menu-item index="date"> date</el-menu-item>
                <el-menu-item index="datetime"> datetime</el-menu-item>
                <el-menu-item index="editor"> editor</el-menu-item>
                <el-menu-item index="input"> input</el-menu-item>
                <el-menu-item index="radio"> radio</el-menu-item>
                <el-menu-item index="select"> select</el-menu-item>
                <el-menu-item index="switch"> switch</el-menu-item>
                <el-menu-item index="textarea"> textarea</el-menu-item>
                <el-menu-item index="time"> time</el-menu-item>
                <el-menu-item index="validate"> validate</el-menu-item>
                <el-menu-item index="upload"> upload</el-menu-item>
            </el-submenu>

             <el-submenu index="5">
                <template slot="title">
                    <span class="sb-cn">表格</span>
                </template>
                <el-menu-item index="list">基础表格</el-menu-item>
                <el-menu-item index="filter">筛选表格</el-menu-item>
                <el-menu-item index="expand">展开表格</el-menu-item>
                
            </el-submenu> -->
        </el-menu>
    </div>
</template>
<script>
export default {
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  props:{
      menus:{
          type:Array
      }
  },
  methods: {
      clear () {
          sessionStorage.setItem('channelInfo', '[]')
      }
  },
  mounted() {
  }
};
</script>
<style scoped>

.sidebar {
  display: block;
  position: absolute;
  width: 200px;
  left: 0;
  top: 60px;
  bottom: 0;
  background: #324157;
}
.sidebar > ul {
  height: 100%;
  overflow: auto;
}
.sidebar > ul::-webkit-scrollbar {
	display: none
}
/*IE10,IE11,IE12*/
.sidebar > ul {
	-ms-scroll-chaining: chained;
	-ms-overflow-style: none;
	-ms-content-zooming: zoom;
	-ms-scroll-rails: none;
	-ms-content-zoom-limit-min: 100%;
	-ms-content-zoom-limit-max: 500%;
	-ms-scroll-snap-type: proximity;
	-ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
	-ms-overflow-style: none;
	overflow: auto;
}
/* .sidebar  i {
    width:24px;
    height:24px;
    position: absolute;
    top:14px;
} */
.sidebar .iconfont{
    font-size:22px;
    color:#fff;
}
.sidebar .sb-cn{
    margin-left:10px;
}
.el-menu{
    border:0;
}
.el-menu-item,
.el-submenu__title {
  font-size: 14px;
  height: 50px;
  line-height:50px;
}

/*媒体管理系统菜单图标*/
/* .nav_home {background: url(../../../assets/images/sidebar/ico_orders.png) no-repeat;}
.nav_order {background: url(../../../assets/images/sidebar/nav_bd.png) no-repeat;}
.nav_change {background: url(../../../assets/images/sidebar/nav_client.png) no-repeat;}
.nav_promoter {background: url(../../../assets/images/sidebar/nav_promoter.png) no-repeat;}
.nav_media {background: url(../../../assets/images/sidebar/nav_media.png) no-repeat;}
.nav_finance {background: url(../../../assets/images/sidebar/nav_finance.png) no-repeat;} */
/* .nav_asset_m {background: url(../../../assets/images/sidebar/ico_data.png) no-repeat;} */
</style>
