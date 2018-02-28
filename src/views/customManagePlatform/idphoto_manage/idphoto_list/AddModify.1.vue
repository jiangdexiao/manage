<template>
  <div class="list">
    <div class="message">
      <div class="mess">

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>基本信息</h4>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>规格名称：</el-col>
            <el-col :span="18">
              <el-input v-model="Info.specsName" placeholder="请输入证件照规格名称"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>分类：</el-col>
            <el-col :span="18">
              <el-select v-model="Info.sortId" placeholder="证件照分类" clearable style="min-width: 100%">
                <el-option v-for="(item,i) in sortAdmin" :key='i' :label="item.sortName" :value="item.sortId"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>打印尺寸（毫米mm）</h4>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>照片高度：</el-col>
            <el-col :span="18">
              <el-input type="number"  placeholder="请输入证件照片高度（mm）" v-model="Info.photoHight"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>照片宽度：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder=" 请输入证件照片宽度（mm）" v-model="Info.photoWidth"></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><el-tooltip content="脸部最宽距离,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>&nbsp;脸颊宽度：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder=" 请输入证件照脸颊宽度（mm）" v-model="Info.photoFaceWidth"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><el-tooltip content="头顶发际线距离图像上边缘,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>&nbsp;头顶距离：</el-col>
            <el-col :span="18">
              <el-input type="number"  placeholder="请输入证件照头顶距离（mm）" v-model="Info.photoHeadMargin"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>裁切规格（像素px）</h4>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>图像高度：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入图像高度（px）" v-model="Info.cutHight"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>图像宽度：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入图像宽度（px）" v-model="Info.cutWidth"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight">脸颊宽度：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入脸颊宽度（px）" v-model="Info.cutFaceWidth"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight">头顶距离：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder=" 请输入头顶距离（px）" v-model="Info.cutHeadHight"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight">
              <el-tooltip content="双眼距图像下边缘,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>&nbsp;眼部距离：
            </el-col>
            <el-col :span="18">
              <el-input type="number"  placeholder=" 请输入眼部距离（px）" v-model="Info.cutEyeDdistance"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <h4>其他信息</h4>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight" ><i class="red">*</i>底色：</el-col>
            <el-col :span="18">
              <el-checkbox-group v-model="colorIds">
                <el-checkbox v-for="(color,i) in colorAdmin" :key="i" :label="color.colorId"  style="line-height:50px;width:20%;margin-left:0px;">{{color.colorName}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
          <el-col :span="12">
          <el-col :span="6" class="alginRight"><i class="red">*</i>格式：</el-col>
          <el-col :span="18" >
            <el-radio-group v-model="Info.format">
              <el-col :span="6" >
                <el-radio label="JPG" style="line-height:50px;margin-left:0px;width:25%;" >JPG</el-radio>
              </el-col>
              <el-col :span="6" >
                <el-radio label="PNG" style="line-height:50px;margin-left:0px;width:25%;">PNG</el-radio>
              </el-col>
              <el-col :span="6" >
                <el-radio label="JPEG" style="line-height:50px;margin-left:0px;width:25%;">JPEG</el-radio>
              </el-col>
              <el-col :span="6" >
                <el-radio label="BMP" style="line-height:50px;margin-left:0px;width:25%;">BMP</el-radio>
              </el-col>
            </el-radio-group>
          </el-col>
        </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>分辨率：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入分辨率（dpi）" v-model="Info.resolution"></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red">*</i>是否需要回执：</el-col>
            <el-col :span="18">
              <el-radio-group v-model="Info.isChecked">
                <el-col :span="12">
                  <el-radio :label="1" style="line-height:50px;">是</el-radio>
                </el-col>
                <el-col :span="12" >
                  <el-radio :label="0" style="line-height:50px;">否</el-radio>
                </el-col>
              </el-radio-group>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"><i class="red redTip">*</i>文件大小：</el-col>
            <el-col :span="18">
              <el-input type="number" placeholder="请输入最低值（KB）" style="width:35%" v-model="Info.minSize"></el-input>
              <i >~</i>
              <el-input type="number" placeholder="请输入最高值（KB）" style="width:35%" v-model="Info.maxSize"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-col :span="3" class="alginRight">备注：</el-col>
            <el-col :span="21">
              <el-input type="textarea" :rows="5"  placeholder="请输入备注信息" v-model="Info.note"></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="12">
            <el-col :span="6" class="alginRight"></el-col>
            <el-col :span="18" :offset="6">
              <el-button type="primary" size="medium" @click="submitModify()" :disabled="disab">保存</el-button>
              <router-link :to="{name:'custom_idphoto'}">
                <el-button size="medium">取消</el-button>
              </router-link>
            </el-col>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
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
        colorIds:[],
        specsInfo:{
          colorId:'',
          specsId:'',
          specsName:'',
          sortId:'',
          photoWidth:'',
          photoHight:'',
          photoFaceWidth:'',
          photoHeadMargin:'',
          cutWidth:'',
          cutHight:'',
          cutFaceWidth:'',
          cutHeadHight:'',
          cutEyeDistance:'',
          idphotoFormat:'',
          resolution:'',
          isChecked:'',
          minSize:'',
          maxSize:'',
          note:'',
        },
        sortAdmin:{},
        colorAdmin:[],
        isAdd:this.$route.query.isAdd,//新增标识
        specsId:this.$route.query.specsId,
        disab:false,
      }
    },
    methods: {
      //获取底色
      getColors() {
        this.api_customManagePlatform_getColors().then(res=>{
          this.colorAdmin = res.content ? res.content : {};
        });
      },
      //获取分类
      getSort() {
        this.api_customManagePlatform_initsort({data:{pageNum:0}}).then(res=>{
          this.sortAdmin = res.content ? res.content : {};
        });
      },
      //保存
      submitModify() {
        this.specsInfo.specsName = this.Info.specsName;
        this.specsInfo.sortId = this.Info.sortId;
        this.specsInfo.photoHight = this.Info.photoHight;
        this.specsInfo.photoWidth = this.Info.photoWidth;
        this.specsInfo.photoFaceWidth = this.Info.photoFaceWidth;
        this.specsInfo.photoHeadMargin = this.Info.photoHeadMargin;
        this.specsInfo.cutHight = this.Info.cutHight;
        this.specsInfo.cutWidth = this.Info.cutWidth;
        this.specsInfo.cutFaceWidth = this.Info.cutFaceWidth;
        this.specsInfo.cutHeadHight = this.Info.cutHeadHight;
        this.specsInfo.cutEyeDistance = this.Info.cutEyeDdistance;
        this.specsInfo.colorId = this.colorIds.join();
        this.specsInfo.idphotoFormat = this.Info.format;
        this.specsInfo.resolution = this.Info.resolution;
        this.specsInfo.isChecked = this.Info.isChecked;
        this.specsInfo.minSize = this.Info.minSize;
        this.specsInfo.maxSize = this.Info.maxSize;
        this.specsInfo.note = this.Info.note;
        //保存
        if(this.validFileds()){
          this.disab = true;
          if(this.isAdd){
            this.api_customManagePlatform_addSpecs({data:this.specsInfo}).then(res=>{
              this.$router.push({name:'custom_idphoto'});
            }).catch(()=>{
              this.disab = false;
            });
          } else {
            this.specsInfo.specsId = this.Info.specsId;
            this.api_customManagePlatform_modifySpecs({data:this.specsInfo}).then(res=>{
              this.$router.push({name:'custom_idphoto'});
            }).catch(()=>{
              this.disab = false;
            });
          }
        }

      },
      //获取底色ID数组
      getColorIds(arr) {
        let i;
        for(i=0;i<arr.length;i++) {
          this.colorIds.push(arr[i]);
        }
      },
      //如果是修改则初始化详情
      init (){
        if(!this.isAdd && this.specsId != "" && this.specsId != undefined) {
          this.api_customManagePlatform_idphotoList({data:{specsId:this.specsId}}).then(res=>{
            this.Info = res.content[0];
            this.getColorIds(this.Info.colorIds.split(","));
          }).catch(()=>{

          });
        }
      },

      validFileds() {
        if(this.Info.specsName == null || this.Info.specsName == undefined || this.Info.specsName.trim() == ""){
          this.$message({
            message:"规格名称不能为空",
            type:"warning",
          });
          return false;
        }
        if(this.Info.sortId == null || this.Info.sortId == undefined || this.Info.sortId.trim() == ""){
          this.$message({
            message:"请选择分类",
            type:"warning",
          });
          return false;
        }
        //照片高度
        if(this.Info.photoHight == null || this.Info.photoHight == undefined){
          this.$message({
            message:"请输入照片高度",
            type:"warning",
          });
          return false;
        }
        if(this.Info.photoHight <= 0) {
          this.$message({
            message:"照片高度数字必须大于零",
            type:"warning",
          });
          return false;
        }
        //照片宽度
        if(this.Info.photoWidth == null || this.Info.photoWidth == undefined){
          this.$message({
            message:"请输入照片宽度",
            type:"warning",
          });
          return false;
        }
        if(this.Info.photoWidth <= 0) {
          this.$message({
            message:"照片宽度数字必须大于零",
            type:"warning",
          });
          return false;
        }
        //图像高度
        if(this.Info.cutHight == null || this.Info.cutHight == undefined){
          this.$message({
            message:"请输入图像高度",
            type:"warning",
          });
          return false;
        }
        if(this.Info.cutHight <= 0) {
          this.$message({
            message:"图像高度数字必须大于零",
            type:"warning",
          });
          return false;
        }
        //图像宽度
        if(this.Info.cutWidth == null || this.Info.cutWidth == undefined){
          this.$message({
            message:"请输入图像宽度",
            type:"warning",
          });
          return false;
        }
        if(this.Info.cutWidth <= 0) {
          this.$message({
            message:"图像宽度数字必须大于零",
            type:"warning",
          });
          return false;
        }

        //底色
        if(this.colorIds == null || this.colorIds == undefined || this.colorIds.length == 0) {
          this.$message({
            message:"请选择底色",
            type:"warning",
          });
          return false;
        }
        //格式
        if(this.Info.format == null || this.Info.format == undefined || this.Info.format.trim() == "") {
          this.$message({
            message:"请选择格式",
            type:"warning",
          });
          return false;
        }
        //是否需要回执
        if(this.Info.isChecked == null || this.Info.isChecked == undefined) {
          this.$message({
            message:"请选择是否需要回执",
            type:"warning",
          });
          return false;
        }
        //分辨率
        if(this.Info.resolution == null || this.Info.resolution == undefined){
          this.$message({
            message:"请输入分辨率",
            type:"warning",
          });
          return false;
        }
        if(this.Info.resolution <= 0) {
          this.$message({
            message:"分辨率数字必须大于零",
            type:"warning",
          });
          return false;
        }
        if(this.Info.minSize == null || this.Info.minSize == undefined) {
          this.$message({
            message:"请输入文件最小值",
            type:"warning",
          });
          return false;
        }

        if (this.Info.maxSize == null || this.Info.maxSize == undefined) {
          this.$message({
            message:"请输入文件最大值",
            type:"warning",
          });
          return false;
        }
        if (this.Info.minSize < 0 || this.Info.maxSize <= 0 ) {
          this.$message({
            message:"文件大小数字必须大于零",
            type:"warning",
          });
          return false;
        }
        if(this.Info.minSize > this.Info.maxSize) {
          this.$message({
            message:"文件最小值不能大于最大值",
            type:"warning",
          });
          return false;
        }
        return true;
      }



    },


    mounted() {
      this.getSort();
      this.getColors();
      this.init();
    },

  }
</script>
<style lang="scss" scoped>
  .message {
    position: relative;
    width: 100%;
    min-height: 888px;
    background-color: #fff;
    z-index: 3;
    top: 0;
    left: 0;
    .mess {
      margin-top: 0px;
      padding: 0px 40px;
      padding-bottom: 50px;
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
    line-height: 50px;
    color: #666;
  }
  *{box-sizing:border-box;}
  h3,h4,h5,h6{font-weight:normal;}
  label{font-weight: normal;}
  select {
    width:100%;height:34px;border:solid 1px #d8dce5;font-size:14px;line-height:34px;border-radius:3px;margin-top:7px;color:#666;
    padding-right: 20px;padding-left:10px;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url('../../../../../static/images/sellerManage/ico_arrows.png') no-repeat scroll right center transparent;
  }
  div.icon{
    width:16px;height:16px; display:inline-block; position:relative;
    background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -848px -50px no-repeat;
  }

  i.red{
    color: red;display:inline-block;padding-right:6px;font-size:12px;
    font-style: normal;
  }
  i.redTip{
    padding-left:10px;
    padding-top:10px;
  }

</style>

