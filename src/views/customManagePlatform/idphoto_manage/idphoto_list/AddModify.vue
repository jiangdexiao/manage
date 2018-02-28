<template>
  <div class="list">
    <div class="message">
      <div class="mess">
        <el-form ref="form" :model="Info" :rules="formRules" label-width="150px">
        <el-row :gutter="20">
          <el-col :span="24">
            <h4>基本信息</h4>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="规格名称：" prop="specsName">
              <el-input v-model="Info.specsName" placeholder="请输入证件照规格名称（1~30个中文）" :maxlength="30" :minlength="1" style="width:95%" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类：" prop="sortId">
              <el-select v-model="Info.sortId" placeholder="请选择证件照分类名称" clearable style="min-width: 100%">
                <el-option v-for="(item,i) in sortAdmin" :key='i' :label="item.sortName" :value="item.sortId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="">

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">

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
            <el-form-item label="照片高度：" prop="photoHight">
              <el-input type="number"  placeholder="请输入证件照片高度（mm，正整数）" v-model="Info.photoHight" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="照片宽度：" prop="photoWidth">
              <el-input type="number" placeholder=" 请输入证件照片宽度（mm，正整数）" v-model="Info.photoWidth" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="脸颊宽度：" prop="photoFaceWidth">
              <el-input type="number" placeholder=" 请输入证件照脸颊宽度（mm，正整数）" v-model="Info.photoFaceWidth" min="0" style="width:95%"></el-input>
              <el-tooltip content="脸部最宽距离,下同。" placement="bottom-start"><i class="el-icon-question"></i></el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头顶距离：" prop="photoHeadMargin">
              <el-input type="number"  placeholder="请输入证件照头顶距离（mm，正整数）" v-model="Info.photoHeadMargin" min="0" style="width:95%"></el-input>
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
            <el-form-item label="图像高度：" prop="cutHight">
              <el-input type="number" placeholder="请输入图像高度（px，正整数）" v-model="Info.cutHight" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图像宽度：" prop="cutWidth">
              <el-input type="number" placeholder=" 请输入图像宽度（px，正整数）" v-model="Info.cutWidth" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="脸颊宽度：" prop="cutFaceWidth">
              <el-input type="number" placeholder="请输入脸颊宽度（px，正整数）" v-model="Info.cutFaceWidth" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头顶距离：" prop="cutHeadHight">
              <el-input type="number" placeholder=" 请输入头顶距离（px，正整数）" v-model="Info.cutHeadHight" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="眼部距离：" prop="cutEyeDistance">
              <el-input type="number"  placeholder=" 请输入眼部距离（px，正整数）" v-model="Info.cutEyeDistance" min="0" style="width:95%"></el-input>
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
        <el-form ref="color" :model="color" :rules="colorRule" label-width="150px">
          <el-col :span="12">
            <el-form-item label="底色：" prop="colorIds" >
              <el-checkbox-group v-model="color.colorIds">
                <el-checkbox v-for="(item,i) in colorAdmin" :key="i" :label="item.colorId"  style="line-height:50px;width:48%;margin-left:0px;" @change="change(i)">
                  {{tool.str.textLength(item.colorName,4)}}
                  <el-input  style="width:60%;margin-left:5px;" placeholder= "请输入证件照ID"v-model="item.outerId" ></el-input>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="格式：" prop="formats">
              <el-checkbox-group v-model="color.formats">
                <el-checkbox v-for="foramt in formatOptions" :label="foramt" :key="foramt">{{foramt}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-form>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="分辨率：" prop="resolution">
              <el-input type="number" placeholder="请输入分辨率（dpi，正整数）" v-model="Info.resolution" min="0" style="width:95%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要回执：" prop="isChecked">
              <el-radio-group v-model="Info.isChecked">
                <el-col :span="12">
                  <el-radio :label="1" style="line-height:50px;">是</el-radio>
                </el-col>
                <el-col :span="12" >
                  <el-radio :label="0" style="line-height:50px;margin-right:30px;">否</el-radio>
                </el-col>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="display:inline;">
            <el-form-item label="文件大小：" prop="other">
              <el-col :span="9">
                <el-form-item hidden><el-input v-model="Info.other" hidden></el-input></el-form-item>
                <el-form-item prop="minSize">
                  <el-input type="number" placeholder="请输入最低值（KB，正整数）" min="0" v-model="Info.minSize"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2"><h6 style="text-align:center;line-height:50px;">-</h6></el-col>
              <el-col :span="9">
                <el-form-item prop="maxSize">
                  <el-input type="number" placeholder="请输入最高值（KB，正整数）" min="0" max="999" v-model="Info.maxSize"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="12" scope="scope">
            <el-form-item label="最后更新时间：" v-if="!isAdd">
              <el-input  v-model="uTime" style="width:95%" disabled></el-input>
            </el-form-item>
          </el-col>
          </el-row>
            <el-row scope="scope">
              <el-col :span="12">
                <el-form-item label="添加时间：" v-if="!isAdd">
                  <el-input  v-model="uTime" style="width:95%" disabled></el-input>
                </el-form-item>
              </el-col>

            </el-row>

        <el-row >
          <el-col :span="24">
            <el-form-item label="备注：" >
              <el-input type="textarea" :rows="5"  placeholder="请输入备注信息（100字符以内）" v-model="Info.note" style="width:97.5%" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="" >
              <el-button type="primary" size="medium" @click="submitModify()" :disabled="disab" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
              <router-link :to="{name:'custom_idphoto'}">
                <el-button size="medium">取消</el-button>
              </router-link>
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

      const numValue = (rule,value,callback)=>{
        if(value == undefined || value == "") {
          callback();
        } else {
          if(/^[0-9]*[1-9][0-9]*$/i.test(value)){
            if(value > 999) {
              callback(new Error('请输入999以内的整数'))
            } else {
              callback()
            }
          }else{
            callback(new Error('请输入正整数'))
          }
        }
      }

      const specs_name = (rule,value,callback)=>{
        if(value == undefined || value == null) {
          callback();
        } else {
          if(/^[\u4E00-\u9FA5]+$/i.test(value.trim())){
            callback()
          }else{
            callback(new Error('只能输入中文'))
          }
        }

      }

      const sizeValue = (rule, value, callback)=>{
        let min = this.Info.minSize;
        let tmp = parseInt(value) < parseInt(min);
        if(value && min && tmp){
          let max = value;
              callback(new Error('文件大小最大值不能小于最小值'))
          }else{
              callback()
          }
      }

      const outerIdValid = (rule,value,callback) => {
        let tmp = true
        let len = this.colorAdmin.length
        this.colorAndOutIds = []
        this.colorAndOutId = {}
        for(let i= 0; i < len; i++) {
          let checked = this.colorAdmin[i].checked
          let outId = this.colorAdmin[i].outerId
          let res = this.colorAdmin[i]
          if (checked && (outId == "" || outId == undefined)) {
            tmp = false
          }
          if(checked) {
            this.colorAndOutId.colorId = res.colorId
            this.colorAndOutId.outerId = res.outerId
            this.colorAndOutIds.push(this.colorAndOutId)
            this.colorAndOutId = {}
          }
        }
        if(!tmp) {
          callback(new Error('请输入对应的证件照ID'))
        } else {
          callback()
        }
        console.log(11111111111)
        console.log(this.colorAndOutIds)
      }

      return {
        fullscreenLoading:false,
        formatOptions : ['JPG', 'JPEG', 'PNG', 'BMP'],
        Info:{
          minSize:'',
          maxSize:'',
          other:"aa"
        },
        color:{
          colorIds:[],
          formats:[],
        },
        outerId:"",
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
          colorIdAndOuterIds:[]
        },
        uTime:"",
        cTime:"",
        sortAdmin:{},
        colorAdmin:[],
        colorAndOutId:{
          colorId:"",
          outerId:""
        },
        colorAndOutIds:[],
        isAdd:this.$route.query.specsId ? false : true,//新增标识
        specsId:this.$route.query.specsId,
        disab:false,
        formRules:{
          specsName: [
            { required: true, message: "请输入规格名称", trigger: "blur" },
            {validator:specs_name,trigger: "blur"},
          ],
          sortId: [{ required: true, message: "请选择分类", trigger: "change" }],
          photoHight: [
            { required: true, message: "请输入照片高度", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
            ],
          photoWidth: [
            { required: true, message: "请输入照片宽度", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
          ],
          cutHight: [
            { required: true, message: "请输入图像高度", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
            ],
          cutWidth: [
            { required: true, message: "请输入图像宽度", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
          ],
          resolution: [
            { required: true, message: "请输入分辨率", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
            ],
          isChecked: [
            { required: true, message: "请选择是否需要回执", trigger: "change" },
            ],
          minSize: [
            { required: true, message: "请输入文件大小最小值", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
          ],
          other: [
            { required: true, message: ""},
          ],
          maxSize: [
            { required: true, message: "请输入文件大小最大值", trigger: "blur" },
            {validator:numValue,trigger: "blur"},
            {validator:sizeValue,trigger: "blur"},
          ],
          photoFaceWidth :[
            {validator:numValue,trigger: "blur"}
          ],
          photoHeadMargin :[
            {validator:numValue,trigger: "blur"}
          ],
          cutFaceWidth :[
            {validator:numValue,trigger: "blur"}
          ],
          cutHeadHight :[
            {validator:numValue,trigger: "blur"}
          ],
          cutEyeDistance :[
            {validator:numValue,trigger: "blur"}
          ],

        },
        colorRule:{
          colorIds:[
            { required: true, message: "请选择底色", trigger: "change"},
            { validator:outerIdValid,trigger:"blur"}
            ],
          formats:[{ required: true, message: "请选择格式", trigger: "change"}]
        }

      }
    },
    methods: {
      change(i) {
        if(this.colorAdmin[i].checked) {
          this.colorAdmin[i].checked = false
        }else{
          this.colorAdmin[i].checked = true
        }
        console.log(this.color.colorIds[i])
        console.log(this.colorAdmin)
      },
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
        this.specsInfo.cutEyeDistance = this.Info.cutEyeDistance;
        this.specsInfo.colorId = this.color.colorIds.join();
        this.specsInfo.idphotoFormat = this.color.formats.join();
        this.specsInfo.resolution = this.Info.resolution;
        this.specsInfo.isChecked = this.Info.isChecked;
        this.specsInfo.minSize = this.Info.minSize;
        this.specsInfo.maxSize = this.Info.maxSize;
        this.specsInfo.note = this.Info.note;
        console.log(this.colorAdmin)
        //保存
        this.save();

      },

      save() {
        this.$refs.form.validate(valid => {
          let that = this;
          if (valid & this.validColor()) {
            this.disab = true;
            this.fullscreenLoading = true;
            this.specsInfo.colorIdAndOuterIds = JSON.stringify(this.colorAndOutIds)
            if(this.isAdd){
              this.api_customManagePlatform_addSpecs({data:this.specsInfo}).then(res=>{
                setTimeout(function () {
                  this.fullscreenLoading = false;
                  that.$router.push({name:'custom_idphoto'});
                },1500)
              }).catch(()=>{
                this.fullscreenLoading = false;
                this.disab = false;
              });
            } else {
              this.specsInfo.specsId = this.Info.specsId;
              this.api_customManagePlatform_modifySpecs({data:this.specsInfo}).then(res=>{
                setTimeout(function () {
                  this.fullscreenLoading = false;
                  that.$router.push({name:'custom_idphoto'});
                },1500)

              }).catch(()=>{
                this.fullscreenLoading = false;
                this.disab = false;
              });
            }
          } else {
            return false;
          }

        });
      },

      validColor() {
        let tmp;
        this.$refs.color.validate(valid => {
          tmp = valid;
        });
        return tmp;
      },

      //获取底色ID数组
      getColorIds(arr) {
        let i;
        for(i=0;i<arr.length;i++) {
          this.color.colorIds.push(arr[i]);
        }
      },
      //如果是修改则初始化详情
      init (){
        if(!this.isAdd) {
          this.api_customManagePlatform_idphotoList({data:{specsId:this.specsId}}).then(res=>{
            this.Info = res.content[0];
            let colors = this.Info.idPhotoSpecsColorInfo;
            let len = this.colorAdmin.length;
            for(let i = 0; i < colors.length; i++) {
              this.color.colorIds.push(colors[i].colorId)
              for(let j = 0 ; j < len; j++) {
                if(colors[i].colorId == this.colorAdmin[j].colorId) {
                  this.colorAdmin[j].outerId = colors[i].outerSpecsId;
                  this.colorAdmin[j].checked = true;
                }
              }
            }
            //this.color.colorIds = this.Info.colorIds ? this.Info.colorIds.split(",") : [];
            this.Info.other = "aa"
            this.color.formats = this.Info.format ? this.Info.format.split(",") : []
            this.uTime = this.Info.lastUpdatedTime ? tool.date.format(this.Info.lastUpdatedTime, "yyyy-MM-dd hh:mm:ss") : ""
            this.cTime = this.Info.createdTime ? tool.date.format(this.Info.createdTime, "yyyy-MM-dd hh:mm:ss") : ""

            console.log(this.colorAdmin)
          }).catch(()=>{

          });
        }
      },



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


</style>

