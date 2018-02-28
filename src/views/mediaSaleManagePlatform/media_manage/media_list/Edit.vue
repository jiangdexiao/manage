<template>
  <div class="mediadialog edit-form">
      <el-dialog
        :title="form.mediaId?'修改媒体':'新增媒体'"
        custom-class='dialog'
        :visible.sync="show_edit_dialog"
        :close-on-click-modal= "false"
        @close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
                    <!-- <el-form-item label-width="0"> -->
                        <el-col :span="12" >
                            <el-form-item label="媒体名称" prop="mediaName">
                                <el-input v-model="form.mediaName" :maxlength="50" ></el-input>
                            </el-form-item>
                            <el-form-item label="地理位置" prop="tagAddr">
                                <span>{{form.tagAddr}}<a @click="showMap">&nbsp;&nbsp;标注</a>  </span>
                            </el-form-item>
                            <el-form-item label="详细地址" prop="detailAddr">
                                <el-input v-model="form.detailAddr" :maxlength="100" ></el-input>
                            </el-form-item>
                            <el-form-item label="联系人" prop="contactMan">
                                <el-input v-model="form.contactMan" :maxlength="10" ></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="contactTel">
                                <el-input v-model="form.contactTel" :maxlength="20" ></el-input>
                            </el-form-item>
                            <el-form-item label="媒体分类" prop="mediaCate">
                                <EleMediaCategory :selectVal="medias" v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
                            </el-form-item>
                            <el-form-item label="媒体等级" prop="level">
                                <p class="font_red">{{form.level==1 ?'A级' :form.level==2 ?'B级':form.level==3 ?'C级':form.level==4 ?'D级':''}}</p>
                            </el-form-item>
                            <el-form-item label="资源描述" prop="mresDisc">
                                <el-input type="textarea" v-model="form.mresDisc" :maxlength="500" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="营业面积" prop="busiArea">
                                <el-input v-model="form.busiArea" :maxlength="8" ><template slot="append">m²</template></el-input>
                            </el-form-item>
                             <el-form-item label="营业时间" prop="hourStart">
                                 <el-time-select placeholder="起始时间" :editable="false" style="width:200px;" v-model="form.hourStart" :picker-options="{ start: '00:00', step: '00:30', end: '23:30',maxTime:form.hourEnd}"></el-time-select>
                                 <el-time-select placeholder="结束时间" :editable="false" style="width:200px;" v-model="form.hourEnd" :picker-options="{ start: '00:00', step: '00:30', end: '23:30',minTime: form.hourStart}"></el-time-select>
                            </el-form-item>
                             <el-form-item label="高峰期" prop="busyInfo">
                                <el-input type="textarea" v-model="form.busyInfo" :maxlength="50" ></el-input>
                            </el-form-item>
                             <el-form-item label="平日人流" prop="workDayCusts">
                                <el-input v-model="form.workDayCusts" :maxlength="5" @keyup.native="form.workDayCusts = form.workDayCusts.toString().replace(/[^\d.]/g,'')" ><template slot="append">人</template></el-input>
                            </el-form-item>
                             <el-form-item label="周日人流" prop="weekDayCusts">
                                <el-input v-model="form.weekDayCusts" :maxlength="5" @keyup.native="form.weekDayCusts = form.weekDayCusts.toString().replace(/[^\d.]/g,'')"><template slot="append">人</template></el-input>
                            </el-form-item>
                             <el-form-item label="人均消费" prop="averageConsu">
                                <el-input v-model="form.averageConsu" :maxlength="8" ><template slot="append">元</template></el-input>
                            </el-form-item>
                             <el-form-item label="员工数量" prop="employeeNum">
                                <el-input v-model="form.employeeNum" :maxlength="5" @keyup.native="form.employeeNum = form.employeeNum.toString().replace(/[^\d.]/g,'')"><template slot="append">人</template></el-input>
                            </el-form-item>
                            <el-form-item label="餐桌数量" prop="tableNum">
                                <el-input v-model="form.tableNum" :maxlength="4" ><template slot="append">桌</template></el-input>
                            </el-form-item>
                            <el-form-item label="服务员数量" prop="waiterNum">
                                <el-input v-model="form.waiterNum" :maxlength="4" ><template slot="append">人</template></el-input>
                            </el-form-item>
                            <el-form-item label="卫生环境" prop="hygieneLevel">  
                                <el-select v-model="form.hygieneLevel" placeholder="请选择" clearable @change="getFormLevel('hygieneLevel',form.hygieneLevel)">
                                    <el-option label="良好" :value="1" ></el-option>
                                    <el-option label="一般" :value="2" ></el-option>
                                    <el-option label="较差" :value="3" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    <el-col :span="24">

                        <h5 class="text_c" >签约信息</h5>
                        <el-form-item label="合作方式" prop="cooperWay">
                            <el-select v-model="form.cooperWay" placeholder="请选择" clearable @change="cooperWayChange">
                                <el-option label="分成合作" :value="1" ></el-option>
                                <el-option label="租赁合作" :value="2" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同编号" prop="cooperNo">
                            <el-input  v-model="form.cooperNo" :maxlength="50" ></el-input>
                        </el-form-item>
                        <el-form-item label="起止时间" prop="time">
                            <el-date-picker @change="startChange"
                            :editable="false"
                                unlink-panels
                                v-model="form.time"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>   
                        </el-form-item>
                        <el-form-item label="生效时间" prop="effectDate">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.effectDate" ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="计费时间" prop="chargeDate" v-if="form.cooperWay==2">
                            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.chargeDate" @change="chargeChange"></el-date-picker>
                        </el-form-item>   
                        <el-form-item v-if="form.cooperWay==2">
                            <p>合约开始时间 <span class="font_red">{{iDays}}</span> 天后</p>
                        </el-form-item>
                        <el-form-item label="付款周期" prop="cycleNum" v-if="form.cooperWay==2">
                            <el-input v-model="form.cycleNum" :maxlength="2" ><template slot="append">个月</template></el-input>
                        </el-form-item>
                        <el-form-item label="广告位数量" prop="contractMresNum">
                            <el-input v-model="form.contractMresNum" ></el-input>
                        </el-form-item>
                        <el-form-item label="广告位位置" prop="mresCate">
                            <el-checkbox-group v-model="form.mresCate">
                                <el-checkbox v-for="(item,i) in adList" :key="i" :label="item.dicCode" name="mresCate">{{ item.dicName }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <h5 class="text_c" >媒体管理客户</h5>
                        <el-form-item label="设置管理员">
                            <span>{{ (admin.username?admin.username:'') + ' ' + (admin.mobile?admin.mobile:'') }}  <a @click="unBindUser" v-if="admin&&admin.userId">&nbsp;&nbsp;删除</a> </span>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" @click="showUserListDialog">绑定已有用户</el-button>
                            <el-button type="primary" @click="showUserAddDialog">新增用户并绑定</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save" >保 存</el-button>
            </span>
      </el-dialog>
      <el-dialog  custom-class="dialog map-dialog" append-to-body :visible.sync="show_map_dialog">
        <EleMap :isShow="show_map_dialog" v-on:onSuccess="onMapSuccess" v-on:cancel="show_map_dialog=false"
            :adress='form.tagAddr' 
            :longitude='form.longitude' 
            :latitude='form.latitude'></EleMap>
    </el-dialog>
    <UserList :isShow="show_userlist_dialog" @select="userSelectChange"></UserList>
    <EditUser :isShow="show_useradd_dialog" @select="userSelectChange"></EditUser>
  </div>
</template>
<script>
import { mapState ,mapGetters} from 'vuex'
import { EleMediaCategory,EleMap } from '../../../../components/business/'
import rules from '../../../../utils/rules/'
import UserList from '../../../mediaManagePlatform/media_manage/media_list/UserList.vue'
import EditUser from '../../../mediaManagePlatform/media_manage/media_list/EditUser.vue'
export default {
  components:{EleMediaCategory,EleMap,UserList,EditUser},
  data(){
      let _this = this
      let tool = this.tool
      const rule_copperNo = function(rule, value, callback){
        if (!value) {
          callback(new Error('合同编号不能为空'));
        }
        else if ( value.length < 2 ){
          callback(new Error('合同编号不能少于2位字符'));
        }
        else if ( tool.validate.isChinese(value) ){
          callback(new Error('合同编号不能包含汉字'));
        }else{
          callback()
        }
      }
      const rule_adCount = function(rule,value,callback){
          if( !tool.validate.numRange(value,1,10000) ){
            callback(new Error('广告位数量为 1-10000 之间的整数'))
          }else{
              callback()
          }
      }
      const rule_hlevel = function(rule,value,callback){
          if( !value ){
            callback(new Error(rule.msg))
          }else {
              _this.getFormLevel(rule.field,value)
              callback()
          }
      }   
      const rule_numOnly = function(rule,value,callback){
          if(rule.msg && !value && value!='0'){
              let msgs = rule.msg +'不能为空'
              callback(new Error(msgs))
          }else if( value && value!='0' && !tool.validate.numOnly(value) ){
            callback(new Error('请输入整数'))
          }else{
              if(rule.notGetLevel){
                  callback()
                  return
              }
              _this.getFormLevel(rule.field,value)
              callback()
          }
      }
      const rule_twoDecimal = function(rule,value,callback){
          if(rule.msg && !value){
              let msgs = rule.msg +'不能为空'
              callback(new Error(msgs))
          }else if(value && !tool.validate.money(value) ){
            callback(new Error('请输入整数或小数（小数最多两位）'))
          }else if(value>99999){
            callback(new Error('请输入0-99999之间的数'))
          }else{
              _this.getFormLevel(rule.field,value)
              callback()
          }
      }
      const rule_cycleNum = function(rule,value,callback){
          if( parseInt(value) >24){
            callback(new Error('付款周期为 0-24 之间的整数'))
          }else{
            callback()
          }
      }
      return{
          show_useradd_dialog:false,
          show_userlist_dialog:false,
          show_map_dialog:false,
          show_edit_dialog:false,
          admin:{},
          medias:[],//媒体分类数组
          bdList:[],
          adList:[],//广告位分类
          form:{
            mediaId:'',
            bdStaffId:'',
            mediaName:'',
            tagAddr:'',
            longitude: '',
            latitude:'',
            detailAddr:'',
            contactMan:'',
            contactTel:'',
            mediaCate:'',
            mresDisc:'',
            cooperWay:'',
            cooperNo:'',
            dateStart:'',
            dateEnd:'',
            effectDate:'',
            contractMresNum:'',
            mresCate:[],
            time:[],
            bdStaffNo: "",
            bdStaffName: "",
            level:'',//媒体等级
            busiArea:'',//营业面积
            hourStart:'',//营业时间
            hourEnd:'',
            busyInfo:'',
            workDayCusts:'',
            weekDayCusts:'',
            averageConsu:'',
            employeeNum:'',
            tableNum:'', 
            waiterNum:'', 
            hygieneLevel:'',
            chargeDate:'',
            cycleNum:''
         },
          formRules:{
              mediaName: [
                { required: true,message:'媒体名称不能为空', trigger: 'blur' },
                { min: 5, max: 50, message: '媒体名称长度在5-50个字符', trigger: 'blur' }
              ],
              tagAddr:[
                   {required:true,message:'地理位置不能为空',trigger: 'change'}
              ],
              detailAddr: [
                { required: true,message:'详细地址不能为空', trigger: 'change' }
              ],
              contactMan:[
                { required: true,message:'联系人不能为空', trigger: 'change' }
              ],
              contactTel:[
                 { required: true,message:'联系电话不能为空', trigger: 'change' },
                 { validator: rules.rule_mobile_tel, trigger: 'blur' }
              ],
              mediaCate:[
                 {  required: true,message: '媒体分类不能为空，请至少选择两级', trigger: 'blur' }
              ],
              mresDisc:[
                 {  required: true,message: '资源描述描述不能为空', trigger: 'blur' }
              ],
              bdStaffId:[
                 {  required: true,message: 'BD专员不能为空', trigger: 'blur' }
              ],
              cooperWay:[
                 {  required: true,message: '合作方式不能为空', trigger: 'blur' }
              ],
              cooperNo:[
                 {  required: true,message: '合同编号不能为空', trigger: 'blur' },
                 { validator: rule_copperNo, trigger: 'blur' }
              ],
              time:[
                 {  required: true,message: '有效时间不能为空', trigger: 'blur' }
              ],
              effectDate:[
                 {  required: true,message: '生效时间不能为空', trigger: 'blur' }
              ],
              chargeDate:[
                 {  required: true,message: '计费时间不能为空', trigger: 'blur' }
              ],
              contractMresNum:[
                 {  required: true,message: '广告位数量不能为空', trigger: 'blur' },
                 {  validator:rule_adCount, trigger: 'blur' },
              ],
              mresCate:[
                 {  required: true,message: '广告位位置不能为空', trigger: 'change' }
              ],
              level:[
                  {  required: true,message: '媒体等级不能为空', trigger: 'change' }
              ],
              busiArea:[
                  { required: true,validator: rule_twoDecimal, msg: '营业面积',trigger: 'change' }  
              ],
              workDayCusts:[
                  { required: true,validator: rule_numOnly, msg: '平日人流量',trigger: 'change' }  
              ],
              weekDayCusts:[
                  {validator: rule_numOnly, trigger: 'change' }  
              ],
              averageConsu:[
                  { required: true,validator: rule_twoDecimal, msg: '人均消费',trigger: 'change' }
              ],
              employeeNum:[
                  { required: true,validator: rule_numOnly, trigger: 'change' }  
              ],
              tableNum:[
                  { required: true,validator: rule_numOnly, msg: '餐桌数量',trigger: 'change' }  
              ],
              waiterNum:[
                  { required: true,validator: rule_numOnly, msg: '服务员数量',trigger: 'change' }  
              ],
              hygieneLevel:[
                  {  required: true,validator: rule_hlevel, msg: '卫生环境不能为空', trigger: 'change' }      
              ],
              cycleNum:[
                  { required: true,validator: rule_numOnly, msg: '付款周期',notGetLevel:true,trigger: 'change' },
                  { required: true,validator: rule_cycleNum, msg: '付款周期',trigger: 'change' },  
              ],
          },
          getLeveldata:{
            busiArea: '',
            averageConsu: '',
            tableNum:'',
            waiterNum: '',
            hygieneLevel: ''
          },
          iDays:'',
      }
  },
  computed:{
      ...mapState(['prefix_18MD']),
      ...mapGetters(['getUser'])
  },
  methods:{
      chargeChange() {
          this.iDays = 0
          if(!this.form.time.length){
              this.$message({ message: "请先选择起止时间！", type: "error" });
              this.form.chargeDate =''
                return
          }
          let cadt=new Date(this.form.chargeDate.replace("-","/")),
              stdt=new Date(this.form.time[0].replace("-","/")),
              etdt=new Date(this.form.time[1].replace("-","/"));
          if(cadt<stdt) {
            this.$message({ message: "计费时间不能小于起止时间的开始时间！", type: "error" });
            this.form.chargeDate =''
            return
          }
          if(cadt>etdt) {
            this.$message({ message: "计费时间不能大于起止时间的结束时间！", type: "error" });
            this.form.chargeDate =''
            return
          }
          this.iDays = this.tool.date.dateDiff(this.form.chargeDate,this.form.time[0])
      },
      startChange() {
          this.form.chargeDate=''
          this.iDays = 0
      },
      //时间+45天
      countChargeDate(){
          let date = new Date(Date.parse(this.form.time[0].replace(/-/g,"/"))); 
          date.setDate(date.getDate() + 45);
          this.form.chargeDate = this.tool.date.format(date, "yyyy-MM-dd")
          this.iDays = this.tool.date.dateDiff(this.form.chargeDate,this.form.time[0])
      },
      cooperWayChange() {
          if(this.form.cooperWay !=2){
              this.form.chargeDate=''
              this.form.cycleNum=''
          }else if(this.form.cooperWay ==2 && this.form.time.length){
              this.countChargeDate()
              this.form.cycleNum=3
          }else{
              this.form.chargeDate=''
              this.form.cycleNum=3
              this.iDays = 0
          }
      },
       //部分参数验证： 验证获取级别的参数 
    getFormLevel(name,val){ 
        if(name in this.getLeveldata && this.getLeveldata[name] !=val){
            this.getLeveldata[name] = val
        }else {
            return
        }
        let bool = true
        for( let key in this.getLeveldata){
           if(this.getLeveldata[key]==='') {
               bool =false
               return
           }
        }
        if(bool){
            this.api_mediaManagePlatform_getLevel({data:this.getLeveldata}).then(res=>{
                this.form.level = res.content||''
            })
        }
    }, 
    showMap(){
        this.show_map_dialog = true
    },
    showUserAddDialog(){
        this.show_useradd_dialog = true
    },
    showUserListDialog(){
        this.show_userlist_dialog = true
    },
    userSelectChange(data){
        this.admin = data
    },
    onMapSuccess(mapObj){
        if( mapObj ){
            this.form.tagAddr = mapObj.adress
            this.form.latitude = mapObj.latitude
            this.form.longitude = mapObj.longitude
        }
        this.show_map_dialog = false
    },
    unBindUser(){
        this.admin = {}
    },
    //广告位分类
    getAdList(){
        this.api_common_dicList({data:{ dicType:'mres_cate',token:sessionStorage.getItem('access_token') }}).then(res=>{
            this.adList = res.content?res.content:[]
        })
    },
    //媒体分类
    EleMediaCategory_CallBack(val,valArr){
        this.form.mediaCate = valArr.length==2 ? val :''
    },
    handleClose(){
        this.show_edit_dialog = false
        this.$parent.show_edit_dialog = false;
        this.$refs.form.resetFields();
        this.clear()
    },
    clear(){
        this.medias = []
        this.admin = {}
        this.tool.dp.clearData(this.form)
        this.iDays = ''
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if(this.form.cooperWay==2){
                let cadt=new Date(this.form.chargeDate.replace("-","/")),
                    etdt=new Date(this.form.time[1].replace("-","/"));
                if(cadt>etdt) {
                    this.$message({ message: "计费时间不能大于起止时间的结束时间！", type: "error" });
                    this.form.chargeDate =''
                    this.iDays = ''
                    return
                }
              }
              if( this.form.time && this.form.time.length > 0){
                this.form.dateStart = this.form.time[0];
                this.form.dateEnd = this.form.time[1];
              }else{
                this.form.dateStart='';
                this.form.dateEnd='';
              }
              let data = Object.assign({}, this.form, {
                    mresCate: JSON.stringify(this.form.mresCate),
                    userId: this.admin.userId?this.admin.userId:'',
                    userName: this.admin.username?this.admin.username:'',
                    userNo: this.admin.mobile?this.admin.mobile:'',
                    bdStaffId: this.form.bdStaffId?this.form.bdStaffId:this.getUser.bd.bdId,
                    chargeDate: this.form.cooperWay==1?'':this.form.chargeDate
              })
              if( !this.form.mediaId ){
                  //新增
                  this.api_common_mediaId({data:{prefix:this.prefix_18MD}}).then(res=>{
                      data.mediaId = res.content
                      this.api_mediaSaleManagePlatform_adminMediaAdd({
                        data:data,
                        type:'post',
                      }).then(res=>{
                          this.handleClose()
                          this.$emit('success',true)
                      }).catch(err=>{
                          this.form.mediaId = ''
                          this.form.mresCate = JSON.parse(data.mresCate)
                      })
                  })
              }else{
                  //修改
                  this.api_mediaSaleManagePlatform_adminMediaAdd({data:data,type:'put',pathParams:`/${ this.form.mediaId }`}).then(res=>{
                      this.handleClose()
                      this.$emit('success',true)
                  })
              }
          }
        })
    }
  },
  mounted(){
      this.getAdList()
  },
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Object
      }
  },
  watch:{
      isShow(v){
          this.show_edit_dialog = v
          if( v === true){
              if( this.data && this.data.mediaId ){
                  this.api_mediaSaleManagePlatform_adminMediaDetail({pathParams:`/${ this.data.mediaId }`}).then(res=>{
                      let media = res.content
                      this.tool.dp.assignData(this.getLeveldata, res.content)
                      this.tool.dp.assignData(this.form, res.content)
                      this.form.mediaCate = media.cateCode
                      this.form.mresCate = JSON.parse(media.mresCate)
                      this.admin.userId = media.userId
                      this.admin.userNo = media.userNo
                      this.admin.mobile = media.userNo
                      this.admin.username = media.userName
                      this.form.chargeDate = this.tool.date.format(media.chargeDate, "yyyy-MM-dd");
                      this.form.time.push(media.dateStart)
                      this.form.time.push(media.dateEnd)
                      this.iDays = media.chargeDate ? this.tool.date.dateDiff(this.form.chargeDate,this.form.time[0]) : ''
                      if( media.parCateCode )
                        this.medias.push(media.parCateCode)
                      if( media.cateCode )
                        this.medias.push(media.cateCode)
                  })
              }else{
                   //时间初始化
                let date = new Date();
                var beginTime=this.tool.date.format(new Date(date), "yyyy-MM-dd");
                let time = (date.getFullYear()+3)+"-"+(date.getMonth()+1)+"-"+date.getDate();
                var endTime=this.tool.date.format(new Date(time), "yyyy-MM-dd");
                this.form.time.push(beginTime) ;
                this.form.time.push(endTime);
                this.form.effectDate= beginTime;
              }
          }
      }
  }
}
</script>
<style lang="scss" >
.mediadialog {
    .font_red {
        color: red;
        font-weight:600;
    }
}
</style>
