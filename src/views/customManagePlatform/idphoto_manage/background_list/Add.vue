<!--此页面为新增底色时跳页面的实现方式 , 现已改为模态框的实现方法,故此页面被注释掉了-->
<!--<template>
  <div class="list">
    <div class="mess">
      <el-row :gutter="20">
        <el-col :span="2" class="alginRight"><i class='red'><b>*</b></i> 底色名称：</el-col>
        <el-col :span="22">
          <el-input :maxlength="20" v-model="colorInfo.colorName" placeholder=" 请输入证件照底色名称(1-20字符)" style="width:40%"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" class="alginRight" style="align:middle"><i class='red'><b>*</b></i> 底色值：</el-col>
        <el-col :span="22">
          <el-input v-model="colorInfo.colorValue" placeholder=" 请输入色值（16进制）" style="width:40%"></el-input>
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
        colorInfo:[],
        disab:false,
      }
    },
    methods: {
      //取消按钮事件
      goBack() {
        this.$router.push({name:'custom_background'})
      },
      //保存
      save: function () {
        //判断输入的名称是否为空
        if (this.colorInfo.colorName == undefined || this.colorInfo.colorName.trim() == "") {
          this.$message({
            type: "warning",
            message: "请输入底色名称",
          });
          return;
        }
        //判断输入的色值是否为空
        if (this.colorInfo.colorValue == undefined || this.colorInfo.colorValue.trim() == "") {
          this.$message({
            type: "warning",
            message: "请输入底色值",
          });
          return;
        }
        //参数
        let option = {
          colorName: this.colorInfo.colorName.trim(),
          colorValue: this.colorInfo.colorValue.trim(),
        }
        this.disab = true;
        this.api_customManagePlatform_addcolor({data: option}).then(res => {
          //添加成功后返回到底色管理页面
          this.$router.push({name: 'custom_background'});
        }).catch(() => {
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
