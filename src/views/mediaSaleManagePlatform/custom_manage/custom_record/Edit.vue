<template>
  <div class="recorddialog edit-form">
      <el-dialog
        :title="form.recordId?'编辑备案客户':'新增备案客户'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="备案媒体名称" prop="recordName">
                        <el-input v-model="form.recordName" :maxlength="50" @blur="recordName_blur"></el-input>
                        <a @click="userRetrieval" >&nbsp;&nbsp;检索</a>
                    </el-form-item>
                    <el-form-item label="媒体分类" prop="cate">
                        <EleMediaCategory :selectVal="cates" v-on:selected="cate_CallBack"></EleMediaCategory>
                    </el-form-item>
                    <el-form-item label="关键词" prop="keywords">
                        <el-input type="textarea" v-model="form.keywords" :maxlength="210"></el-input>
                    </el-form-item>
                    <el-form-item label="地理位置" prop="tagAddr">
                        <span> {{form.tagAddr}}<a @click="showMap(1)">&nbsp;&nbsp;标注</a></span>
                    </el-form-item>
                    <el-form-item label="备案理由" prop="reason">
                        <el-input type="textarea" v-model="form.reason" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="新增BD专员" prop="createBdId">
                        <span>{{ getUser.bd.bdName+'/'+getUser.bd.account }}</span>
                    </el-form-item>
                    <el-form-item label="跟进BD专员" prop="handleBdId">
                        <el-select v-model="form.handleBdId" filterable remote placeholder="跟进BD专员"  clearable :remote-method="query_bdIdList" :loading="loading" >
                            <el-option v-for="(item,i) in handleBdList" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <h5 class="text_c" >完善客户资料</h5>
                    <el-form-item label="媒体名称" prop="mediaName">
                        <el-input v-model="form.mediaName" :maxlength="50" ></el-input>
                    </el-form-item>
                    <el-form-item label="地理位置" prop="mediaTagAddr">
                        <span> {{form.mediaTagAddr}}<a @click="showMap(2)">&nbsp;&nbsp;标注</a></span>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input type="textarea" v-model="form.address" :maxlength="100" ></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactName">
                        <el-input v-model="form.contactName" :maxlength="10" ></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="contactMobile">
                        <el-input v-model="form.contactMobile" :maxlength="20" ></el-input>
                    </el-form-item>
                    <el-form-item label="媒体分类" prop="mediaCate">
                        <EleMediaCategory :selectVal="medias" v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
                    </el-form-item>
                    <el-form-item label="资源描述" prop="describe">
                        <el-input type="textarea" v-model="form.describe" :maxlength="500" ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save" >保 存</el-button>
            </span>
      </el-dialog>
      <el-dialog  custom-class="dialog map-dialog" append-to-body :visible.sync="show_map_dialog">
        <EleMap :isShow="show_map_dialog" :option="map_optionNum" v-on:onSuccess="onSuccess" v-on:cancel="show_map_dialog=false"
            :adress='map_optionNum===1?form.tagAddr:form.mediaTagAddr' 
            :longitude='map_optionNum===1?form.longitude:form.mediaLongitude' 
            :latitude='map_optionNum===1?form.latitude:form.mediaLatitude'></EleMap>
    </el-dialog>
    <CustomList :isShow="show_userlist_dialog" :dataObj="user_form"></CustomList>
  </div>
