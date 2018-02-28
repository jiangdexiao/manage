<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" :title="form.mresId?'编辑广告位':'新增广告位'" @close="handleClose" :visible.sync="show_edit_dialog" :close-on-click-modal= "false" >
            <el-form ref="form" :model="form"  :rules="formRules" label-width="150px" >
                <el-form-item label="所属媒体" prop="mediaId" >
                    <el-select v-model="form.mediaId" filterable remote placeholder="请选择所属媒体"  clearable :remote-method="getMediaList" @change="getAaddress" :loading="loading" >
                        <el-option v-for="(item,i) in mediaList" :key="i" :title="item.mediaName" :label="item.mediaName" :value="item.mediaId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位名" prop="mresName" >
                    <el-input :maxlength="40" v-model="form.mresName" ></el-input>
                </el-form-item>
                <el-form-item label="广告形式" prop="formId" >
                    <el-select v-model="form.formId" placeholder="请选择广告形式" clearable >
                      <el-option v-for="(item,i) in performenceList" :key="i" :label="item.formName" :value="item.formId">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!form.mresId" label="新增数量" prop="sum" >
                    <el-input :maxlength="3" v-model="form.sum" @keyup.native="form.sum=form.sum.replace(/[^\d]/g,'')" ></el-input>
                </el-form-item>
                <el-form-item v-if="form.mresId" label="广告位的条码值" prop="mresNo" >
                    <span>{{ form.mresNo }}</span>
                </el-form-item>
                <el-form-item label="广告位尺寸" required>
                    <el-radio-group v-model="mresType_radio" @change="mresTypeChange">
                      <el-radio :label="1">选择已有</el-radio>
                      <el-radio :label="2">自定义</el-radio>
                    </el-radio-group>
                    <el-col :span="24" v-if="mresType_radio=='2'">
                        <el-col :span="12">
                            <el-form-item prop="length">
                                <el-input v-model="form.length" :maxlength="5" placeholder="长"></el-input>mm
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item  prop="width">
                                <el-input v-model="form.width" :maxlength="5" placeholder="宽"></el-input>mm
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24" v-if="mresType_radio=='1'" >
                        <el-form-item prop="sizeInfo">
                            <el-select  v-model="form.sizeInfo" placeholder="请选择尺寸" clearable >
                                <el-option v-for="(size,i) in bannerSizeList" :value="size" :label="size" :key='i'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="广告位位置" prop="cate" >
                    <el-select  v-model="form.cate" placeholder="请选择广告位位置" clearable >
                        <el-option v-for="(item,i) in bannerCategoryList" :value="parseInt(item.dicCode)" :label="item.dicName" :key='i'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位状态" prop="useStatus" >
                    <el-select  v-model="form.useStatus" placeholder="请选择状态" clearable >
                        <el-option :value='2' label="上线中" ></el-option>
                        <el-option :value='1' label="下线"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性" prop="mediaType" >
                    <el-select v-model="form.mediaType" placeholder="请选择属性" clearable >
                        <el-option :value='1' label="视觉" ></el-option>
                        <el-option :value='2' label="听觉"></el-option>
                        <el-option :value='3' label="视听"></el-option>
                        <el-option :value='4' label="实物类"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="展现形式" prop="exhibitType" >
                    <el-select v-model="form.exhibitType" placeholder="请选择展现形式" clearable >
                      <el-option :value='1' label="图片"></el-option>
                      <el-option :value='2' label="视频"></el-option>
                      <el-option :value='3' label="音频"></el-option>
                      <el-option :value='4' label="实物"></el-option>
                      <el-option :value='5' label="现场"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地理位置" prop="tagAddr" >
                    <span>{{form.tagAddr}}<a @click="showMap">&nbsp;&nbsp;标注</a>  </span>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input type="textarea" v-model="form.remarks" :maxlength="200" ></el-input>
                </el-form-item> 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary"  @click="save" >保 存</el-button>
            </span>
        </el-dialog>
        <el-dialog  custom-class="dialog map-dialog" append-to-body :visible.sync="show_map_dialog">
            <EleMap :isShow="show_map_dialog" v-on:onSuccess="onMapSuccess" v-on:cancel="show_map_dialog=false"
                :adress='form.tagAddr' 
                :longitude='form.longitude' 
                :latitude='form.latitude'></EleMap>
        </el-dialog>
        <loadingComponent :showLoading="isShowLoading"></loadingComponent>
	</div>
