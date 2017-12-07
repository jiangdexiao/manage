<template>
    <div class="sidebar">
        <el-menu class="el-menu-vertical-demo" default-active="abstract" background-color="#324157" text-color="#fff" active-text-color="#ffd04b" theme="dark" unique-opened router>
            
            <el-row v-for="(item,index) in menus" :key="index">
                <el-menu-item v-if="item.opened == false" :index="item.menus[0].path" >
                    <span class="sb-icon"><i class="material-icons">perm_data_setting</i></span>
                    <span class="sb-cn">{{item.menus[0].name}}</span>
                </el-menu-item>
                <el-submenu v-else :index="index+'_item'">
                    <template slot="title">
                        <span class="sb-icon"><i class="material-icons">perm_data_setting</i></span>
                        <span class="sb-cn">{{item.name}}</span>
                    </template>
                    <el-menu-item v-for="(menu,cindex) in item.menus " :key="cindex" :index="menu.path">{{menu.name}}</el-menu-item>
                </el-submenu>
            </el-row>

            <el-submenu index="3">
                <template slot="title">
                    <span class="sb-icon"><i class="material-icons">pie_chart</i></span>
                    <span class="sb-cn">charts</span>
                </template>
                <el-menu-item index="echarts"> echarts</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <span class="sb-icon"><i class="material-icons">content_paste</i></span>
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
                    <span class="sb-icon"><i class="material-icons">border_all</i></span>
                    <span class="sb-cn">表格</span>
                </template>
                <el-menu-item index="list">基础表格</el-menu-item>
                <el-menu-item index="filter">筛选表格</el-menu-item>
                <el-menu-item index="expand">展开表格</el-menu-item>
                
            </el-submenu>
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
    
  },
  mounted() {
      console.log(this.menus)
  }
};
</script>
<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 200px;
  left: 0;
  top: 66px;
  bottom: 0;
  background: #324157;
}
.sidebar > ul {
  height: 100%;
}

.el-menu-item,
.el-submenu__title {
  font-size: 14px;
}

.material-icons {
  font-size: 12px;
}
</style>
