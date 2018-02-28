<template>
  <div class="edit-form">
      <el-dialog
        :title="type=='2'?'跟进备案客户':'修改备案客户'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal= "false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
                    <el-form-item label="已跟进次数">
                        <span>{{ form.followUpNumber}}次</span>
                    </el-form-item>
                    <el-form-item label="备案状态" prop="status">
                        <el-select v-model="form.status"  placeholder="选择备案状态"  clearable >
                            <el-option :value="1" label="备案中" ></el-option>
                            <el-option :value="2" label="备案失效"></el-option>
                            <el-option :value="3" label="签约成功"></el-option>
                            <el-option :value="4" label="已被其他签约"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进状态" prop="followUpStatus">
                        <el-select v-model="form.followUpStatus"  placeholder="选择跟进状态"  clearable >
                            <el-option :value="1" label="跟进中" ></el-option>
                            <el-option :value="2" label="未分派"></el-option>
                            <el-option :value="3" label="放弃跟进"></el-option>
                            <el-option :value="4" label="不需要跟进"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="跟进日期" >
                        <span>{{form.followUpTime}}</span>
                    </el-form-item>
                    <el-form-item label="跟进备注" >
                        <el-input type="textarea" v-model="form.followUpNote" :maxlength="140" ></el-input>
                    </el-form-item>
                    <el-form-item label="跟进BD专员">  
                        <span>{{form.handleBdName + ' ' + form.handleBdAccount}}</span>
                    </el-form-item>
                    <h5 class="text_c" >完善客户资料</h5>
                    <el-form-item label="媒体名称" >
                        <el-input v-model="form.mediaName"></el-input>
                    </el-form-item>
                    <el-form-item label="地理位置"  >
                        <span>{{form.mediaTagAddr}}<a @click="showMap">&nbsp;&nbsp;标注</a>  </span>
                    </el-form-item>
                    <el-form-item label="详细地址" >
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="form.contactName"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" >
                        <el-input v-model="form.contactMobile" :maxlength="20" ></el-input>
                    </el-form-item>
                    <el-form-item label="媒体分类"  >
                        <EleMediaCategory :selectVal="medias" v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
                    </el-form-item>
                    <el-form-item label="资源描述" >
                        <el-input type="textarea" v-model="form.describe" :maxlength="140" ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save" >保 存</el-button>
            </span>
      </el-dialog>
      <el-dialog  custom-class="dialog map-dialog" append-to-body :visible.sync="show_map_dialog">
        <EleMap :isShow="show_map_dialog" v-on:onSuccess="onMapSuccess" v-on:cancel="show_map_dialog=false"
            :adress='form.mediaTagAddr' 
            :longitude='form.mediaLongitude' 
            :latitude='form.mediaLatitude'></EleMap>
    </el-dialog>
  </div>
</template>
<script>
import { EleMediaCategory ,EleMap} from '../../../../components/business/'
import { mapState,mapGetters } from 'vuex'
export default {
  components:{EleMediaCategory,EleMap},
  data(){

      return{
          form:{
            mediaLongitude: '',
            mediaLatitude: '',
            mediaTagAddr: '',
            parCate: '',
            mediaCate: '',
            describe: '',
            followUpNumber: '',
            followUpStatus: '',
            followUpTime: '',
            followUpNote: '',
            mediaName: '',
            contactName: '',
            contactMobile: '',
            recordId: '',
            handleBdAccount: '',
            handleBdName: '',
            followUpId: '',
            status: '',
            followUpBdId: '',
            address: ''
        },
          formRules:{
              status: [
                {required: true, message:'请选择备案状态',  trigger: 'blur' }
              ],
              followUpStatus: [
                { required: true,message:'请选择跟进状态', trigger: 'blur' },
              ]
          },
          medias:[],
          show_map_dialog:false
      }
  },
  props:['isShow','data','type'],
  computed:{
      ...mapState(['prefix_18FU']),
      ...mapGetters(['getUser'])
  },
  methods:{
    EleMediaCategory_CallBack(val){
        this.form.mediaCate = val
    },
    handleClose(){
        this.$parent.show_follow_dialog = false;
        this.$refs.form.resetFields();
        this.clear_param()
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if( this.form.recordId ){
                  if( this.type == '1'){//修改
                    this.api_mediaManagePlatform_record({pathParams:`/${this.form.recordId}`,data:this.form,type:'put'}).then(res=>{
                        this.handleClose()
                        this.$emit('saveSuccess')
                    })
                  }else{//跟进
                    this.api_common_mediaId({ data:{ prefix:this.prefix_18FU } }).then(res=>{
                        this.form.followUpId = res.content
                        this.api_mediaManagePlatform_record({pathParams:`/${this.form.recordId}`,data:this.form,type:'put'})
                        .then(res=>{
                            this.handleClose()
                            this.$emit('saveSuccess')
                        })
                    })
                  }
              }
          } 
        })
    },
    clear_param() {
        this.tool.dp.clearData(this.form)
        this.medias=[]
    },
    showMap(){
        this.show_map_dialog = true
    },
    onMapSuccess(mapObj){
        if( mapObj ){
            this.form.mediaTagAddr = mapObj.adress
            this.form.mediaLatitude = mapObj.latitude
            this.form.mediaLongitude = mapObj.longitude
        }
        this.show_map_dialog = false
    }
  },
  watch:{
      isShow(v){
          if( v === true ){
            if( this.data && this.data.recordId ){
                this.api_mediaManagePlatform_record({pathParams:`/${this.data.recordId}`}).then(result=>{
                    this.form = {
                        mediaLongitude: result.content.mediaLongitude,
                        mediaLatitude: result.content.mediaLatitude,
                        mediaTagAddr: result.content.mediaTagAddr,
                        parCate: result.content.mediaParentCateCode,
                        mediaCate: result.content.mediaCateCode,
                        describe: result.content.describe,
                        followUpNumber: this.data.followUpNumber,
                        followUpTime: this.tool.date.format(this.data.followUpTime, "yyyy-MM-dd hh:mm:ss"),
                        mediaName: result.content.mediaName,
                        contactName: result.content.contactName,
                        contactMobile: result.content.contactMobile,
                        recordId: this.data.recordId,
                        handleBdAccount: this.type=='1'?this.data.handleBdAccount:this.getUser.bd.account,
                        handleBdName:  this.type=='1'?this.data.handleBdName:this.getUser.bd.bdName,
                        followUpId: this.type=='1'?this.data.followUpId:'',//新增时候动态获取
                        status: this.type=='1'?this.data.recordStatus:1,
                        followUpStatus: this.type=='1'?this.data.followUpStatus:1,
                        followUpNote:  this.type=='1'?this.data.followUpNote:'',
                        followUpBdId: this.type=='1'?this.data.followUpBdId:this.getUser.bd.bdId,
                        address: result.content.address
                    }
                    if( result.content.mediaParentCateCode)
                        this.medias.push(result.content.mediaParentCateCode)
                    if( result.content.mediaCateCode)
                        this.medias.push(result.content.mediaCateCode)
                })
            }
        }
      }
  }
}
</script>