</template>
<script>
import { EleMap } from '../../../../components/business/'
import loadingComponent from '../media_delivery/loading.vue'
import { mapState } from 'vuex'
export default {
  components:{EleMap,loadingComponent},
  data(){
      let tool = this.tool
      const rule_sum = (rule,value,callback)=>{
          if( !tool.validate.numRange(value,1,200) ){
            callback(new Error('新增数量为 1-200 之间的整数'))
          }else{
            callback()
          }
      }
      const rule_size = (rule,value,callback)=>{
        if(value < 10 ){
            callback(new Error('广告位尺寸最小为10mm'))
        }else if(value > 20000 ){
            callback(new Error('广告位尺寸最大为20000mm'))
        }else{
            callback()
        }
      }
      return {
          show_edit_dialog:false,
          loading: false,
          isShowLoading:false,
          form:{
              mresId:'',
              mediaId:'',//所属媒体
              mresName:'',//广告位名
              latitude:'',
              longitude:'',
              tagAddr:'',
              formId:'',//形式
              formName: "",
              mresNo:'',
              sizeInfo:'',
              width:'',
              length:'',
              cate:'',
              sum:'',//新增数量
              useStatus:'',
              mediaType:'',//属性
              exhibitType:'',//展现形式
              remarks:''
          },
          formRules:{
              mediaId:[
                  { required: true,message:'请选择媒体', trigger: 'change' }
              ],
              mresName:[
                  { required: true,message:'请输入广告位名', trigger: 'blur' },
                  { min:2,max:40,message:'请输入2到40位的广告位名', trigger: 'blur' },
              ],
              formId:[
                  { required: true,message:'请选择广告形式', trigger: 'change' }
              ],
              sum:[
                  { required: true,message:'请输入新增数量', trigger: 'blur' },
                  { validator: rule_sum, trigger: 'blur' },
              ],
              sizeInfo:[
                  { required: true,message:'请选择广告位尺寸', trigger: 'change' },
              ],
              length:[
                  { required: true,message:'请输入广告位长度', trigger: 'blur' },
                  { validator: rule_size, trigger: 'blur' },
              ],
              width:[
                  { required: true,message:'请输入广告位宽度', trigger: 'blur' },
                  { validator: rule_size, trigger: 'blur' },
              ],
              cate:[
                  { required: true,message:'请选择广告位位置', trigger: 'change' }
              ],
              useStatus:[
                  { required: true,message:'请选择广告状态', trigger: 'change' }
              ],
              mediaType:[
                  { required: true,message:'请选择属性', trigger: 'change' }
              ],
              exhibitType:[
                  { required: true,message:'请选择展现形式', trigger: 'change' }
              ],
              tagAddr:[
                  { required: true,message:'请标注地理位置', trigger: 'change' }
              ]
          },
          mresType_radio:1,
          mediaList:[],//媒体列表
          performenceList:[],//广告形式
          bannerSizeList:['210mm*297mm(A4)','176mm*250mm(B5)','150mm*100mm','1000mm*750mm','800mm*600mm','600mm*800mm','1024px*1024px','32-50寸'],//广告位尺寸
          bannerCategoryList:[],//广告位分类
          show_map_dialog:false,
      }
  },
  computed:{
      ...mapState(['prefix_18AD'])
  },
  methods:{
    onMapSuccess(mapObj){
        if( mapObj ){
            this.form.tagAddr = mapObj.adress
            this.form.latitude = mapObj.latitude
            this.form.longitude = mapObj.longitude
        }
        this.show_map_dialog = false
    },
    showMap(){
        this.show_map_dialog = true
    },
    getMediaList(query){
        if( query && query.length > 50 ){
            this.$message({type:'error',message:'输入不能超过50个字符'});return;
        }
        this.loading = true;
        this.api_mediaManagePlatform_mediaList({ data:{mediaName:query} }).then(res=>{
            this.loading = false;
            this.mediaList = res.content?res.content:[]
        })
    },
    getAaddress(){
        if(!this.form.mediaId) return
        this.api_mediaManagePlatform_mediaDetail({ pathParams:`/${this.form.mediaId}` }).then(res=>{
            this.form.latitude= res.content.latitude
            this.form.longitude= res.content.longitude
            this.form.tagAddr = res.content.tagAddr
        })
    },
    getPerformenceList(){
        this.api_mediaManagePlatform_formList().then(res=>{
            this.performenceList = res.content?res.content:[]
        })
    },
    getBannerCategoryList(){
        this.api_common_dicList({ data:{dicType:'mres_cate',token:sessionStorage.getItem('access_token')} }).then(res=>{
            this.bannerCategoryList = res.content?res.content:[]
        })
    },
    mresTypeChange(){
      if(this.mresType_radio == '1'){
        this.form.sizeInfo=''
      }else{
        this.form.length=''
        this.form.width=''
      }
    },
    handleClose(){
        this.tool.dp.clearData(this.form)
        this.show_edit_dialog = false
        this.$parent.show_edit_dialog = false
        this.$refs.form.resetFields()
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if( this.form && this.form.mresId ){
                  //编辑
                  this.api_mediaManagePlatform_mres({data:this.form,pathParams:`/${this.form.mresId}`,type:'put'}).then(res=>{
                      this.handleClose()
                      this.$emit('success',true)
                  })
              }else{
                  this.isShowLoading= true
                  //新增
                  this.api_common_mediaId({data:{prefix:this.prefix_18AD}}).then(data=>{
                    this.form.mresId = data.content
                    this.api_mediaManagePlatform_mres({data:this.form,type:'post'}).then(res=>{
                        this.handleClose()
                        this.$emit('success',true)
                        this.isShowLoading= false
                    }).catch(err=>{
                          this.form.mresId = ''
                          this.isShowLoading= false
                    })
                  })
              }
          }else{
              console.log('fail valid')
          }
        })
    }
  },
  mounted(){
      this.getPerformenceList()
      this.getBannerCategoryList()
  },
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Array
      }
  },
  watch:{
      isShow(v){
          this.show_edit_dialog = v
          if( v === true){
              this.mresType_radio = 1
              this.form = {
                    mresId:'',
                    mediaId:'',//所属媒体
                    mresName:'',//广告位名
                    latitude:'',
                    longitude:'',
                    tagAddr:'',
                    formId:'',//形式
                    formName: "",
                    mresNo:'',
                    sizeInfo:'',
                    width:'',
                    length:'',
                    cate:'',
                    sum:'',//新增数量
                    useStatus:'',
                    mediaType:'',//属性
                    exhibitType:'',//展现形式
                    remarks:'',
                    operateUserId:JSON.parse(sessionStorage.getItem('userInfo')).userId,
                    userType:3 //操作人类型后台管理员用户
                }
              if( this.data && this.data.length >0 ){
                  this.api_mediaManagePlatform_mresDetail({ pathParams:`/${this.data[0].mresId}` }).then(res=>{
                    this.form.mresId = res.content.mresId
                    this.form.mediaId = res.content.mediaId
                    this.form.mresName = res.content.mresName
                    this.form.latitude = res.content.latitude
                    this.form.longitude = res.content.longitude
                    this.form.tagAddr = res.content.tagAddr
                    this.form.formId = res.content.formId
                    this.form.formName = res.content.formName
                    this.form.mresNo = res.content.mresNo
                    this.form.cate = res.content.cate
                    this.form.useStatus = res.content.useStatus
                    this.form.mediaType = res.content.mediaType
                    this.form.exhibitType = res.content.exhibitType
                    this.form.remarks = res.content.remarks
                    this.getMediaList(res.content.mediaName)
                    if(this.data[0].sizeInfo==0){
                        this.form.sizeInfo = 0
                        this.mresType_radio = 2
                        this.form.length = res.content.length
                        this.form.width = res.content.width
                    }else{
                        this.mresType_radio = 1
                        this.form.sizeInfo = this.data[0].sizeInfo
                    } 
                  })
              }else{
                  this.form.sum = 1
                  this.getMediaList()
              }
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>