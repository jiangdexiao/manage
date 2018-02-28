<!--此页面为新增分类时跳页面的实现方式 , 现已改为模态框的实现方法,故此页面被注释掉了-->
<!--<template>
  <div class="list">
    <div class="mess">
      <el-row :gutter="20" :span="12">
        <el-col :span="2" class="alginRight"><i class='red'><b>*</b></i> 分类名称：</el-col>
        <el-col :span="22">
          <el-input :maxlength="20" v-model="sortInfo.sortName" placeholder=" 请输入分类名称(1-20字符)" style="width:40%"></el-input>
        </el-col>
      </el-row>

      <el-row><p>&nbsp; </p></el-row>-->

      <!--保存取消-->
      <!--<el-row :gutter="20" margin-to="20px" :span="12">
        <el-col :span="12" :offset="2">
          <el-button type="primary " size="medium" @click="save()" :disabled="disab">保存</el-button>
          <el-button size="medium" @click="goBack()">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {tool} from '../../../../utils/'
  import md5 from "md5"

  export default {
    data() {
      return {
        sortInfo:[],
        disab: false,
      }
    },
    methods: {
      //取消按钮事件
      goBack() {
        this.$router.push({name:'custom_category'})
      },
      //保存
      save() {
        //判断输入的名称是否为空
        if(this.sortInfo.sortName == undefined || this.sortInfo.sortName.trim() == ""){
          this.$message({
            type:"warning",
            message:"请输入分类名称",
          });
          return;
        }
        this.disab=true;
        this.api_customManagePlatform_addsort({data:{sortName:this.sortInfo.sortName.trim()}}).then(res=>{
          //添加成功后返回到底色管理页面
          this.$router.push({name:'custom_category'});
        }).catch(()=>{
          this.disab = false;
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .mess {
    margin-top: 30px;
    .alginRight {
      text-align: right;
      line-height: 50px;
      color: #666;
    }
    .red {
      color: red;
      display: inline-block;
      padding-right: 6px;
      font-size: 12px;
      font-style: normal;
    }

  }
</style>-->
