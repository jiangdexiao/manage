<template>
    <div class="header">
        <el-row :gutter="10">
            <!--Logo area-->
            <el-col :xs="10" :sm="10" :md="4">
                <div class="logo">  
                    <i class="logo_image"></i>
                    <span class="logo_prefix">拍获 |</span><span class="logo_suffix">&nbsp;{{title}}</span>
                </div>
            </el-col>

            <!-- <el-col :xs="8" :sm="{span:4,offset:6}" :md="{span:2,offset: 14}" >
                <div class="header-right">
                   
                </div>
            </el-col> -->
            <el-col :xs="{span:8,offset:6}" :sm="{span:6,offset:8}" :md="{span:4,offset: 16}"  >
                <div class="user-header">
                    <el-col :xs="16" :sm="18" :md="20" style="text-align:right;padding-right:15px;" >
                        <el-dropdown trigger="click" menu-align="start">
                          <span style="width:150px;">您好{{userName}}<i class="el-icon-arrow-down"></i></span>
                          <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item >
                                  <div class="setting-div" @click="viewPersonInfo">
                                      <span class="setting-string"><i class="iconfont icon-user"></i>个人信息</span>
                                  </div>
                              </el-dropdown-item>
                              <el-dropdown-item >
                                  <div class="setting-div" @click="setPassword" >
                                      <span class="setting-string"><i class="iconfont icon-mima"></i> 修改密码</span>
                                  </div>
                              </el-dropdown-item>
                          </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4">
                      <el-button type="text" style="color:#fff" @click="loginout">退出</el-button>
                    </el-col>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props:{
    title:{
      type:String
    },
    userName:{
      type:String
    },
    token:{
      type:String
    }
  },
  methods: {
    loginout(){
       this.$confirm('确定退出吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.api_user_loginout({data:{ token:this.token } }).then(res=>{
              sessionStorage.clear()
              this.tool.cookie.delCookie('access_token')
              this.tool.cookie.delCookie('auth')
              this.$router.push({path:'/login'})
            })
        }).catch(() => {
      
        });
    },
    setPassword(){
      this.$emit('setPassword',true)
    },
    viewPersonInfo(){
      this.$emit('viewPersonInfo',true)
    }
  }
};
</script>
<style scoped>
.header {
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 60px;

  font-size: 14px;
  line-height: 60px;
  background-image: linear-gradient(-269deg, #2F9CFF 0%, #0086FF 44%, #0078E4 100%);
  /* background-color: #324157; */
  box-shadow: 2px 0 3px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 0 32px 0 40px;
  overflow: hidden;
}
.header .logo {
  float: left;
  padding-left:2rem;
  cursor: pointer;
  font-size:20px;
  font-weight:600;
}
.logo_image{
  position: absolute;
  width:2rem;
  height: 1.88rem;
  top:1.21rem;
  left:-0.1rem;
  background:url('../../../../static/images/logo.png') no-repeat;
}

.logo_prefix {
  color: #fff;
}
.logo_suffix {
  color: #fff;
  font-size: 16px;
}
.header .search {
  float: left;
  color: #fff;
  font-size: 14px;
}
.website span {
  display: inline-block;
  color: #209e91;
}
.website span:first-child {
  color: #fff;
}
.header-right {
  /* padding-top: 25px; */
  height: 66px;
  line-height: 66px;
}
.header-right span {
  /* display: inline-block; */
  margin-left: 14px;
  font-size: 18px;
  color: #fff;
  /* line-height: 1px; */
  height: 18px;
  cursor: pointer;
}

.user-header {
  /* line-height: 10px; */
  /* padding-top: 7px; */
  font-size: 18px;
  color: #fff;
  font-size: 14px;
}
.user-header span{
  font-size: 18px;
  color: #fff;
  font-size: 14px;
}
.user-header span:hover{
  cursor: pointer;
}
.user-header img {
  border-radius: 50%;
  cursor: pointer;
}
.user-header a{
  cursor: pointer;
  display:inline-block;
  width:60px;
}
.pop-image {
  display: block;
  float: left;
}
.pop-image img {
  border-radius: 50%;
}
.pop-div {
  height: 55px;
  clear: both;
}
.pop-content {
  display: block;
  font-size: 12px;
  line-height: 14px;
  padding-top: 15px;
  margin-left: 60px;
}
.pop-time {
  display: block;
  float: right;
  font-size: 10px;
  color: #ccc;
}
.pop-title {
  font-size: 12px;
  color: #209e91;
}
.task-div {
  clear: both;
  height: 55px;
}
.task-span {
  display: block;
  float: left;
  font-size: 12px;
}

.task-content {
  width: 160px;
  line-height: 16px;
  margin-left: 10px;
  padding: 5px;
}
.task-time {
  clear: both;
  float: right;
  color: #ccc;
}
.setting-div {
  height: 30px;
  line-height: 30px;
  clear: both;
}
.setting-div span {
  display: block;
  float: left;
  font-size: 12px;
}
.setting-icon {
  padding-top: 3px;
  padding-right: 3px;
}
/* .pull_nav_set {
  top: 24px;
  background: url("../assets/images/ico_header_set.png") no-repeat;
}
.pull_nav_modify {
  top: 64px;
  background: url("../assets/images/ico_header_password.png")
    no-repeat;
} */
</style>