</template>
<script>
import { EleMediaCategory,EleMap } from '../../../../components/business/'
import rules from '../../../../utils/rules/'
import { mapState ,mapGetters } from 'vuex'
import CustomList from './CustomList.vue'
export default {
  components:{EleMediaCategory,EleMap,CustomList},
  data(){
      let tool = this.tool
      let key = /^([\u4e00-\u9fa5-a-zA-Z-0-9]{2,10})([,，][\u4e00-\u9fa5-a-zA-Z-0-9]{2,10}){0,9}$/;
      const rule_keys = (rule,value,callback)=>{
          if( this.form.keywords && !key.test(this.form.keywords)){
              callback(new Error('每个关键词为2-10个字符，最多可以输入10个关键词，关键词之间用逗号分隔'))
          }else{
              callback()
          }
      }
      const rule_mobile = (rule,value,callback)=>{
          if( this.form.contactMobile && !tool.validate.mobileAndTel(this.form.contactMobile)){
              callback(new Error('联系电话格式不正确，请输入正确的固定电话或手机号'));
          }else{
              callback()
          }
      }
      const rule_recordName = (rule,value,callback)=>{
          if( this.form.recordName && this.form.recordName.length >= 5){
            this.api_mediaManagePlatform_checkRecordName({ data:{
                recordName:this.form.recordName,
                operateBdId:this.getUser.bd.bdId,
                recordId:this.form.recordId,
                rows:10,
                pageNum:1
            }}).then(res=>{
                if( res.content && res.content>0 ){
                    callback(new Error('客户备案已存在'))
                }else{
                    callback()
                }
            }).catch(err=>{
                callback(new Error('检测备案客户失败'))
            })
        }
      }
      return{
          form:{
            recordId:'',
            recordName:'',
            cate:'',
            keywords:'',
            tagAddr:'',
            longitude:'',
            latitude:'',
            reason:'',
            createBdId:'',
            handleBdId:'',
            mediaName:'',
            mediaTagAddr:'',
            mediaLongitude:'',
            mediaLatitude:'',
            address:'',
            contactName:'',
            contactMobile:'',
            mediaCate:'',
            describe:'',
            },
          formRules:{
              recordName: [
                { required: true,message:'备案媒体名称不能为空', trigger: 'blur' },
                { min: 5, max: 50, message: '备案媒体名称长度在5-50个字符', trigger: 'blur' },
                { validator: rule_recordName, trigger: 'blur' }
              ],
              cate:[
                   {required:true,message:'媒体分类不能为空，请至少选择两级',trigger: 'change'}
              ],
              mediaCate:[
                   {required:true,message:'媒体分类不能为空，请至少选择两级',trigger: 'change'}
              ],
              tagAddr:[
                  {required:true,message:'请标注地理位置',trigger: 'change'}
              ],
              keywords:[
                  { validator: rule_keys, trigger: 'change' }
              ],
              contactMobile:[
                { validator: rule_mobile, trigger: 'blur' }
              ]
          },
          map_optionNum: 1,//地图标注选项 1，2
          show_map_dialog: false,// 地图显示
          show_userlist_dialog:false,//客户列表
          loading: false,
          createBdList:[],
          handleBdList: [],
          medias:[],
          cates:[],
          optionPage:'add',
          user_form:{
              keyWords:''
          }
      }
  },
  props:['isShow','data'],
  computed:{
      ...mapState(['prefix_18RC']),
      ...mapGetters(['getUser'])
  },
  methods:{
    recordName_blur(){
        if(this.optionPage=='add'){
            this.form.mediaName = this.form.recordName 
        }
    },
    userRetrieval () {
        this.user_form.keyWords = this.form.recordName
        this.show_userlist_dialog= true
    },
    onSuccess(mapObj){
        if( mapObj ){
            if( mapObj.option === 1){
                this.form.tagAddr = mapObj.adress
                this.form.longitude = mapObj.longitude
                this.form.latitude = mapObj.latitude
                if(this.optionPage=='add' && this.form.mediaTagAddr==''){
                    this.form.mediaTagAddr = mapObj.adress
                    this.form.mediaLongitude = mapObj.longitude
                    this.form.mediaLatitude = mapObj.latitude
                }
            }else if( mapObj.option === 2){
                this.form.mediaTagAddr = mapObj.adress
                this.form.mediaLongitude = mapObj.longitude
                this.form.mediaLatitude = mapObj.latitude
            }
        }
        this.show_map_dialog = false
    },
    // 打开位置标注
    showMap(type) {
      this.show_map_dialog = true
      this.map_optionNum = type
    },
    query_bdIdList(query){
    //   if (!query || query == "") return;
    //   if( query.length > 50 ){
    //     this.$message('输入不能超过50个字符');return;
    //   }
      this.loading = true;
      this.api_mediaManagePlatform_bd({data:{keyWords:query,operateBdId:this.getUser.bd.bdId}}).then(res=>{
        this.loading = false;
        this.handleBdList = res.content
      })
    },
    //媒体分类
    EleMediaCategory_CallBack(val,valArr){
       this.form.mediaCate = valArr.length==2 ? val : ''
    },
    cate_CallBack(val,valArr){
       this.form.cate = valArr.length==2 ? val : ''
       if(this.optionPage=='add'){
           if(valArr.length==1){
               this.catesMedias = []
                this.catesMedias[0] = val
            }else if(valArr.length==2){
                this.catesMedias[1] = val
                this.form.mediaCate = val
                this.medias = this.catesMedias
            }
       } 
    },
    handleClose(){
        this.$parent.show_edit_dialog = false;
        this.$refs.form.resetFields();
        this.clear_param()
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if(!this.form.recordId){  
                  this.form.createBdId = this.getUser.bd.bdId
                this.api_common_mediaId({ data:{ prefix:this.prefix_18RC } }).then(res=>{
                    this.form.recordId = res.content
                    this.api_mediaManagePlatform_record({data:this.form,type:'post'}).then(res=>{
                        this.handleClose()
                        this.$emit('saveSuccess')
                    }).catch(err=>{
                        this.form.recordId = ''
                    })
                })
              }else{
                this.api_mediaManagePlatform_record({pathParams:`/${this.form.recordId}`, data:this.form, type:'put'}).then(res=>{
                    this.handleClose()
                    this.$emit('saveSuccess')
                })
              }
          }
        })
    },
    clear_param() {
        this.handleBdList= []
        this.medias= []
        this.cates= []
        this.tool.dp.clearData(this.form)
    }
  },
  watch:{
      isShow(v){
        if( v === true ){
            if( this.data && this.data.recordId){
                this.optionPage= 'modify';
                this.api_mediaManagePlatform_record({ pathParams:`/${this.data.recordId}`,data:{operateBdId:this.getUser.bd.bdId} }).then(res=>{
                    this.tool.dp.assignData(this.form, res.content)
                    if(res.content.parentCateCode)
                        this.cates.push(res.content.parentCateCode)
                    if(this.data.cateCode)
                        this.cates.push(res.content.cateCode)
                    if(this.data.mediaParentCateCode)
                        this.medias.push(res.content.mediaParentCateCode)
                    if(this.data.mediaCateCode)
                        this.medias.push(res.content.mediaCateCode)
                    this.query_bdIdList(res.content.handleBdName)
                })
            }else{
                this.query_bdIdList('')
                this.optionPage= 'add';
            }
        }
      }
  }
}
</script>
<style lang="scss" >
.recorddialog {
    .el-date-editor.el-input__inner {
        width: 220px !important;
    }
}
</style>
