<template>
  <div class="list">
    <div class="message">
      <div class="mess">
        <el-form :model="Info"  label-width="150px">
        <el-row :gutter="20">
          <el-col :span="24">
            <h4>基本信息</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="规格名称：">
              <span>{{Info.specsName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类：">
              <span >{{Info.sortName}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>打印尺寸（毫米mm）</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="照片高度：">
              <span>{{Info.photoHight ? Info.photoHight + ' mm' : " - "}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="照片宽度：">
              <span>{{Info.photoWidth ? Info.photoWidth + ' mm': " - "}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="脸颊宽度：">
              <span>{{Info.photoFaceWidth ? Info.photoFaceWidth + ' mm': " - "}}</span>
              <el-tooltip content="脸部最宽距离,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头顶距离：">
              <span>{{Info.photoHeadMargin ? Info.photoHeadMargin + " mm" : " - "}}</span>
              <el-tooltip content="头顶发际线距离图像上边缘,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>裁切规格（像素px）</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图像高度：">
              <span>{{Info.cutHight ? Info.cutHight + " px" : " - "}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图像宽度：">
              <span>{{Info.cutWidth ? Info.cutWidth + " px" : " - "}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="脸颊宽度：">
              <span>{{Info.cutFaceWidth ? Info.cutFaceWidth + " px" : " - "}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头顶距离：">
              <span>{{Info.cutHeadHight ? Info.cutHeadHight + " px" : " - "}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="眼部距离：">
              <span>{{Info.cutEyeDistance ? Info.cutEyeDistance + " mm" : " - "}}</span>
            <el-tooltip content="双眼距图像下边缘,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>其他信息</h4>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="底色：">
              <span>{{Info.colorName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="格式：">
              <span>{{Info.format}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="分辨率：">
              <span>{{Info.resolution}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要回执：">
              <span>{{Info.isChecked == 1 ? "是" : "否"}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="display:inline;">
            <el-form-item label="文件大小：">
                <span>{{Info.minSize ?  Info.minSize + " kb" : ""}}</span>
                <span>{{Info.maxSize ? " ~ " + Info.maxSize + " kb" : "" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="display:inline;">
            <el-form-item label="最后修改时间：">
              <span>{{Info.lastUpdatedTime ? tool.date.format(Info.lastUpdatedTime, "yyyy-MM-dd hh:mm:ss") : ""}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="display:inline;">
            <el-form-item label="添加时间：">
                <span>{{Info.createdTime ? tool.date.format(Info.createdTime, "yyyy-MM-dd hh:mm:ss") : ""}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" style="display:inline;">
            <el-form-item label="备注：">
                <span>{{Info.note}}</span>
            </el-form-item>
          </el-col>
        </el-row>


        </el-form>
      </div>

    </div>

  </div>
</template>
<script>
  import {tool} from '../../../../utils/'
  export default {
    data() {
      return {
        Info:{},
        specsId:this.$route.query.specsId,
      }
    },
    methods: {
      //如果是修改则初始化详情
      init (){
        if(!this.isAdd && this.specsId != "" && this.specsId != undefined) {
          this.api_customManagePlatform_idphotoList({data:{specsId:this.specsId}}).then(res=>{
            this.Info = res.content[0];
            let colors = this.Info.idPhotoSpecsColorInfo;
            let colorNameOutIds = [];
            for(let i = 0; i < colors.length; i++) {
              colorNameOutIds.push(colors[i].colorName + "(ID:" + colors[i].outerSpecsId + ")");
            }
            this.Info.colorName = colorNameOutIds.join(", ")
          }).catch(()=>{

          });
        }
      },
    },


    mounted() {
      this.init();
    },

  }
</script>
<style lang="scss" scoped>
  .message {
    position: relative;
    width: 100%;
    min-height: 800px;
    background-color: #fff;
    z-index: 3;
    top: 0;
    left: 0;
    .mess {
      margin-top: 0px;
      padding: 0px 40px;
      padding-bottom: 30px;
      background: #fff;
      .el-input {
        width: 100%;
        margin: 10px 0;
      }
      h4 {
        line-height: 50px;
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
      }
    }
  }
  .alginRight {
    text-align: right;
    line-height: 30px;
    color: #666;
  }
  *{box-sizing:border-box;}
  h3,h4,h5,h6{font-weight:normal;}
  label{font-weight: normal;}

</style>

